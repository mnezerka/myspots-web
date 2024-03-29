import position from "../stores/position"
import spots from "../stores/spots"
import spot from "../stores/spot"
import app from "../app"

//////////////////////////////////////////////// MapContextMenu

function MapContextMenu(args) {
    this.el = document.getElementById("map-context-menu");
    this.el.style.display = "none";

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        console.log("here");
        if (event.target == this.el) {
            this.hide();
        }
    }
}

MapContextMenu.prototype.show = function() {
    this.el.style.display = "block";
}

MapContextMenu.prototype.hide = function() {
    this.el.style.display = "none";
}

MapContextMenu.prototype.setPosFromEvent = function(e) {
    console.log("MapContextMenu:setPosFromEvent", e)
    this.el.style.left = e.originalEvent.pageX + "px";
    this.el.style.top = e.originalEvent.pageY + "px";
}
//////////////////////////////////////////////// Map

function Map(args) {
    position.registerObserver(this.onUpdatePosition.bind(this));
    spots.registerObserver(this.onUpdateSpots.bind(this));
    spot.registerObserver(this.onUpdateSpot.bind(this));

    this.map = L.map('map').setView([51.505, -0.09], 13);

    //this.contextMenu = new MapContextMenu()

    this.markers = {};

    // active position on map
    this.activeMarker = null;

    this.groupBasic = L.featureGroup([]).addTo(this.map);
    
    this.icons = {
        parking: L.divIcon({ html: '<i class="fa-solid fa-square-parking fa-2x"></i>', iconSize: [16, 16], className: 'myDivIcon' }),
        parkingActive: L.divIcon({ html: '<i class="fa-solid fa-square-parking fa-2x"></i>', iconSize: [16, 16], className: 'myDivIcon active' })
    }

    this.tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    this.map.on('click', this.onMapClick.bind(this));
    
    // this.map.on('contextmenu', this.onMapContextMenu.bind(this));
   
    // custom control - localize
    L.Control.Localize = L.Control.extend({
        onAdd: function(map) {
            let el = L.DomUtil.create('div');
            el.className = "myspots-control";
            el.innerHTML = '<i class="fa-regular fa-circle-dot"></i>';
            el.setAttribute('title', 'Show my location');
            
            L.DomEvent.on(el, "click", function(ev) {
                L.DomEvent.stopPropagation(ev);
                this.localize();
            }.bind(this))

            this.elCtrlLocalize = el;
            return this.elCtrlLocalize;
        }.bind(this),
    
        onRemove: function(map) {
            L.DomEvent.off(this.elCtrlLocalize);
        }
    });
    
    this.ctrlLocalize = new L.Control.Localize({position: 'topright'}).addTo(this.map); 

    // custom control - fit all content

    L.Control.Fit = L.Control.extend({
        onAdd: function(map) {
            let el = L.DomUtil.create('div');
            el.className = "myspots-control";
            el.innerHTML = '<i class="fa-solid fa-down-left-and-up-right-to-center"></i>';
            el.setAttribute('title', 'Fit all content');
            
            L.DomEvent.on(el, "click", function(ev) {
                L.DomEvent.stopPropagation(ev);
                this.fit();
            }.bind(this))

            this.elCtrlFit = el;
            return this.elCtrlFit;
        }.bind(this),
    
        onRemove: function(map) {
            L.DomEvent.off(this.elCtrlFit);
        }
    });
    
    this.ctrlFit = new L.Control.Fit({position: 'topright'}).addTo(this.map); 
    
       // custom control - center

    L.Control.Center = L.Control.extend({
        onAdd: function(map) {
            let el = L.DomUtil.create('div');
            el.className = "myspots-control";
            el.innerHTML = '<i class="fa-solid fa-arrows-to-dot"></i>';
            el.setAttribute('title', 'Center');
            
            L.DomEvent.on(el, "click", function(ev) {
                L.DomEvent.stopPropagation(ev);
                this.center();
            }.bind(this))

            this.elCtrlCenter = el;
            return this.elCtrlCenter;
        }.bind(this),

        onRemove: function(map) {
            L.DomEvent.off(this.elCtrlCenter);
        }
    });
    
    this.ctrlCenter = new L.Control.Center({position: 'topright'}).addTo(this.map); 
}

Map.prototype.onMapClick = function(e) {
    //console.log("click in map", e);
    app.setPosition([e.latlng.lat, e.latlng.lng])
}

Map.prototype.onMapContextMenu = function(e) {
    console.log("context menu", e)
    //e.preventDefault()
    this.contextMenu.setPosFromEvent(e);
    this.contextMenu.show();
}
 
Map.prototype.onMarkerClick = function(e) {
    app.setActiveSpot(e.target.spot)
}

Map.prototype.localize = function() {
    console.log("Map:localize:enter");

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.onLocalized.bind(this));
    } else {
        console.warn("Geolocation is not supported by this browser.");
    }

    console.log("Map:localize:leave");
}

Map.prototype.onLocalized = function(position) {
    console.log("Map:onLocalized:enter", position)

    const p = new L.LatLng(position.coords.latitude, position.coords.longitude);

    position.setPos(p);
    this.map.panTo(p);

    console.log("Map:onLocalized:leave")
}

Map.prototype.center = function() {
    console.log("Map:center:enter");

    if (position.getPos()) {
        this.map.panTo(position.getPos());
    }

    console.log("Map:center:leave");
}

Map.prototype.fit = function() {
    points = [];

    for (var key in this.markers) {
        points.push(this.markers[key].getLatLng());
    }

    console.log("Map:fit:points", points);
    
    if (points.length > 0) {
        this.map.fitBounds(points);
    }
}

// called when global actual position was changed
Map.prototype.onUpdatePosition = function() {
    let p = position.getPos()
    console.log("Map:onUpdatePosition:enter", p);
    
    // if we have position
    if (p) {
        // if marker is already created => move it to new pos
        if (this.posMarker) {
            this.posMarker.setLatLng(p)
        } else {
            this.posMarker = L.marker(p).addTo(this.map) 
        }
    } else {
        // remove marker from map if exists
        if (this.posMarker) {
            this.map.removeLayer(this.posMarker);
            this.posMarker = null;
        }
    }

    console.log("Map:onUpdatePosition:leave");
}

Map.prototype.onUpdateSpots = function() {
    if (spots.getSpots()) {
        let activeSpot = spot.getSpot()
        for (let i = 0; i < spots.getSpots().length; i++) {
            const s = spots.getSpots()[i];
            if (s.id in this.markers) {
                continue;
            }
        
            const markerOptions = {
                icon: this.icons.parking
            }

            const p = new L.LatLng(s.pos[0], s.pos[1]);
            var m = L.marker(p, markerOptions)
                .addTo(this.map)
                .on('click', this.onMarkerClick.bind(this));

            m.spot = s;
            this.markers[s.id] = m;
            
            // new spot could be active spot (e.g. once new spot was created)
            if (activeSpot && activeSpot.id == s.id) {
                this._setActiveMarker(m);
            } 
        }

        this.fit();
    }
}

Map.prototype.onUpdateSpot = function() {
    if (spot.hasId()) {
        let s = spot.getSpot()
        for (let id in this.markers) {
            if (id == s.id) {
                this._setActiveMarker(this.markers[id])
            }
        }
    } else {
        this._setActiveMarker(null)
    }
}

Map.prototype._setActiveMarker = function(m) {
    // remove previous active marker
    if (this.activeMarker) {
        this.activeMarker.setIcon(this.icons.parking)
    }
    // set new active marker or do nothing (no active marker)
    if (m) {
        m.setIcon(this.icons.parkingActive)
        this.activeMarker = m 
    }
}

export default Map;