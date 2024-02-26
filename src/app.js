
import identity from './stores/identity'
import Store from "./stores/store"
import positionStore from "./stores/position"
import spot from "./stores/spot"
import spots from "./stores/spots"
import Toolbar from "./toolbar"
import Map from "./map"

export const APP_STATE_IDLE = 'idle';
export const APP_STATE_POSITION = 'position';
export const APP_STATE_SPOT_VIEW = 'spot-view';
export const APP_STATE_LOGIN = 'login';

function App() {
    console.log("App:constructor:enter")

    // call parent constructor
    Store.call(this)

    document.addEventListener('wizards', function (event) {
        app.innerHTML = template(event.detail);
    }); 

    //this.identity = new Identity();
    identity.registerObserver(this.onUpdateIdentity.bind(this));
    
    positionStore.registerObserver(this.onUpdatePosition.bind(this));

    spot.registerObserver(this.onSpotChange.bind(this));
   
    this.state = null;

    this.toolbar = new Toolbar({
        app: this,
        onLogin: this.onLogin.bind(this),
        onLogout: this.onLogout.bind(this),
        onAdd: this.onAdd.bind(this),
        onCancel: this.onCancel.bind(this)
    });

    /*
    this.loginModal = new LoginModal({
        onClose: this.onLoginModalClose.bind(this),
        onSubmit: this.onLoginModalSubmit.bind(this)
    });
    */
 
    /*
    this.addSpotModal = new AddSpotModal({
        onClose: this.onAddSpotModalClose.bind(this),
        onSubmit: this.onAddSpotModalSubmit.bind(this)
    });
    */

    this.map = new Map({
        spots: this.spots,
        spotStore: this.spotStore,
        positionStore: this.positionStore,
    });
    
    this.setState(APP_STATE_IDLE);

    identity.fetchProfile();

    console.log("App:constructor:leave")
}

// App is child of Store
Object.setPrototypeOf(App.prototype, Store.prototype);

App.prototype.onUpdateIdentity = function() {
    console.log("App:onUpdateIdentity:enter");

    if (identity.isLogged && spots.getSpots().length == 0) {
        spots.fetch();
    }

    console.log("App:onUpdateIdentity:leave")
}

App.prototype.onSpotChange = function(spot) {
    console.log("App:onSpotChange:enter");
    
    if (spot.getSpot()) {
        this.setState(APP_STATE_SPOT_VIEW);
        positionStore.setPos(null);
    }

    console.log("App:onSpotChange:leave");
}

App.prototype.onLogin = function(e) {
    console.log("App:onLogin:enter");
    //this.loginModal.show();
    this.setState(APP_STATE_LOGIN);
    console.log("App:onLogin:leave");
}

App.prototype.onLoginModalClose = function(e) {
    console.log("App:onLoginModalClose:enter");
    this.loginModal.hide();
    console.log("App:onLoginModalClose:leave");
}

App.prototype.onLoginModalSubmit = async function(email, password) {

    console.log("App:onLoginModalSubmit:enter", email, password);

    if (email == "" || password == "") {
        // do nothing, keep dialog open
        return;
    }

    identity.login(email, password);
    this.loginModal.hide();
}

App.prototype.onLogout = function(e) {
    console.log("App:onLogout:enter");
    identity.logout();
    console.log("App:onLogout:leave");
}

App.prototype.onAdd = function(e) {
    console.log("App:onAdd:enter");
    //this.loginModal.show();

    let pos = this.map.getPos();
    console.log(pos);
    if (pos) {
        this.addSpotModal.show();
    }

    console.log("App:onAdd:leave");
}

App.prototype.onCancel = function(e) {
    console.log("App:onCancel:enter");
    this.setState(APP_STATE_IDLE);
    positionStore.setPos(null);
    spot.setSpot(null);
    console.log("App:onAdd:leave");
}

App.prototype.onAddSpotModalClose = function(e) {
    console.log("App:onAddSpotModalClose:enter");
    this.addSpotModal.hide();
    console.log("App:onAddSpotModalClose:leave");
}

App.prototype.onUpdatePosition = function(store) {
    console.log("App:onUpdatePosition:enter", store.pos );

    if (store.pos !== null) {
        spot.setSpot(null);
        this.setState(APP_STATE_POSITION)
    }

    console.log("App:onUpdatePosition:leave");
}

App.prototype.onAddSpotModalSubmit = async function(name) {

    console.log("App:onAddSpotModalSubmit:enter", name);

    pos = this.map.getPos();

    if (name == "") {
        // do nothing, keep form open
        return;
    }

    if (pos) {
        console.log(pos);
        spots.create({
            "name": name,
            "position": pos
        })
    }

    this.addSpotModal.hide();

    console.log("App:onAddSpotModalSubmit:leave");
}

App.prototype.setState = function (state) {
    console.log(`App:setState: ${state}`);
    if (this.state != state) {
        console.log(`App state transition: ${this.state} -> ${state}`);
        this.state = state;
        this.notifyAll();
    }
}

var app = new App();