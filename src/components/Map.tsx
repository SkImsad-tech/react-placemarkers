import React, { useEffect }from 'react'
import googleMap from '../actions/mapFactory'
import { useDispatch, useSelector } from 'react-redux';
import { coordinateState } from '../reducers/coordinatesReducer';
import { addMarker, updateMarker } from '../actions/coordinates'
import { indexedMarker } from '../IfcindexedMarkers';
let markers: indexedMarker[] | [] = [];

export default function Map() {
    markers = useSelector<coordinateState, coordinateState["markers"]>((state) => state.markers);
    const dispatch = useDispatch();

    useEffect(() => {
        googleMap.init(addListener);
    });

    function addListener() {
      googleMap.addMapClickListener(dispatchOnMarkerAdd, dispatchOnAddressDecodeEnd, getUpToDateMarkersList);
    }

    function dispatchOnMarkerAdd(marker: indexedMarker) {
      dispatch(addMarker(marker));
    }

    function dispatchOnAddressDecodeEnd (marker: indexedMarker) {
      dispatch(updateMarker(marker));
    }

    function getUpToDateMarkersList() {
      return markers
    }

    return <div id="map"/>
}

