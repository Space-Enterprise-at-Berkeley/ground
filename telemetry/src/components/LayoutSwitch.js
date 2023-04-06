import { Typography } from '@material-ui/core';
import { Component, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Control from '../Control';
import NineGrid from './NineGrid';


class LayoutSwitch extends Component {

  constructor(props) {
    super(props);
    this.state = {
      hash: window.location.hash.split("&")
    }
  }
  render() {
    const { hash } = this.state;
    let config = JSON.parse(atob(hash[1]));
    let window = config.windows[hash[0].substring(2)];
    if (window === undefined) {
      return (
        <Typography variant='h6'>
          Window "{hash.substring(2)}" not found
        </Typography>
      )
    }
    if (window.layout === "9-grid") {
      return (
        <NineGrid windowConfig={window} config={config} />
      )
    }
    return (
      <Typography variant='h6'>
        Layout "{window.layout}" not found
      </Typography>
    )
  }
}

export default LayoutSwitch;