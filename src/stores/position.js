import Store from "./store"

function PositionStore() {
    Store.call(this)
    this.pos = null
}

Object.setPrototypeOf(PositionStore.prototype, Store.prototype);

PositionStore.prototype.getPos = function() {
    return this.pos;
}

PositionStore.prototype.setPos = function(pos) {
    this.pos = pos
    this.notifyAll()
}

export default new PositionStore();