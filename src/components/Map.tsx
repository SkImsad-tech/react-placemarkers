import { Loader } from "@googlemaps/js-api-loader"
import React, { useEffect }from 'react'
import { useDispatch } from 'react-redux';
import { addCoordinates } from '../actions/coordinates'

let map:google.maps.Map;
const Yekaterinburg: google.maps.LatLngLiteral = { lat: 56.839, lng: 60.608 };
const loader = new Loader({
    apiKey: "AIzaSyBa-xA0z2Ibz4LlffJkH6Lc9G3dsExVHyk",
    version: "weekly",
});

export default function GoogleMap() {
    const dispatch = useDispatch();

    useEffect(() => {
        loader.load().then(() => {
            map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
                center: Yekaterinburg,
                zoom: 13,
            });
    
            map.addListener('click', (event: any) => {
                const marker = putMarker(event.latLng);
                dispatch(addCoordinates(marker));
            })
    
            const marker = putMarker(Yekaterinburg)
            dispatch(addCoordinates(marker));
        });
    }, [ true ]);



    return (
        <div id="map"/>
    );

}

function putMarker (position: google.maps.LatLngLiteral) {
    return new google.maps.Marker({
        position,
        map: map,
    });
}