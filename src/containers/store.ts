import { createStore } from 'redux'
import { notesReducer } from '../reducers/coordinatesReducer'

export const store = createStore(notesReducer);
