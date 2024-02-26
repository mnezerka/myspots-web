import empty_function from "./utils"
import position from "./stores/position"
import spots from "./stores/spots"

function SpotForm(args) {
    console.log("SpotForm:constructor:enter")

    this.onClose = args.onClose || empty_function;
    //this.onSubmit = args.onSubmit || empty_function;
    this.onSubmit = args.onSubmit || function() {};

    this.el = document.getElementById("spot-form");
    this.el.style.display = "none";

    this.elClose = this.el.getElementsByClassName("close")[0];
    this.elSubmit = this.el.getElementsByClassName("submit")[0];

    this.elName = this.el.getElementsByClassName("input name")[0];
    this.elDescription = this.el.getElementsByClassName("input description")[0];

    this.elSubmit.addEventListener("click", this.onClickSubmit.bind(this));
    this.elClose.addEventListener("click", this.onClose);

    console.log("SpotForm:constructor:leave")
}

SpotForm.prototype.onClickSubmit = function(e) {
    e.preventDefault();

    let name = this.elName.value;
    let description = this.elDescription.value;
    
    console.log(name, name.length)
    
    if (name.length > 0) {

        let p = position.getPos();
        
        let s = {
            name,
            description,
            position: p
        }
        
        console.log(s)

        //this.onSubmit(name, description);
        spots.create(s)
    }
}

SpotForm.prototype.show = function() {
    this.el.style.display = "block";
}

SpotForm.prototype.hide = function() {
    this.el.style.display = "none";
}

export default SpotForm;