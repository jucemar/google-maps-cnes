import { Map } from './map'
import '../assets/css/style.css'

let filtros = require('./filtros.js')
let infoWindow = null


document.addEventListener("DOMContentLoaded", function () {
  let mapElement = document.getElementById('map');

  Map.loadGoogleMapsApi()
  .then((googleMaps) => {
    Map.createMap(googleMaps, mapElement)
    return mapElement
  })
  .then( mapElement => {
    const json=fetch('http://localhost:3000/estabelecimentos?municipio=Biguaçu')
    .then(response => {
      return response.json()
    })
    return {json, mapElement}
  })
  .then(({json,mapElement}) => {
    let markers = json.map((location) => {
      let marker = new google.maps.Marker({
        position: new google.maps.LatLng(location.lat, location.lng),
        cursor: 'pointer',
        map: mapElement,
        draggable: false,

      })

      addDadosNoEstabelecimento(marker, location)



      return marker
    })
    let mcOptions = {
      gridSize: 50,
      maxZoom: 15,
      imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
    }
    let markerCluster = new MarkerClusterer(mapElement, markers, mcOptions)
  })
})

function addDadosNoEstabelecimento(marker, dados) {
  marker.addListener('click', function () {
    if (infoWindow) {
      infoWindow.close()
    }
    infoWindow = new google.maps.InfoWindow()
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
