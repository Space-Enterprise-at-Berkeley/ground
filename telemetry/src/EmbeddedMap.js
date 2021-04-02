import React, { Component } from 'react';

import { compose, withProps } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  MarkerWithLabel,
} from "react-google-maps";

import { withStyles, withTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

const styles = theme => ({
  root: {
    height: '100%'
  },
  cardContent: {
    height: '100%',
    padding: '8px',
    paddingBottom: '8px !important'
  },
  button: {
    float: 'right',
    minWidth: '0px',
    zIndex: 1000
  },
  canvas: {
    position: 'absolute',
    width: '100%',
    height: '100%'
  },
  sizeDetector: {
    position: 'relative',
    width: '100%',
    height: '100%'
  },
  legend: {

  }
});

const MyMapComponent = compose(
  withProps({
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyCNU-llJvLTqBENPsyJ4wjjHybiGltghgM&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `100%` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap
    defaultZoom={12}
    // defaultCenter={{ lat: 35.346991, lng: -117.808685 }} // FAR Location
    defaultCenter={{ lat: 37.8680555556, lng: -122.2594444444 }} // Berkeley
    defaultOptions={{}}
  >
    <Marker
      position={{ lat: props.markerLat, lng: props.markerLng }}
    />
  </GoogleMap>
));

const convertDMStoDD = (degrees, minutes, seconds, direction) => {
  let dd = degrees + minutes/60 + seconds/(60*100);

  if (direction == "S" || direction == "W") {
      dd = dd * -1;
  } // Don't do anything for N or E
  return dd;
}

class EmbeddedMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rocketLat: convertDMStoDD(37, 52, 5, "N"),
      rocketLng: convertDMStoDD(122, 15, 34, "W")
    };
    this.sizeDetector = React.createRef();
    this.mapRef = React.createRef();
  }

  componentDidMount() {
    const width = this.sizeDetector.current.clientWidth;
    const height = this.sizeDetector.current.clientHeight;

    this.props.addSensorListener(this.props.sensorID, (data, timestamp) => {
      let DMSNorth = data[0];
      let DMSWest = data[1];
      this.setState({
        rocketLat: convertDMStoDD(
          Math.floor(DMSNorth/100),
          Math.floor(DMSNorth - (Math.floor(DMSNorth/100) * 100)),
          (DMSNorth - Math.floor(DMSNorth)) * 100,
          "N"),
        rocketLng: convertDMStoDD(
          Math.floor(DMSWest/100),
          Math.floor(DMSWest - (Math.floor(DMSWest/100) * 100)),
          (DMSWest - Math.floor(DMSWest)) * 100,
          "W"),
      });
    });
  }

  componentWillUnmount() {
  }

  render() {
    const { classes } = this.props;
    return (
      <Card className={classes.root}>
        <CardContent className={classes.cardContent}>
          <div ref={this.sizeDetector} className={classes.sizeDetector}>
            <MyMapComponent
              markerLat={this.state.rocketLat}
              markerLng={this.state.rocketLng}
            />
          </div>
        </CardContent>
      </Card>
    );
  }
}

export default withTheme(withStyles(styles)(EmbeddedMap));
