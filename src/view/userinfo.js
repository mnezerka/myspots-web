import identity from "../stores/identity"

function UserInfo(args) {
    this.onLogin = args.onLogin || function() {};
    this.onLogout = args.onLogout || function() {};
 
    this.el = document.getElementById("user-info");
    this.el.style.display = "none";
}

UserInfo.prototype.show = function() {
    
    if (identity.isLogged) {
        this.el.innerHTML = `
            <div class="name">Name: ${identity.name}</div>
            <div class="email">Email: ${identity.email}</div>
            <span id="user-info-logout">Logout</span>
        `
        let el = document.getElementById("user-info-logout");
        el.addEventListener("click", this.onLogout);
    } else {
        this.el.innerHTML = `<span id="user-info-login">Login</span>`
        let el = document.getElementById("user-info-login");
        el.addEventListener("click", this.onLogin);
    }

    this.el.style.display = "block";
}

UserInfo.prototype.hide = function() {
    this.el.style.display = "none";
}

export default UserInfo;