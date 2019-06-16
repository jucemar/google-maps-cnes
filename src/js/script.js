
function initMap() {

  fetch('http://localhost:3000/estabelecimentos?municipio=Biguaçu')
    .then(response => {
      return response.json()
    })
    .then(json => {
      const maps = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: { lat: -27.494872241197, lng: -48.6541986465454 },
        streetViewControl: false,
        scrollwheel: true
      })
      return { maps, json }
    })
    .then(({ maps, json }) => {
     
      let markers = json.map((location) => {


       
        let marker = new google.maps.Marker({
          position: new google.maps.LatLng(location.lat, location.lng),
          cursor:'pointer',
          map: maps,
          draggable:false,
          
        }) 
        
        addDadosNoEstabelecimento(marker,location)


      
        return marker
      })
      /*   let markerCluster = new MarkerClusterer(maps, markers,
        {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'}) */
    })

}

function addDadosNoEstabelecimento(marker, dados) {
  let infowindow = new google.maps.InfoWindow({
    content: `
    <div class="info-window">
    <h4>${dados.nome.toUpperCase()}</h4>
    <hr>
    <p><i>${dados.tipo.toUpperCase()}</i></p>
    <p>CNES: ${dados.cnes.toUpperCase()}</p>
    <p>Bairro: ${dados.bairro.toUpperCase()}</p>
    <p>Telefone: ${dados.telefone.toUpperCase()}</p>
    </div>`,
    disableAutoPan:true
  });

  marker.addListener('mouseover', function() {
    infowindow.open(marker.get('map'), marker);
  })
  marker.addListener('mouseout', function() {
    infowindow.close()
  })
}







