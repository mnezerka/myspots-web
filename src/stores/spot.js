import Store from "./store"

function SpotStore(args) {
    // call parent constructor
    Store.call(this)
    this.spot = null;
}

// SpotStore is child of Store
Object.setPrototypeOf(SpotStore.prototype, Store.prototype);

SpotStore.prototype.getSpot= function() {
    return this.spot;
}

SpotStore.prototype.isNew = function() {
    return this.spot && !this.spot.id
}

SpotStore.prototype.hasId = function() {
    return this.spot && this.spot.id
}

SpotStore.prototype.isDirty = function() {
    return this.spot && this.spot.dirty
}

SpotStore.prototype.setSpot = function(spot) {
    console.log(`SpotStore:setSpot ${JSON.stringify(spot)}`)
    
    // add dirty attribute if it doesn't exist
    if (spot) {
        if (!("dirty" in spot)) {
            spot.dirty = false
        }
    }
    
    this.spot = spot;
    this.notifyAll();
}

SpotStore.prototype.setDirty = function() {
    
    if (this.spot) {
        this.spot.dirty = true
        this.notifyAll();
    }
}

SpotStore.prototype.unsetDirty = function() {
    
    if (this.spot) {
        this.spot.dirty = false 
        this.notifyAll();
    }
}

export default new SpotStore();