import position from "../stores/position"
import app from "../app"
import {formatPos} from "./utils"

function SpotPosition(args) {

    this.el = document.getElementById("spot-position");
    this.el.style.display = "none";
    
    this.elPosition = this.el.getElementsByClassName("pos")[0];

    this.elBtnAdd = this.el.getElementsByClassName("button add")[0];
    this.elBtnAdd.addEventListener("click", this.onAdd.bind(this));
}

SpotPosition.prototype.show = function() {
    let p = position.getPos();
    
    if (p) {
        this.elPosition.textContent = formatPos(p)
    } else {
        this.elPosition.textContent = ''
    }

    this.el.style.display = "block";
}

SpotPosition.prototype.hide = function() {
    this.el.style.display = "none";
}

SpotPosition.prototype.onAdd = function(e) {
    e.preventDefault();
    app.addSpot()
} 

export default SpotPosition;