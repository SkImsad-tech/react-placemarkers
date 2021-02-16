import { Loader } from "@googlemaps/js-api-loader"
const center: google.maps.LatLngLiteral = { lat: 56.839, lng: 60.608 };

export default function initMap(): void {
    const loader = new Loader({
        apiKey: "AIzaSyBa-xA0z2Ibz4LlffJkH6Lc9G3dsExVHyk",
        version: "weekly",
        // ...additionalOptions,
    });

    loader.load().then(() => {
        const map:google.maps.Map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
            center,
            zoom: 14,
        });

        return map
    });
}
