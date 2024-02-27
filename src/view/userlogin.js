import identity from "../stores/identity"

function UserLogin(args) {
    this.el = document.getElementById("user-login");
    this.el.style.display = "none";
    
    this.elEmail = this.el.getElementsByClassName("input email")[0];
    this.elPassword = this.el.getElementsByClassName("input password")[0];

    this.elSubmit = this.el.getElementsByClassName("submit")[0];
    this.elSubmit.addEventListener("click", this.onSubmit.bind(this));
}

UserLogin.prototype.show = function() {
    this.el.style.display = "block";
}

UserLogin.prototype.hide = function() {
    this.el.style.display = "none";
}

UserLogin.prototype.onSubmit = function(e) {

    console.log("UserLogin:Submit:enter", e)

    e.preventDefault();

    let email = this.elEmail.value;
    let password = this.elPassword.value;

    console.log("UserLogin:", email, password);

    //this.onSubmit(email, password);

    if (email == "" || password == "") {
        // do nothing, keep dialog open
        return;
    }

    identity.login(email, password);
}

export default UserLogin;