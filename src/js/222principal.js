let GoogleMapsLoader = require('google-maps'); // only for common js environments
let mapElement = document.getElementById('map');

GoogleMapsLoader.LIBRARIES = ['geometry', 'drawing', 'places']
GoogleMapsLoader.KEY=process.env.GOOGLEMAPS_GOOGLEMAPS_APIKEY 
GoogleMapsLoader.VERSION = '3.37'

let map=null
GoogleMapsLoader.load(function(google) {
	map=new google.maps.Map(mapElement, {
    center: { lat: -27.494872241197, lng: -48.6541986465454 }, 
    zoom: 12           
  })
})



