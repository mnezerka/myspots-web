import spot from "../stores/spot"
import app from "../app"
import {formatPos} from "./utils"

function SpotInfo(args) {
    this.el = document.getElementById("spot-info");
    this.el.style.display = "none";
    
    this.elName = this.el.getElementsByClassName("name")[0];
    this.elDescription = this.el.getElementsByClassName("description")[0];
    this.elPos = this.el.getElementsByClassName("pos")[0];

    this.elBtnEdit = this.el.getElementsByClassName("button edit")[0];
    this.elBtnEdit.addEventListener("click", this.onEdit.bind(this));
    this.elBtnEdit.style.display = "none";
}

SpotInfo.prototype.show = function() {
    let s = spot.getSpot()
    
    if (s) {
        this.elName.textContent = s.name
        this.elDescription.textContent = s.description
        this.elPos.textContent = formatPos(s.pos)
        this.elBtnEdit.style.display = "inline-block";
    }

    this.el.style.display = "block";
}

SpotInfo.prototype.hide = function() {
    this.el.style.display = "none";
}

SpotInfo.prototype.onEdit = function(e) {
    e.preventDefault();
    console.log('edit')
    app.editSpot()
} 

export default SpotInfo;