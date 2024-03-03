
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

Spots.prototype.newSpot = function(spot) {
    return {
        id: '', 
        name: '',
        description: '',
        pos: [0, 0],
        dirty: true
    }
}

Spots.prototype.fetch = async function() {

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
            
            this.spots = data.filter(function(item) {
                if (!("name" in item)) {
                    console.warn("Missing spot.name property", item)
                    return false;
                }
                if (!("pos" in item)) {
                    console.warn("Missing spot.pos property", item)
                    return false;
                }
                if (!(Array.isArray(item.pos))) {
                    console.warn("Invalid format of spot.pos, expected array of two members", item)
                    return false;
                }
                if (item.pos.length != 2) {
                    console.warn("Invalid format of spot.pos, expected array of two members", item)
                    return false;
                }

                 return true;
            });
            console.log("Spots:fetched data, count=", this.spots.length);
            this.notifyAll();
        } else {
            console.warn('Unexpected response code: ', response.status);
        }
    } catch (err) {
        console.warn('Something went wrong.', err);
    }
}

Spots.prototype._cleanSpot = function(spot) {
    //return ({id, name, description} = spot, {id, name, pos, description})
    
    return {
        id: spot.id,
        name: spot.name,
        description: spot.description,
        pos: spot.pos 
    }
}

Spots.prototype.create = async function(spot) {

    let result = null;

    if (!identity.isLogged) {
        return;
    }
    
    spot = this._cleanSpot(spot)

    try {
        const response = await fetch("/api/spots", {
            method: 'POST',
            body: JSON.stringify(spot),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${identity.token}`
            },
            referrer: 'no-referrer'
        });
        
        if (response.ok) {
            result = await response.json();
        } else {
            console.warn('Unexpected response code: ', response.status);
        }
    } catch (err) {
        console.warn('Something went wrong.', err);
    }
    
    return result
}

Spots.prototype.update = async function(spot) {

    let result = null;

    if (!identity.isLogged) {
        return result;
    }

    spot = this._cleanSpot(spot)

    try {
        const response = await fetch("/api/spots", {
            method: 'PUT',
            body: JSON.stringify(spot),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${identity.token}`
            },
            referrer: 'no-referrer'
        });
        
        if (response.ok) {
            result = await response.json();
        } else {
            console.warn('Unexpected response code: ', response.status);
        }
    } catch (err) {
        console.warn('Something went wrong.', err);
    }
    
    return result
}



export default new Spots();