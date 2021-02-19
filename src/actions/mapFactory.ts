import { Loader } from "@googlemaps/js-api-loader"
import { indexedMarker } from '../IfcindexedMarkers'
import { DropResult } from 'react-beautiful-dnd';

class GoogleMap {
    private loader: Loader
    private _geocoder?: google.maps.Geocoder;
    private poly?: google.maps.Polyline;
    private _map: google.maps.Map | null = null;
    private center: google.maps.LatLngLiteral = { lat: 56.839, lng: 60.608 };
    private searchBox?: google.maps.places.SearchBox;
    private searchMarkers?: google.maps.Marker[] = [];

    constructor() {
        this.loader = new Loader({
            apiKey: "AIzaSyBa-xA0z2Ibz4LlffJkH6Lc9G3dsExVHyk",
            version: "weekly",
            libraries: [ 'places' ],
        });
    }
    
    init(callback: Function) {
        this.loader.load().then(() => {
            this.defineMap(callback);

            
        }).then(() => {
            this.defineGeocoder();

            this.defineSearchBox();

            this.definePolylines();
        })
        ;
    }

    defineMap(callback: Function) {
        if (this._map) return
        this._map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
            center: this.center,
            zoom: 13,
        });
        callback();
    }

    defineGeocoder() {
        
        if (!this._geocoder) { this._geocoder = new google.maps.Geocoder() }
    }

    defineSearchBox() {
        if (this.searchBox) return
        const input = document.getElementById("pac-input") as HTMLInputElement;

        if (input) {
            this.searchBox = new google.maps.places.SearchBox(input);
    
            this._map?.controls[google.maps.ControlPosition.TOP_CENTER].push(input);
            
            return this.defineSearchBoxEvents();
        }

    }

    defineSearchBoxEvents() {
        this._map?.addListener("bounds_changed", () => {
            this.searchBox?.setBounds(this._map?.getBounds() as google.maps.LatLngBounds);
        });

        this.searchBox?.addListener("places_changed", () => {
            const places = this.searchBox?.getPlaces();
        
            if (places?.length === 0) {
                return;
            }

            // Clear out the old markers.
            this.searchMarkers?.forEach((marker) => {
                marker.setMap(null);
            });
            this.searchMarkers = [];
            
            // For each place, get the icon, name and location.
            const bounds = new google.maps.LatLngBounds();
            
            places?.forEach((place) => {
                if (!place.geometry || !place.geometry.location) {
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
                this.searchMarkers?.push(
                new google.maps.Marker({
                    map: this._map,
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

            this._map?.fitBounds(bounds);
        })
    }

    definePolylines() {
        if (this.poly) return
        this.poly = new google.maps.Polyline({
            strokeColor: "#000000",
            strokeOpacity: 1.0,
            strokeWeight: 3,
          });
        this.poly.setMap(this._map);
    }

    movePolyline(event: google.maps.MapMouseEvent, marker: indexedMarker, getUpToDateMarkersList: Function) {
        const markers: indexedMarker[] = getUpToDateMarkersList();
        const markerIndex = markers.findIndex(elem => elem.id === marker.id);
        const path = this.poly?.getPath();
        path?.setAt(markerIndex, event.latLng)
    }

    mutatePolyline(markers: indexedMarker[], result: DropResult, dispatchOnMarkerReplace: Function) {
        // dropped outside the list
        if (!result.destination) {
            return;
        }
        
        const path = this.poly?.getPath();

        path?.removeAt(result.source.index);
        path?.insertAt(result.destination.index, markers[result.source.index].getPosition());
    
        const marker = markers[result.source.index]
        
        marker.destination = result.destination.index;
        marker.source = result.source.index;

        dispatchOnMarkerReplace(marker)
    }

    addMapClickListener(dispatchOnMarkerAdd: Function, dispatchOnAddressDecodeEnd: Function, getUpToDateMarkersList: Function) {
        this._map?.addListener("click", (event: google.maps.MapMouseEvent) => {
            this.putMarker(event, dispatchOnMarkerAdd, dispatchOnAddressDecodeEnd, getUpToDateMarkersList);
        });
    }

    putMarker(event: google.maps.MapMouseEvent, dispatchOnMarkerAdd: Function, dispatchOnAddressDecodeEnd: Function, getUpToDateMarkersList: Function) {
        if (!event.latLng) return
        const path = this.poly?.getPath();
        path?.push(event.latLng);
        
        const marker: indexedMarker = new google.maps.Marker({ position: event.latLng, map: this._map, draggable: true, });
        
        marker.id = +Math.random().toFixed(5)*100000;
        dispatchOnMarkerAdd(marker)
        this.decodeAddress(marker, dispatchOnAddressDecodeEnd)

        marker.addListener('dragend', () => { this.decodeAddress(marker, dispatchOnAddressDecodeEnd) })
        marker.addListener("drag", (event: google.maps.MapMouseEvent) => { this.movePolyline(event, marker, getUpToDateMarkersList) });
    }

    decodeAddress(marker: indexedMarker, dispatchOnAddressDecodeEnd: Function) {
        this._geocoder?.geocode( { location: marker.getPosition()}, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            marker.address = results[0].formatted_address
          } else {
            marker.address = `${marker.getPosition()?.lat()} | ${marker.getPosition()?.lng()}`
          }
          dispatchOnAddressDecodeEnd(marker);
        });
    }

    removeMarker(markers: indexedMarker[], marker: indexedMarker, dispatchOnMarkerDelete: Function) {
        const markerIndex = markers.findIndex(elem => elem.id === marker.id);
        marker.setMap(null);

        dispatchOnMarkerDelete(marker)

        const path = this.poly?.getPath();
        path?.removeAt(markerIndex)
    }
}

const map = new GoogleMap();
export default map
