import { indexedMarker } from '../IfcindexedMarkers'

interface Actions {
    type: string,
    payload: indexedMarker
}

export interface coordinateState {
    markers: indexedMarker[]
};

const initialState = {
    markers: []
}

export const notesReducer = (state:coordinateState = initialState, action:Actions ) => {
    switch(action.type) {
        case "ADD_MARKER": {
            console.log('state', state);
            return { ...state, markers: [ ...state.markers, action.payload ] }
        }
        case "UPDATE_MARKER": {
            return { ...state, markers: [ ...state.markers ] } // обновляем стейт, чтобы обновить компоненты.
        }
        case "DELETE_MARKER": {
            state.markers
            .splice(state.markers
                .findIndex(marker =>
                    marker.id === action.payload.id
                ), 1
            )

            return { ...state, markers: [ ...state.markers ] }
        }
        default:
            return state;
    }
} 
