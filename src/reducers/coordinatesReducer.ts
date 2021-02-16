interface Actions {
    type: string,
    payload: google.maps.Marker
}

export interface NotesState {
    latLng: google.maps.Marker[]
};

const initialState = {
    latLng: []
}

export const notesReducer = (state:NotesState = initialState, action:Actions ) => {
    switch(action.type) {
        case "ADD_COORDINATE": {
            console.log('state', state);
            return { ...state, latLng: [ ...state.latLng, action.payload ] }
        }
        default:
            return state;
    }
} 
