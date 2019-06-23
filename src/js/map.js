const loadGoogleMapsApi = require('load-google-maps-api')

class Map{
    static loadGoogleMapsApi(){
        return loadGoogleMapsApi(
            { key: process.env.GOOGLEMAPS_GOOGLEMAPS_APIKEY },
            { language: "pt-BR"},
            { region: "BR"}
            );
    }

    static createMap(googleMaps, mapElement) {
        return new googleMaps.Map(mapElement, {
          center: { lat: 45.520562, lng: -122.677438 },
          zoom: 14
        });
      }
}

export { Map }