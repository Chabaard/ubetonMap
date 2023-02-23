  // L vient du package internet de leaflet
  const url = 'http://localhost:3316/excess';

  const app = {
    map: L.map('ubeton-map'),
    markers: [],
    latLng: {
        init: [46.827638,2.213749],
    },
    markerIcons : {
        markerToupieGreen : L.icon({
            iconUrl: 'toupie-green.png',
            shadowUrl: 'toupie-green.png',
            iconSize:     [54, 33], 
            shadowSize:   [0, 0],
            className: 'icon-marker',
            }),
        markerToupieRed : L.icon({
            iconUrl: 'toupie-red.png',
            shadowUrl: 'toupie-red.png',
            iconSize:     [54, 33], 
            shadowSize:   [0, 0],
            className: 'icon-marker',
            }),
    },
    layers: {
        classic: {
            layer:'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            options:{ 
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
                maxZoom: 12,
            },
        }
    },

    listExcess: [

    ],
    utils: {
        getRandomInt(max) {
            return Math.floor(Math.random() * max);
        },
        // condition pour gérer le zoom
        illZoomAfterClick () {
            return app.map.getZoom() < 10 ? 10 : app.map.getZoom();
        },
        // condition pour gérer le pluriel
        plural(number) {
            return number > 1? 's' : '' ;
        }
    },
    // permetd'update la position d'un marker
    updateMarkerPos(marker, {lat, lng}) {
        marker.setLatLng(new L.LatLng(lat, lng));
    },
    // sert a charger les marker de camions dans une zone
    loadMarkerInArea() {
        // cherche les marker dans une zone de 30km
        const area = 30;

        app.listExcess.forEach((excess) => {
            excess.isActive = false;
            // calcul la distance du marker du point indiqué par l'user
            var userPoint = L.latLng(app.userMarker.getLatLng().lat, app.userMarker.getLatLng().lng);
            var point = L.latLng(excess.latitude, excess.longitude);
            var distance = Math.round(userPoint.distanceTo(point)/1000);

            // affiche les markes sous conditions
            if (distance < area) {
                excess.marker = app.createMarker(excess)
            } 
        });
            
    },
    getActiveMarker() { return app.listExcess.filter((marker) => marker.isActive)},
    onClick(e) {
            //supprime les markers existants
            app.markers.forEach((marker) => marker.remove());
            const {lat, lng} = e.latlng;

            //condition pour savoir s'il y a déjà un marker sur la map
            // si pas de marker ça en fait un au point cliqué
            // sinon il update la position du marker
            app.userMarker 
            ? app.updateMarkerPos(app.userMarker, e.latlng) 
            : app.userMarker = L.marker([lat, lng]).addTo(app.map);

            // Permet de mettre le curseur au bon zoom et a la position selectionnée
            app.map.setView([lat, lng], app.utils.illZoomAfterClick(), {animate: true, duration: 1} );

            //affiche les nouveaux marker
            app.loadMarkerInArea();
            app.createCards(app.getActiveMarker())
    },
    createCards(listData){
        if ('content' in document.createElement('template')) {
            const container = document.querySelectorAll("#ubeton-container-cards");
            if (container[1]) container[1].remove();
            container[0].innerHTML = '';
            for (let i = 0; i < 4; i++){
            listData.forEach((data) => {
                    const template = document.getElementById("ubeton-cards");
                    const clone = template.content.cloneNode(true);
                    const card = clone.querySelector(".ubeton-card");
                    const city = clone.querySelector(".ubeton-city");
                    city.textContent = data.city;
                    const type = clone.querySelector(".ubeton-type");
                    type.textContent = data.beton;
                    const weight = clone.querySelector(".ubeton-weight .ubeton-font-weight");
                    weight.textContent = data.quantity + " m3";
                    // const camion = clone.querySelector(".ubeton-camion");
                    // camion.textContent = "camion " + data.truckType;
                    const img = clone.querySelector("ubeton-img");
                    card.addEventListener('mouseenter', (e) => {
                        data.marker.setIcon(app.markerIcons.markerToupieRed)
                    })
                    card.addEventListener('mouseleave', (e) => {
                        data.marker.setIcon(app.markerIcons.markerToupieGreen)
                    })
                    container[0].appendChild(clone);
            });
            
        }}
    },
    createMarker(excess) {
        excess.isActive = true;
        const newMarker = L.marker([excess.latitude, excess.longitude], {icon: app.markerIcons.markerToupieGreen})
            .addTo(app.map)
            .bindPopup(`
            <p class='ubeton-popup-text'>
                ${excess.quantity}m3 disponible${app.utils.plural(excess.quantity+1) }
            </p>
            <p>
            ${excess.price} €
            </p>
            `);
        // ajoute les marker à une liste pour pouvoir les supprimer si changement
        app.markers.push(newMarker)
        return newMarker;
    },
    async getExcessesFromAPI() {
      
        try {
          const response = await fetch(url);
          
      
          if (response.ok) {
            const data = await response.json();
            data.forEach((newExcess) => { 
                if (!app.listExcess.filter((excess) => excess.latitude === newExcess.latitude && excess.longitude === newExcess.longitude)[0]) app.listExcess.push(newExcess);                
            })
            return data;
          }
        } catch (error) {
          console.error(error.message);
          console.error(error.stack);
        }
    },
    async refresh () {
        await app.getExcessesFromAPI();
        //Définit la tile et ses options
        app.mapLayer = L.tileLayer(app.layers.classic.layer, app.layers.classic.options).addTo(app.map);

        if(app.markers[0] && app.userMarker) {
            app.markers.forEach((marker) => marker.remove());
            app.loadMarkerInArea();
            app.createCards(app.getActiveMarker());
        }
    },
    setMapZoomFromWindow(){
        if (window.innerHeight < 400) return 4
        if (window.innerHeight < 700) return 5
        if (window.innerHeight > 700) return 6
    },
    async initMap (crd) {
        // Définit la vue de départ
        app.map.setView(app.latLng.init, app.setMapZoomFromWindow());
        await app.getExcessesFromAPI();

        if(crd) {
            app.userMarker = L.marker([crd.latitude, crd.longitude]).addTo(app.map);
            app.map.setView([crd.latitude, crd.longitude], app.utils.illZoomAfterClick(), {animate: true, duration: 1} );
            app.loadMarkerInArea();
            app.createCards(app.getActiveMarker());
        }else {
            app.listExcess.forEach((excess) => { excess.marker = app.createMarker(excess); });
            app.createCards(app.listExcess);
        }
        //Définit la tile et ses options
        app.mapLayer = L.tileLayer(app.layers.classic.layer, app.layers.classic.options).addTo(app.map);

        // ajoute l'eventlistenner click sur la map
        app.map.on("click", app.onClick);
        setInterval(app.refresh, 20000)
    },
    init() {
        document.querySelector('#ubeton-map').style.height = window.innerHeight - 104 + 'px';
        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };
          
        function success(pos) {
            const crd = pos.coords;
            app.initMap(crd);
        }   

        function error(err) {
            console.warn(`ERREUR (${err.code}): ${err.message}`);
            console.log(err);
            app.initMap()
        }     

        navigator.geolocation.getCurrentPosition(success, error, options);
    }
};
  app.init();