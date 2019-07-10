import loadGoogleMapsApi from 'load-google-maps-api'

export class Map {
    static loadGoogleMapsApi() {
        return loadGoogleMapsApi(
            { key: process.env.GOOGLEMAPS_GOOGLEMAPS_APIKEY },
            { language: "pt-BR" },
            { region: "BR" }
        );
    }

    static createMap(googleMaps, mapElement) {
        return new googleMaps.Map(mapElement, {
            center: { lat: -27.494872241197, lng: -48.6541986465454 }, 
            zoom: 12          
        });
        
    }
}