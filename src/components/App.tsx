import React from 'react'
import { coordinateState } from '../reducers/coordinatesReducer';
import { useDispatch, useSelector } from 'react-redux';
import { deleteMarker, replaceMarker } from '../actions/coordinates'
import { indexedMarker } from '../IfcindexedMarkers'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import googleMap from '../actions/mapFactory'
import Map from './Map'

function App() {
  const markers = useSelector<coordinateState, coordinateState["markers"]>((state) => state.markers);
  const dispatch = useDispatch();

  function removeMarker (marker: indexedMarker) {
    googleMap.removeMarker(markers, marker, dispatchOnMarkerDelete)
  }

  function dispatchOnMarkerDelete (marker: indexedMarker) {
    dispatch(deleteMarker(marker));
  }

  function dispatchOnMarkerReplace(marker: indexedMarker) {
    dispatch(replaceMarker(marker));
  }

  function onDragEnd(result: DropResult) {
    googleMap.mutatePolyline(markers, result, dispatchOnMarkerReplace);

  }

    return (
      <div className="App">
          <input id="pac-input"/>
          <Map />

            <DragDropContext
              onDragEnd={onDragEnd}
            >
              <Droppable droppableId="droppable-1">

                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    style={{ backgroundColor: snapshot.isDraggingOver ? 'blue' : 'grey' }}
                    {...provided.droppableProps}
                  >
                    
                      {
                        markers.map((marker, index) => {
                          return <Draggable draggableId={`${marker?.id}`} index={index} key={`${marker?.id}`}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                {index} \ {marker.address}
                                <input type='button' onClick={() => { removeMarker(marker) }} value='удалить' />
                              </div>
                            )}
                          </Draggable>
                        })
                      }

                    {provided.placeholder}
                  </div>
                )}

              </Droppable>
            </DragDropContext>

      </div>
    )
}

export default App;
