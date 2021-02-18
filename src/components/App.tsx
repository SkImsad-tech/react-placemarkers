import { Loader } from "@googlemaps/js-api-loader"
import React, { useEffect }from 'react'
import { coordinateState } from '../reducers/coordinatesReducer';
import { useDispatch, useSelector } from 'react-redux';
import { addMarker, updateMarker, deleteMarker } from '../actions/coordinates'
import { indexedMarker } from '../IfcindexedMarkers'

let geocoder: google.maps.Geocoder;
let poly: google.maps.Polyline;
let map: google.maps.Map;
const compileOnce: boolean = true;
const Yekaterinburg: google.maps.LatLngLiteral = { lat: 56.839, lng: 60.608 };
const loader = new Loader({
    apiKey: "AIzaSyBa-xA0z2Ibz4LlffJkH6Lc9G3dsExVHyk",
    version: "weekly",
    libraries: [ 'places' ],
});
let markersIndexes: number[] = [];

function App() {
  const markers = useSelector<coordinateState, coordinateState["markers"]>((state) => state.markers);
  const dispatch = useDispatch();
  // let [markersId, setMarkersId] = useState(0);
  
  useEffect(() => {
    loader.load().then(() => {
          geocoder = new google.maps.Geocoder()
          map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
              center: Yekaterinburg,
              zoom: 13,
          });
  
          const input = document.getElementById("pac-input") as HTMLInputElement;

          const searchBox = new google.maps.places.SearchBox(input);

          map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);

          map.addListener("bounds_changed", () => {
            searchBox.setBounds(map.getBounds() as google.maps.LatLngBounds);
          });

          let searchMarkers: google.maps.Marker[] = []

          searchBox.addListener("places_changed", () => {
            const places = searchBox.getPlaces();
        
            if (places?.length === 0) {
              return;
            }

            // Clear out the old markers.
            searchMarkers.forEach((marker) => {
              marker.setMap(null);
            });
            searchMarkers = [];
          
            // For each place, get the icon, name and location.
            const bounds = new google.maps.LatLngBounds();
            places?.forEach((place) => {
              if (!place.geometry || !place.geometry.location) {
                console.log("Returned place contains no geometry");
                return;
              }
              const icon = {
                url: place.icon as string,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25),
              };
        
              // Create a marker for each place.
              searchMarkers.push(
                new google.maps.Marker({
                  map,
                  icon,
                  title: place.name,
                  position: place.geometry.location,
                })
              );
        
              if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
              } else {
                bounds.extend(place.geometry.location);
              }
            });
            map.fitBounds(bounds);
          })

          poly = new google.maps.Polyline({
            strokeColor: "#000000",
            strokeOpacity: 1.0,
            strokeWeight: 3,
          });
          poly.setMap(map);

          map.addListener("click", putMarker);

          // putMarker(Yekaterinburg) // Был дефолтный маркер в екб
      });
  }, [ compileOnce ]);

  function movePolyline(event: google.maps.MapMouseEvent, marker: indexedMarker ) {
    const markerIndex = markersIndexes.findIndex(elem => elem === marker.id);
    const path = poly.getPath();
    path.setAt(markerIndex, event.latLng)
  }

  function putMarker (event: google.maps.MapMouseEvent) {
    if (!event.latLng) return
    const path = poly.getPath();
    path.push(event.latLng);
    const marker: indexedMarker = new google.maps.Marker({ position: event.latLng, map, draggable: true, });
    
    console.log('marker', marker);

    marker.id = +Math.random().toFixed(5)*100000;
    markersIndexes.push(marker.id)
    
    marker.addListener('dragend', () => { decodeAddress(marker) })
    marker.addListener("drag", (event: google.maps.MapMouseEvent) => { movePolyline(event, marker) });
    dispatch(addMarker(marker));
    decodeAddress(marker);
  }

  function removeMarker (marker: indexedMarker) {
    const markerIndex = markersIndexes.findIndex(elem => elem === marker.id);
    marker.setMap(null);
    dispatch(deleteMarker(marker));
    const path = poly.getPath();
    path.removeAt(markerIndex)
    markersIndexes.splice(markerIndex, 1)
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
          <input id="pac-input"/>
          <div id="map"/>
          <ul>
            {
              markers.map((marker, index) => {
                return <li key={index} >
                    {index} \ {marker.address}
                    <input type='button' onClick={() => { removeMarker(marker) }} value='удалить' />
                  </li>
              })
            }
          </ul>
      </div>
    )
}

export default App;
