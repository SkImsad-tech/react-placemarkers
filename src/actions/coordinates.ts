export type Actions = {
    addAction: {type: "ADD_NOTE", payload: google.maps.Marker},
}

export const addCoordinates = (latLng:google.maps.Marker):Actions["addAction"] => ({
    type: "ADD_NOTE",
    payload: latLng
});
