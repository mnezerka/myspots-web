import identity from "./stores/identity"
import spot from "./stores/spot"
import UserInfo from "./userinfo"
import UserLogin from "./userlogin"
import SpotInfo from "./spotinfo"
import SpotForm from "./spotform"
import {APP_STATE_IDLE, APP_STATE_POSITION, APP_STATE_SPOT_VIEW, APP_STATE_LOGIN} from "./app"


const TOOLBAR_CONTENT_SPOT_IDLE = 'spot-idle';
const TOOLBAR_CONTENT_USER_INFO = 'user-info';
const TOOLBAR_CONTENT_USER_LOGIN = 'user-login';
const TOOLBAR_CONTENT_SPOT_INFO = 'spot-info';
const TOOLBAR_CONTENT_SPOT_FORM = 'spot-form';

function Toolbar(args) {

    this.app = args.app;
    this.onLogin = args.onLogin || empty_function;
    this.onLogout = args.onLogout || empty_function;
    //this.onAdd = args.onAdd || empty_function;
    //this.onCancel = args.onCancel || empty_function;

    this.app.registerObserver(this.onUpdateApp.bind(this)); 
    identity.registerObserver(this.onUpdateIdentity.bind(this)); 

    this.userInfo = new UserInfo({
        app: this.app,
        identity: this.identity,
        onLogin: this.onLogin,
        onLogout: this.onLogout
        });

    this.userLogin = new UserLogin({
        identity: this.identity,
     });

    this.spotInfo = new SpotInfo();

    this.spotForm = new SpotForm({});

    spot.registerObserver(this.onSpotChange.bind(this)); 
    
    this.contentHandlers = {};
    this.contentHandlers[TOOLBAR_CONTENT_SPOT_IDLE] = null;
    this.contentHandlers[TOOLBAR_CONTENT_USER_INFO] = this.userInfo;
    this.contentHandlers[TOOLBAR_CONTENT_USER_LOGIN] = this.userLogin;
    this.contentHandlers[TOOLBAR_CONTENT_SPOT_INFO] = this.spotInfo;
    this.contentHandlers[TOOLBAR_CONTENT_SPOT_FORM] = this.spotForm;
    
    this.switchContent(TOOLBAR_CONTENT_USER_INFO);
}

Toolbar.prototype.onUpdateIdentity = function(identity) {
    console.log("Toolbar:onUpdateIdentity:enter", identity);

    this.switchContent(TOOLBAR_CONTENT_USER_INFO)

    console.log("Toolbar:onUpdateIdentity:leave")
}

Toolbar.prototype.onUpdateApp = function(publisher) {
    console.log("Toolbar:onUpdateApp:enter", publisher);
    
        console.log("Toolbar: app is in state: ", this.app.state)

    if (this.app.state == APP_STATE_IDLE) {
    } else if (this.app.state == APP_STATE_POSITION) {
        if (identity.isLogged) {
            this.switchContent(TOOLBAR_CONTENT_SPOT_FORM);
        } 
    } else if (this.app.state == APP_STATE_SPOT_VIEW) {
        this.switchContent(TOOLBAR_CONTENT_SPOT_INFO);
    } else if (this.app.state == APP_STATE_LOGIN) {
        this.switchContent(TOOLBAR_CONTENT_USER_LOGIN)
    } else {
        console.log("Toolbar: app is in unknown state")
    }

    console.log("Toolbar:onUpdateApp:leave")
}

Toolbar.prototype.onSpotChange = function() {
    if (spot.getSpot()) {
        this.switchContent(TOOLBAR_CONTENT_SPOT_INFO)
    } else {
        this.switchContent(TOOLBAR_CONTENT_SPOT_IDLE)
    }
}

Toolbar.prototype.switchContent = function(content) {

    console.log(`Toolbar:switchContent: ${this.content} -> ${content}`);
    
    for (let ch in this.contentHandlers) {
        if (ch == content) {
            this.contentHandlers[ch]  && this.contentHandlers[ch].show()
        } else {
            this.contentHandlers[ch]  && this.contentHandlers[ch].hide()
        }
    }
    
    this.content = content
}

export default Toolbar