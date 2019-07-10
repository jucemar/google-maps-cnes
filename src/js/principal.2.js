import { Map } from './map.js'
const MarkerClusterer = require('node-js-marker-clusterer')




let infoWindow = null
let mapElement = document.getElementById('map')
mapElement.classList.add('se-pre-con')


let GoogleMapsApi=null
let map = null


buscarEstabelecimentos()
carregarApi()






/*     .then(([map,json]) => {
      let markers = json.map((location) => {
        let marker = google.maps.Marker({
          position: {lat:location.lat, lng:location.lng},
          cursor: 'pointer',
          map: map,
          draggable: false,  
        })  
        addDadosNoEstabelecimento(marker, location)
        return marker
      })
    }) */

function criarMapa(){
  map=Map.createMap(GoogleMapsApi, mapElement)
}

function carregarApi(){
  
  Map.loadGoogleMapsApi()
  .then((googleMaps) => {
    mapElement.classList.remove('se-pre-con')
    GoogleMapsApi=googleMaps
    criarMapa()
  })
}

function buscarEstabelecimentos() {
  fetch('http://localhost:3000/estabelecimentos?municipio=Biguaçu')
    .then(response => {
     response.json().then(estabelecimentos=>criarMarkers(estabelecimentos))
    })

}
function criarMarkers(estabelecimentos){
  let markers = estabelecimentos.map((location) => {
    let marker = new GoogleMapsApi.Marker({
      position: new GoogleMapsApi.LatLng(location.lat,location.lng),
      cursor: 'pointer',
      map: map,
      draggable: false,

    })

    addDadosNoEstabelecimento(marker, location)
    return marker
  })
  
  let mcOptions = {
    gridSize: 40,
    maxZoom: 15,
    imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
  }
  let markerCluster = new MarkerClusterer(map, markers, mcOptions)
}



function addDadosNoEstabelecimento(marker, dados) {
  marker.addListener('click', function () {
    if (infoWindow) {
      infoWindow.close()
    }
    infoWindow = new GoogleMapsApi.InfoWindow()
    infoWindow.setContent(`
          <div class="info-window">
          <p class="info-window title">${dados.nome.toUpperCase()}</p>
          <p>${dados.tipo.toUpperCase()}</p>
          <p>${dados.logradouro.toUpperCase()}, ${dados.numero.toUpperCase()}</p>    
          <p>${dados.municipio.toUpperCase()} - ${dados.uf.toUpperCase()}</p>
          <p>${dados.bairro.toUpperCase()}</p>
          <p>${dados.cep.toUpperCase()}</p>
          <p>${dados.telefone.toUpperCase()}</p>
          </div>`)
    infoWindow.open(marker.get('map'), marker);
  })


} 