
import identity from "./identity"
import Store from "./store"

function Spots(args) {
    // call parent constructor
    Store.call(this)

    this.spots = [];
    this.active = [];
}

// Spots is child of Store
Object.setPrototypeOf(Spots.prototype, Store.prototype);

Spots.prototype.getSpots = function() {
    return this.spots;
}

Spots.prototype.getActive = function() {
    return this.active;
}

Spots.prototype.setActive = function(spot) {
    this.active = spot;
    this.notifyAll()
}

Spots.prototype.fetch = async function() {

    console.log("Spots:fetch:enter");

    if (!identity || !identity.isLogged) {
        return;
    }

    try {
        const response = await fetch("/api/spots", {
            method: 'GET',
            headers: {
                'Authorization': `JWT ${identity.token}`
            },
            referrer: 'no-referrer'
        });

        if (response.ok) {
            const data = await response.json();
            
            console.log("Spots:fetch:data", data);
            this.spots = data.filter(function(item) {
                if (!("name" in item)) {
                    console.warn("Missing spot.name property", item)
                    return false;
                }
                if (!("coordinates" in item)) {
                    console.warn("Missing spot.coordinates property", item)
                    return false;
                }
                if (!(Array.isArray(item.coordinates))) {
                    console.warn("Invalid format of spot.coordinates, expected array of two members", item)
                    return false;
                }
                if (item.coordinates.length != 2) {
                    console.warn("Invalid format of spot.coordinates, expected array of two members", item)
                    return false;
                }

                 return true;
            });
            console.log("Spots:fetch:filtered data", this.spots);
            this.notifyAll();
        } else {
            console.warn('Unexpected response code: ', response.status);
        }
    } catch (err) {
        console.warn('Something went wrong.', err);
    }
}

Spots.prototype.create = async function(spot) {

    console.log("Spots:create:enter", spot);

    if (!identity.isLogged) {
        return;
    }

    try {
        const response = await fetch("/api/spots", {
            method: 'POST',
            body: `{"name": "${spot.name}", "description": "${spot.description}", "coordinates": [${spot.position.lat}, ${spot.position.lng}]}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${identity.token}`
            },
            referrer: 'no-referrer'
        });
        
        if (response.ok) {
            const data = await response.json();
            //console.log("Spots:create:data", data);
            //this.notifyAll();
            this.fetch()

        } else {
            console.warn('Unexpected response code: ', response.status);
        }
    } catch (err) {
        console.warn('Something went wrong.', err);
    }
}

export default new Spots();