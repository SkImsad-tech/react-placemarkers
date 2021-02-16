interface Actions {
    type: string,
    payload: google.maps.LatLngLiteral
}

export interface NotesState {
    latLng: google.maps.LatLngLiteral[]
};

const initialState = {
    latLng: []
}

export const notesReducer = (state:NotesState = initialState, action:Actions ) => {
    switch(action.type) {
        case "ADD_COORDINATE": {
            return { ...state, latLng: [ ...state.latLng, action.payload ] }
        }
        default:
            return state;
    }
} 
