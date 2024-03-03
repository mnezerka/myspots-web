import identity from "../stores/identity"
import position from "../stores/position"
import spot from "../stores/spot"
import UserInfo from "./userinfo"
import UserLogin from "./userlogin"
import SpotInfo from "./spotinfo"
import SpotForm from "./spotform"
import SpotPosition from "./spotposition"

const TOOLBAR_CONTENT_SPOT_IDLE = 'spot-idle';
const TOOLBAR_CONTENT_USER_INFO = 'user-info';
const TOOLBAR_CONTENT_USER_LOGIN = 'user-login';
const TOOLBAR_CONTENT_SPOT_INFO = 'spot-info';
const TOOLBAR_CONTENT_SPOT_FORM = 'spot-form';
const TOOLBAR_CONTENT_SPOT_POSITION = 'spot-position';

function Toolbar(args) {
    
    this.app = args.app
    this.onLogin = args.onLogin || empty_function;
    this.onLogout = args.onLogout || empty_function;
    //this.onAdd = args.onAdd || empty_function;
    //this.onCancel = args.onCancel || empty_function;

    identity.registerObserver(this.onUpdateIdentity.bind(this)); 
    position.registerObserver(this.onUpdateSpotOrPosition.bind(this)); 
    spot.registerObserver(this.onUpdateSpotOrPosition.bind(this)); 

    this.userInfo = new UserInfo({
        onLogin: this.onLogin,
        onLogout: this.onLogout
    });

    this.userLogin = new UserLogin({});
    this.spotInfo = new SpotInfo();
    this.spotPosition = new SpotPosition();
    this.spotForm = new SpotForm({});
    
    this.contentHandlers = {};
    this.contentHandlers[TOOLBAR_CONTENT_SPOT_IDLE] = null;
    this.contentHandlers[TOOLBAR_CONTENT_USER_INFO] = this.userInfo;
    this.contentHandlers[TOOLBAR_CONTENT_USER_LOGIN] = this.userLogin;
    this.contentHandlers[TOOLBAR_CONTENT_SPOT_INFO] = this.spotInfo;
    this.contentHandlers[TOOLBAR_CONTENT_SPOT_FORM] = this.spotForm;
    this.contentHandlers[TOOLBAR_CONTENT_SPOT_POSITION] = this.spotPosition;
    
    this.switchContent(TOOLBAR_CONTENT_USER_INFO);
}

Toolbar.prototype.onUpdateIdentity = function(identity) {
    this.switchContent(TOOLBAR_CONTENT_USER_INFO)
}

Toolbar.prototype.onUpdateSpotOrPosition = function() {
    
    console.log(`Toolbar:onUpdateSpotOrPosition: ${JSON.stringify(spot.getSpot())}`);

    // first check if some spot is active
    if (spot.getSpot()) {
        if (spot.isDirty()) {
            this.switchContent(TOOLBAR_CONTENT_SPOT_FORM)
        } else {
            this.switchContent(TOOLBAR_CONTENT_SPOT_INFO)
        }
    } else {
        if (position.getPos()) {
            this.switchContent(TOOLBAR_CONTENT_SPOT_POSITION)
        } else {
            this.switchContent(TOOLBAR_CONTENT_SPOT_IDLE)
        }
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