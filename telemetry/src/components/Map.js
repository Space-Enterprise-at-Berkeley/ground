import React, { Component, useEffect, useState } from 'react';

import { withStyles, withTheme } from '@material-ui/core/styles';
import { Card, CardContent, Grid } from '@material-ui/core';
import ReactMapGL from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import comms from '../api/Comms';

const styles = theme => ({
  root: {
    height: '100%'
  }
});

function Map({ field, classes }) {
  useEffect(() => {
    if(!process.env.REACT_APP_MAPBOX_ACCESS_TOKEN){
      window.alert("You are missing the REACT_APP_MAPBOX_ACCESS_TOKEN environment variable, please obtain a public token then put it in a .env file")
    }
  }, [])

  useEffect(() => {
    comms.addSubscriber(field, handleValueUpdate);
    return () => {
      comms.removeSubscriber(field, handleValueUpdate);

    }
  }, [])

  const [viewport, setViewport] = useState({
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8
  });

  function handleValueUpdate(timestamp, data) {

  }

  return (
    <Grid container spacing={1} alignItems='center' className={classes.root}>
      <Grid item xs={12} className={classes.root} >
        <ReactMapGL
          {...viewport}
          width={"100%"}
          height={"100%"}
          onViewportChange={nextViewport => setViewport(nextViewport)}
        />
      </Grid>
    </Grid>
  );
}

export default withTheme(withStyles(styles)(Map));
