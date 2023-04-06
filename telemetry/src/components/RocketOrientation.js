import React, { Component } from 'react';

import * as THREE from 'three';
import OrbitControlsFactory from 'three-orbit-controls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { withStyles, withTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import comms from '../api/Comms';

const OrbitControls = OrbitControlsFactory(THREE);

const styles = theme => ({
  root: {
    height: '100%'
  },
  cardContent: {
    padding: 0,
    paddingBottom: "0 !important",
    height: '100%',
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
  legend: {}
});

class RocketOrientation extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.sizeDetector = React.createRef();
    this.lad4gltf = null

    this.qW = 0.0;
    this.qX = 0.0;
    this.qY = 0.0;
    this.qZ = 0.0;

    this.handleValueUpdate = this.handleValueUpdate.bind(this)
    this.handleqWUpdate = this.handleqWUpdate.bind(this)
    this.handleqXUpdate = this.handleqXUpdate.bind(this)
    this.handleqYUpdate = this.handleqYUpdate.bind(this)
  }

  componentDidMount() {
    const { fieldQW, fieldQX, fieldQY, fieldQZ } = this.props;

    const width = this.sizeDetector.current.clientWidth;
    const height = this.sizeDetector.current.clientHeight;
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    let renderer = new THREE.WebGLRenderer({ alpha: true });
    let controls = new OrbitControls(camera, renderer.domElement);
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0.9);
    // document.body.appendChild( renderer.domElement );
    // use ref as a mount point of the Three.js scene instead of the document.body
    this.sizeDetector.current.appendChild(renderer.domElement);
    const axesHelper = new THREE.AxesHelper(2);
    scene.add(axesHelper);
    var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    scene.add(directionalLight);

    const loader = new GLTFLoader();
    const that = this
    loader.load('static/3d-models/LAD4.gltf', function (gltf) {
      that.lad4gltf = gltf;
      scene.add(gltf.scene);
      gltf.scene.setRotationFromAxisAngle(new THREE.Vector3(0,1,0), Math.PI / 2)
    }, undefined, function (error) {
      console.error(error);
    });

    camera.position.x = 3;
    camera.position.y = 3;
    camera.position.z = 3;
    camera.lookAt(0, 0, 0);
    controls.update();

    let animate = () => {
      this.animationHandle = requestAnimationFrame(animate);

      controls.update();

      directionalLight.position.x = camera.position.x;
      directionalLight.position.y = camera.position.y;
      directionalLight.position.z = camera.position.z;

      renderer.render(scene, camera);
    };
    animate();

    comms.addSubscriber(fieldQW, this.handleqWUpdate);
    comms.addSubscriber(fieldQX, this.handleqXUpdate);
    comms.addSubscriber(fieldQY, this.handleqYUpdate);
    comms.addSubscriber(fieldQZ, this.handleValueUpdate); // actuall update the model once QZ received
  }

  handleqWUpdate(timestamp, data) {this.qW = data}
  handleqXUpdate(timestamp, data) {this.qX = data}
  handleqYUpdate(timestamp, data) {this.qY = data}

  handleValueUpdate(timestamp, data) {
    this.qZ = data;
    if (!this.lad4gltf) return

    let quat = new THREE.Quaternion(this.qW, this.qX, this.qY, this.qZ);
    // const rot1 = new THREE.Quaternion(-Math.sqrt(2) / 2, 0, 0, Math.sqrt(2) / 2);
    // const rot2 = new THREE.Quaternion(0, 0, Math.sqrt(2) / 2, Math.sqrt(2) / 2);
    // quat = quat.premultiply(new THREE.Quaternion(0, Math.sqrt(2)/2, 0, Math.sqrt(2)/2));
    // quat = quat.multiply((new THREE.Quaternion(0, Math.sqrt(2)/2, 0, Math.sqrt(2)/2)).invert());
    // quat = quat.premultiply(rot1);
    // quat = quat.multiply(rot1.invert());
    // quat = quat.premultiply(rot2);
    // quat.multiply(rot2.invert());
    this.lad4gltf.scene.setRotationFromQuaternion(quat);
    // lad4gltf.scene.setRotationFromEuler(new THREE.Qua(Math.PI * data[0] / 180, Math.PI * data[1] / 180, Math.PI * data[2] / 180, "YXZ"));
  }

  componentWillUnmount() {
    const { fieldQW, fieldQX, fieldQY, fieldQZ } = this.props;
    comms.removeSubscriber(fieldQW, this.handleqWUpdate);
    comms.removeSubscriber(fieldQX, this.handleqXUpdate);
    comms.removeSubscriber(fieldQY, this.handleqYUpdate);
    comms.removeSubscriber(fieldQZ, this.handleValueUpdate);
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