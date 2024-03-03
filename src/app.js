
import identity from './stores/identity'
import Store from "./stores/store"
import position from "./stores/position"
import spot from "./stores/spot"
import spots from "./stores/spots"
import Toolbar from "./view/toolbar"
import Map from "./view/map"

function App() {
    // call parent constructor
    Store.call(this)

    // register bindings for data events
    identity.registerObserver(this.onUpdateIdentity.bind(this));
   
    // create view components
    this.toolbar = new Toolbar({
        app: this,
        onLogin: this.onLogin.bind(this),
        onLogout: this.onLogout.bind(this),
        onCancel: this.onCancel.bind(this)
    });

    this.map = new Map({
        spots: this.spots,
        spotStore: this.spotStore,
        positionStore: this.positionStore,
    });
    
    // fetch current user identity
    identity.fetchProfile();
}

// App is child of Store
Object.setPrototypeOf(App.prototype, Store.prototype);

App.prototype.onUpdateIdentity = function() {
    if (identity.isLogged && spots.getSpots().length == 0) {
        spots.fetch();
    }
}

App.prototype.onLogin = function(e) {
    this.setState(APP_STATE_LOGIN);
}

App.prototype.onLogout = function(e) {
    identity.logout();
}

App.prototype.onCancel = function(e) {
    this.setState(APP_STATE_IDLE);
    position.setPos(null);
    spot.setSpot(null);
}

App.prototype.setPosition = function(pos) {
    // if some spot is active and is being edited then don't allow to change pos
    if (spot.isDirty()) {
        return
    }

    spot.setSpot(null);
    position.setPos(pos);
}

App.prototype.setActiveSpot= function(s) {

    // if some spot is active and being edited, don't allow to change active spot
    if (spot.isDirty()) {
        return
    }
 
    position.setPos(null);
    spot.setSpot(s);
}

App.prototype.addSpot = function() {
    let s = spots.newSpot()
    s.pos = position.getPos()
    spot.setSpot(s)
}

App.prototype.editSpot = function() {
    spot.setDirty()
}

App.prototype.cancelSpot = function() {
    if (spot.isNew()) {
        spot.setSpot(null)
    } else {
        spot.unsetDirty()
    }
}
App.prototype.saveSpot = async function(s) {
    let saved = null;

    if (spot.isNew()) {
        saved = await spots.create(s)
    } else {
        saved = await spots.update(s)
    }
    
    console.log(saved)

    // refetch spots
    spots.fetch();

    // keep saved spot active 
    spot.setSpot(saved);
}

export default new App();