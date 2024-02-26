function Store() {
    console.log(`${this.constructor.name}-Store:constructor:enter+leave`)
    this.observers = []; 
}

Store.prototype.registerObserver = function(observer) {
    this.observers.push(observer);
}

Store.prototype.notifyAll = function() {
    this.observers.forEach(function(observer) { observer(this)}.bind(this))
}

export default Store;