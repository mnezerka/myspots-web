import Store from "./store"

function SpotStore(args) {
    // call parent constructor
    Store.call(this)
    this.spot = null;
    this.backup = null;
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
    return this.spot && this.backup
}

SpotStore.prototype.setSpot = function(spot) {
    console.log(`SpotStore:setSpot ${JSON.stringify(spot)}`)
    this.spot = spot;
    this.notifyAll();
}

SpotStore.prototype.edit = function() {
    this.backup = this.spot;
    this.notifyAll();
}

SpotStore.prototype.cancel = function() {
    if (this.backup) {
        this.spot = this.backup;
        this.backup = null;
        this.notifyAll();
    }
}

SpotStore.prototype.commit = function() {
    this.backup = null;
    this.notifyAll();
}

export default new SpotStore();