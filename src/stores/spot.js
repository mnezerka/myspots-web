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

SpotStore.prototype.setSpot = function(spot) {
    if (spot != this.spot) {
        this.spot = spot;
        this.notifyAll()
    }
}

export default new SpotStore();