import { indexedMarker } from '../IfcindexedMarkers'

export type Actions = {
    addAction: {type: "ADD_MARKER", payload: indexedMarker},
    replaceAction: {type: "REPLACE_MARKER" , payload: indexedMarker},
    updateAction: {type: "UPDATE_MARKER", payload: indexedMarker},
    deleteAction: {type: "DELETE_MARKER", payload: indexedMarker},
}

export const addMarker = (marker:indexedMarker):Actions["addAction"] => ({
    type: "ADD_MARKER",
    payload: marker
});

export const updateMarker = (marker:indexedMarker):Actions["updateAction"] => ({
    type: "UPDATE_MARKER",
    payload: marker
});

export const replaceMarker = (marker:indexedMarker):Actions["replaceAction"] => ({
    type: "REPLACE_MARKER",
    payload: marker
});

export const deleteMarker = (marker:indexedMarker):Actions["deleteAction"] => ({
    type: "DELETE_MARKER",
    payload: marker
});
