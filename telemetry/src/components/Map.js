import React, { useEffect, useState } from 'react';

import { withStyles, withTheme } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import ReactMapGL, {
  AttributionControl, FlyToInterpolator,
  GeolocateControl,
  Layer,
  Marker,
  ScaleControl,
  Source,
  WebMercatorViewport
} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import comms from '../api/Comms';
import { Room } from "@material-ui/icons";

const styles = theme => ({
  root: {
    height: '100%'
  }
});

const defaultLong = -117.80822750160537
const defaultLat = 35.34737384872146

function Map({ field, classes }) {
  const [viewport, setViewport] = useState({
    longitude: defaultLong,
    latitude: defaultLat,
    zoom: 11
  });

  const [coordinateHistory, _setCoordinateHistory] = useState([[defaultLong, defaultLat]])

  const historyLength = coordinateHistory.length
  const rocketLong = coordinateHistory[historyLength - 1][0]
  const rocketLat = coordinateHistory[historyLength - 1][1]

  const geoJSON = {
    type: 'Feature',
    properties: {},
    geometry: { type: 'LineString', coordinates: coordinateHistory }
  }

  const trailLayer = {
    id: "rocket_trail",
    type: "line",
    layout: {
      "line-join": "round",
      "line-cap": "round"
    },
    source: "rocket-trail-data",
    paint: {
      "line-color": "#ff6565",
      "line-width": 2
    }
  }

  useEffect(() => {
    if (!process.env.REACT_APP_MAPBOX_ACCESS_TOKEN) {
      window.alert("You are missing the REACT_APP_MAPBOX_ACCESS_TOKEN environment variable, please obtain a public token then put it in a .env file")
    }
  }, [])

  useEffect(() => {
    comms.addSubscriber(field, handleValueUpdate);
    return () => {
      comms.removeSubscriber(field, handleValueUpdate);

    }
  }, [])

  function handleValueUpdate(timestamp, data) {
    setViewport(_viewport => ({
      ..._viewport,
      longitude: data[0],
      latitude: data[1],
      transitionDuration: 500,
      transitionInterpolator: new FlyToInterpolator()
    }));
    // TODO: depending on rate of data, may need to reduce / simplify path
    _setCoordinateHistory(prev => ([...prev, data]))
  }

  return (
    <Grid container spacing={1} alignItems='center' className={classes.root}>
      <Grid item xs={12} className={classes.root}>
        <ReactMapGL
          {...viewport}
          width={"100%"}
          height={"100%"}
          onViewportChange={nextViewport => setViewport(nextViewport)}
          attributionControl={false}
        >
          <Marker longitude={rocketLong} latitude={rocketLat} offsetLeft={-17.5} offsetTop={-30}>
            <Room fontSize={"large"}/>
          </Marker>
          <Source type={"geojson"} id={"rocket-trail-data"} data={geoJSON}>
            <Layer {...trailLayer}/>
          </Source>
          <ScaleControl maxWidth={200} unit="imperial" style={{ right: 50, bottom: 10, opacity: 0.7 }}/>
          <AttributionControl compact={true} style={{ right: 0, bottom: 0 }}/>
        </ReactMapGL>
      </Grid>
    </Grid>
  );
}

export default withTheme(withStyles(styles)(Map));
