export interface indexedMarker extends google.maps.Marker {
    id?: number;
    address?: string;
    source?: number;
    destination?: number;
}
