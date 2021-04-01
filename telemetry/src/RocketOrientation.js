import React, { Component } from 'react';

import * as THREE from 'three';
import OrbitControlsFactory from 'three-orbit-controls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { withStyles, withTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

const OrbitControls = OrbitControlsFactory(THREE);

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

class RocketOrientation extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.sizeDetector = React.createRef();
  }

  componentDidMount() {
    const width = this.sizeDetector.current.clientWidth;
    const height = this.sizeDetector.current.clientHeight;
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera( 50, width/height, 0.1, 1000 );
    let renderer = new THREE.WebGLRenderer({alpha: true});
    let controls = new OrbitControls( camera, renderer.domElement );
    renderer.setSize( width, height );
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor( 0x000000, 0.9);
    // document.body.appendChild( renderer.domElement );
    // use ref as a mount point of the Three.js scene instead of the document.body
    this.sizeDetector.current.appendChild( renderer.domElement );
    const axesHelper = new THREE.AxesHelper( 2 );
    scene.add( axesHelper );
    var ambientLight = new THREE.AmbientLight( 0xffffff, 0.5 );
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.8 );
    scene.add(directionalLight);

    const loader = new GLTFLoader();
    let lad4gltf = null;
    loader.load( 'LAD4.gltf', function ( gltf ) {
      lad4gltf = gltf;
      scene.add( gltf.scene );
    }, undefined, function ( error ) {
      console.error( error );
    } );

    camera.position.x = 3;
    camera.position.y = 3;
    camera.position.z = 3;
    camera.lookAt(0, 0, 0);
    controls.update();

    let animate = () => {
      this.animationHandle = requestAnimationFrame( animate );
      
      controls.update();

      directionalLight.position.x = camera.position.x;
      directionalLight.position.y = camera.position.y;
      directionalLight.position.z = camera.position.z;

      renderer.render( scene, camera );
    };
    animate();

    this.props.addSensorListener(this.props.sensorID, (data, timestamp) => {
      if(lad4gltf) {
        lad4gltf.scene.setRotationFromEuler(THREE.Euler(Math.PI * data[0] / 180, Math.PI * data[1] / 180, Math.PI * data[2] / 180));
      }
    });
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.animationHandle);
  }

  render() {
    const { classes } = this.props;
    return (
      <Card className={classes.root}>
        <CardContent className={classes.cardContent}>
          <div ref={this.sizeDetector} className={classes.sizeDetector}>
          </div>
        </CardContent>
      </Card>
    );
  }
}

export default withTheme(withStyles(styles)(RocketOrientation));
