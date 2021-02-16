import { Loader } from "@googlemaps/js-api-loader"
let map:google.maps.Map;
const Yekaterinburg: google.maps.LatLngLiteral = { lat: 56.839, lng: 60.608 };
const Moscow: google.maps.LatLngLiteral = { lat: 55.750, lng: 37.617 };

export default function initMap(): void {
    const loader = new Loader({
        apiKey: "AIzaSyBa-xA0z2Ibz4LlffJkH6Lc9G3dsExVHyk",
        version: "weekly",
        // ...additionalOptions,
    });

    loader.load().then(() => {
        map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
            center: Yekaterinburg,
            zoom: 5,
        });

        map.addListener('click', (event: any) => {
            putMarker(event.latLng);
        })

        putMarker(Yekaterinburg)
    });

}

function putMarker (position: google.maps.LatLngLiteral) {
    new google.maps.Marker({
        position,
        map: map,
    });
}