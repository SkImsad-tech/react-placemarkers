export type Actions = {
    addAction: {type: "ADD_COORDINATE", payload: google.maps.Marker},
}

export const addCoordinates = (latLng:google.maps.Marker):Actions["addAction"] => ({
    type: "ADD_COORDINATE",
    payload: latLng
});
