import spot from "./stores/spot"

function SpotInfo(args) {
    console.log("SpotInfo:constructor:enter")

    this.el = document.getElementById("spot-info");
    this.el.style.display = "none";

    console.log("SpotInfo:constructor:leave")
}

SpotInfo.prototype.show = function() {
    let s = spot.getSpot()

    this.el.innerHTML = `
        <div class="title">${s.name}</div>
        <div class="description">${s.description}</div>
    `
    this.el.style.display = "block";
}

SpotInfo.prototype.hide = function() {
    this.el.style.display = "none";
}

export default SpotInfo;