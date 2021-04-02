import React, { Component } from 'react';

import { compose, withProps } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  Polyline,
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
    defaultCenter={{ lat: 35.346991, lng: -117.808685 }} // FAR Location
    // defaultCenter={{ lat: 37.8680555556, lng: -122.2594444444 }} // Berkeley
  >
    <Polyline
      path={ props.markerPath }
      options={{
        strokeColor: "#ff2527",
        strokeOpacity: 0.75,
        strokeWeight: 2,
        icons: [
            {
                offset: "0",
                repeat: "20px"
            }
        ]
      }}
    />
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
      rocketLng: convertDMStoDD(122, 15, 34, "W"),
      rocketPath: []
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
      let lat = convertDMStoDD(
        Math.floor(DMSNorth/100),
        Math.floor(DMSNorth - (Math.floor(DMSNorth/100) * 100)),
        (DMSNorth - Math.floor(DMSNorth)) * 100,
        "N");
      let lng = convertDMStoDD(
        Math.floor(DMSWest/100),
        Math.floor(DMSWest - (Math.floor(DMSWest/100) * 100)),
        (DMSWest - Math.floor(DMSWest)) * 100,
        "W");
      if(this.state.rocketPath.length === 0) {
        this.setState({
          rocketPath: [...this.state.rocketPath, {lat, lng}]
        });
      } else {
        if(this.state.rocketPath[this.state.rocketPath.length-1].lat !== lat
            || this.state.rocketPath[this.state.rocketPath.length-1].lng !== lng) {
          this.setState({
            rocketPath: [...this.state.rocketPath, {lat, lng}]
          });
        }
      }
      this.setState({
        rocketLat: lat,
        rocketLng: lng
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
              markerPath={this.state.rocketPath}
            />
          </div>
        </CardContent>
      </Card>
    );
  }
}

export default withTheme(withStyles(styles)(EmbeddedMap));
