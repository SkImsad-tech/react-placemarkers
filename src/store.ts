import { createStore } from 'redux'
import { notesReducer } from './coordinatesReducer'

export const store = createStore(notesReducer);
