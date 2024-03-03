const http = require("http");

const standardHeaders = {
    "Content-Type": "application/json",
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Request-Headers': '*',
    'Access-Control-Max-Age': 2592000, // 30 days
  };

let spots = [
    {
        "id": "646b5d2167e11af57a59ed41",
        "name": "SAP",
        "description": "This is SAP location in Brno",
        "pos": [
            49.18041,
            16.605665
        ]
    },
    {
        "id": "746b5d2167e11af57a59ed41",
        "name": "Hala Rondo",
        "description": "A place where people play ice hockey",
        "pos": [
            49.1854922,
            16.6020447
        ]
    }
]

let routes = {
    "POST:/api/login": {
        "accessToken": "access-token-value",
        "refreshToken": "refresh-token-value"
    },
    "GET:/api/profile": {
        "name": "mn",
        "email": "michal.nezerka@gmail.com",
    },
    "GET:/api/spots": spots,
    "POST:/api/spots": spotsPost,
    "PUT:/api/spots": spotsPut
}

function getBody(request) {
    return new Promise((resolve) => {
        const bodyParts = [];
        let body;
        request.on('data', (chunk) => {
            bodyParts.push(chunk);
        }).on('end', () => {
            body = Buffer.concat(bodyParts).toString();
            resolve(body)
        });
    });
}

function genId() {
    let length = 24
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

async function spotsPost(req, res) {

    let spot = await getBody(req);
    console.log("body is:", spot) 
    spot = JSON.parse(spot)
    spot.id = genId() 
    console.log("new spot is:", spot) 
    spots.push(spot);
    res.writeHead(200, standardHeaders);
    res.end(JSON.stringify(spot));
}

async function spotsPut(req, res) {

    let spot = await getBody(req);
    console.log("body is:", spot) 
    spot = JSON.parse(spot)
    
    let found = false;
    for (let i = 0; i < spots.length; i++) {
        if (spots[i].id == spot.id) {
            found = true
            spots[i] = spot
        }
    }
    
    if (found) {
        res.writeHead(200, standardHeaders);
        res.end(JSON.stringify(spot));
    } else {
        res.writeHead(404, standardHeaders);
    }
}


console.log("----- Routes -----");
console.log(routes);

console.log("----- Routes -----");

const requestListener = function(req, res) {
    
    console.log(req.method + ' ' + req.url + ' HTTP/' + req.httpVersion, req.headers.host);
    
    let headers = standardHeaders;

    // console.log(req.headers)
    
    let routeId = `${req.method}:${req.url}`
    
    if (routeId in routes) {
       let route = routes[routeId];

        if (req.method === 'OPTIONS') {
            res.writeHead(204, headers);
            res.end();
            console.log(" -> 204");
            return;
        }
        
        // if handler is provided
        if (typeof route === 'function') { 
            route(req, res); 
            return
        }
        
        res.writeHead(200, headers);
        res.end(JSON.stringify(routes[routeId]));
        console.log(" -> ", routes[routeId]);
    } else {
        res.writeHead(404, standardHeaders);
        res.end("The requested resource was not found")
        console.log(" -> 404 Not Found ");
    }
};

// pass on the request listener
const server = http.createServer(requestListener);

// set port number as per choice
server.listen(8081);
