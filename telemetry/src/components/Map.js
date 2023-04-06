import React, { useEffect, useState } from 'react';

import { withStyles, withTheme } from '@material-ui/core/styles';
import { FormControl, Grid, MenuItem, Select } from '@material-ui/core';
import ReactMapGL, {
  AttributionControl,
  FlyToInterpolator,
  Layer, Marker,
  ScaleControl,
  Source
} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import comms from '../api/Comms';
import { Room } from "@material-ui/icons";

const styles = theme => ({
  root: {
    height: '100%',
    margin: 0
  },
  fullHeight: {
    height: '100%',
    padding: "0px !important"
  }
});

const mapStyles = [
  { name: "Light", url: "mapbox://styles/mapbox/light-v10" },
  { name: "Dark", url: "mapbox://styles/mapbox/dark-v10" },
  { name: "Satellite", url: "mapbox://styles/mapbox/satellite-v9" }
]

const defaultLong = -117.80822750160537
const defaultLat = 35.34737384872146

let nextLat = 35.34737384872146;

function CurrentCoords(props) {
  const { longitude, latitude } = props;

  const markerStyle = {
    position: 'absolute',
    background: 'rgba(255,255,255,0.45)',
    left: 0,
    top: 0,
    padding: 5
  };

  return (
    <div style={markerStyle}>
      Current Position: ({longitude.toFixed(7)}, {latitude.toFixed(7)})
    </div>
  );
}

function SwitchStyle({ setSelectedStyle, selectedStyle }) {
  const markerStyle = {
    position: 'absolute',
    background: 'rgba(255,255,255,0.45)',
    right: 0,
    minWidth: 80,
    top: 0
  };

  return (
    <div style={markerStyle}>
      <FormControl fullWidth>
        <Select
          id="demo-simple-select"
          value={selectedStyle}
          label="Map Style"
          disableUnderline
          onChange={(evt) => {
            setSelectedStyle(evt.target.value)
          }}
        >
          {
            mapStyles.map(style => <MenuItem key={style.url} value={style.url}>{style.name}</MenuItem>)
          }
        </Select>
      </FormControl>
    </div>
  );
}

function Map({ field, classes }) {
  const [selectedStyle, setSelectedStyle] = useState(mapStyles[0].url)
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
    comms.addSubscriber('gpsLatitude', handleLatUpdate);
    comms.addSubscriber('gpsLongitude', handleLongUpdate);
    comms.addDarkModeListener(handleDarkMode);
    return () => {
      comms.removeSubscriber('gpsLatitude', handleLatUpdate);
      comms.removeSubscriber('gpsLongitude', handleLongUpdate);
      comms.removeDarkModeListener(handleDarkMode)
    }
  }, [])

  const handleDarkMode = (isDark) => {
    if(isDark){
      setSelectedStyle(mapStyles.find(({name}) => name === "Dark").url)
    }else{
      setSelectedStyle(mapStyles.find(({name}) => name === "Light").url)
    }
  }

  function handleLatUpdate(timestamp, data) {
    if(data !== 0) {
      nextLat = data;
    }
  }

  function handleLongUpdate(timestamp, data) {
    if(data !== 0 && nextLat !== 0) {
      setViewport(_viewport => ({
        ..._viewport,
        longitude: data,
        latitude: nextLat,
        transitionDuration: 500,
        transitionInterpolator: new FlyToInterpolator()
      }));
      // TODO: depending on rate of data, may need to reduce / simplify path
      _setCoordinateHistory(prev => ([...prev, [data, nextLat]]))
    }
  }

  return (
    <Grid container spacing={1} alignItems='center' className={classes.root}>
      <Grid item xs={12} className={classes.fullHeight}>
        <ReactMapGL
          {...viewport}
          width={"100%"}
          height={"100%"}
          onViewportChange={nextViewport => setViewport(nextViewport)}
          attributionControl={false}
          mapStyle={selectedStyle}
        >
          <SwitchStyle setSelectedStyle={setSelectedStyle} selectedStyle={selectedStyle}/>
          <CurrentCoords longitude={rocketLong} latitude={rocketLat}/>
          <Marker longitude={rocketLong} latitude={rocketLat} offsetLeft={-17.5} offsetTop={-30}>
            <Room fontSize={"large"} htmlColor={selectedStyle.includes("dark") ? "#d94848" : "#000"}/>
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