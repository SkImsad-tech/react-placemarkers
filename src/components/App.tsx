import { Loader } from "@googlemaps/js-api-loader"
import React, { useEffect, useState }from 'react'
import { coordinateState } from '../reducers/coordinatesReducer';
import { useDispatch, useSelector } from 'react-redux';
import { addMarker, updateMarker, deleteMarker } from '../actions/coordinates'
import { indexedMarker } from '../IfcindexedMarkers'

let geocoder: google.maps.Geocoder;
let map: google.maps.Map;
const compileOnce: boolean = true;
const Yekaterinburg: google.maps.LatLngLiteral = { lat: 56.839, lng: 60.608 };
const loader = new Loader({
    apiKey: "AIzaSyBa-xA0z2Ibz4LlffJkH6Lc9G3dsExVHyk",
    version: "weekly",
});

function App() {
  const markers = useSelector<coordinateState, coordinateState["markers"]>((state) => state.markers);
  const dispatch = useDispatch();
  let [markersId, setMarkersId] = useState(0);
  
  useEffect(() => {
    loader.load().then(() => {
          geocoder = new google.maps.Geocoder()
          map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
              center: Yekaterinburg,
              zoom: 13,
          });
  
          map.addListener('click', (event: any) => {
              putMarker(event.latLng);
          })

          putMarker(Yekaterinburg)
      });
  }, [ compileOnce ]);

  function putMarker (position: google.maps.LatLngLiteral) {
    const marker: indexedMarker = new google.maps.Marker({ position, map, draggable: true, });

    marker.id = markersId;
    setMarkersId(markersId++);

    marker.addListener('dragend', (event: any) => { decodeAddress(marker) })

    dispatch(addMarker(marker));
    decodeAddress(marker);
  }

  function removeMarker (marker: indexedMarker) {
    marker.setMap(null);
    dispatch(deleteMarker(marker));
  }

  function decodeAddress (marker: indexedMarker) {
    geocoder.geocode( { location: marker.getPosition()}, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        console.log('results', results[0]);
        marker.address = results[0].formatted_address
      } else {
        console.log('status', status)
        marker.address = `${marker.getPosition()?.lat()} | ${marker.getPosition()?.lng()}`
      }
      dispatch(updateMarker(marker));
    });
  }

    return (
      <div className="App">
          App init
          <div id="map"/>
          <ul>
            {
              markers.map(marker => {
                return <li key={marker.id} >
                    {marker.id} \ {marker.address}
                    <input type='button' onClick={() => { removeMarker(marker) }} value='удалить' />
                  </li>
              })
            }
          </ul>
      </div>
    )
}

export default App;
