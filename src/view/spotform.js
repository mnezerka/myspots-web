import spot from "../stores/spot"
import app from "../app"
import {formatPos} from "./utils"

function SpotForm(args) {
    this.el = document.getElementById("spot-form");
    this.el.style.display = "none";

    this.elTitle = this.el.getElementsByClassName("title")[0];
    this.elSubmit = this.el.getElementsByClassName("submit")[0];
    this.elCancel = this.el.getElementsByClassName("cancel")[0];

    this.elName = this.el.getElementsByClassName("input name")[0];
    this.elDescription = this.el.getElementsByClassName("input description")[0];
    this.elPos = this.el.getElementsByClassName("pos")[0];

    this.elSubmit.addEventListener("click", this.onClickSubmit.bind(this));
    this.elCancel.addEventListener("click", this.onClickCancel.bind(this));
}

SpotForm.prototype.onClickSubmit = function(e) {
    e.preventDefault();

    let name = this.elName.value;
    let description = this.elDescription.value;

    if (name.length <= 0) {
        return
    }

    let s = spot.getSpot();

    s.name = name;
    s.description = description;

    spot.setSpot(s);
    app.saveSpot()
}

SpotForm.prototype.onClickCancel = function(e) {
    e.preventDefault();
    app.cancelSpot();
}

SpotForm.prototype.show = function() {
    let s = spot.getSpot();
    
    if (s) {
        if (s.id) {
            this.elTitle.textContent = 'Edit Spot'
        } else {
            this.elTitle.textContent = 'New Spot'
        }

        this.elName.value = s.name
        this.elDescription.textContent = s.description
        this.elPos.textContent = formatPos(s.pos)
    }
    this.el.style.display = "block";
}

SpotForm.prototype.hide = function() {
    this.el.style.display = "none";
}

export default SpotForm;