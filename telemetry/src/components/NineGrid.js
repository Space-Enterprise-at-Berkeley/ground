import React, { Component } from "react";
import "@fontsource/roboto";
import {withStyles, withTheme} from "@material-ui/core/styles";
import {Container, Grid} from "@material-ui/core";

import Graph from "./Graph";
import SixValueSquare from "./SixValueSquare";

import MessageDisplaySquare from "./MessageDisplaySquare";
import ErrorSquare from "./ErrorSquare";
import FourButtonSquare from "./FourButtonSquare";
import LaunchButton from "./LaunchButton";
import ProgressBarsSquare from "./ProgressBarsSquare";
import RocketOrientation from "./RocketOrientation";
import Map from "./Map";

import { Responsive } from "react-grid-layout";
import clsx from "clsx"
import CreateSquare from "./CreateSquare";

const ResponsiveGridLayout = NineGridWidthHeightProvideRGL(Responsive)

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    height: "100vh",
  },
  container: {
    flexGrow: 1,
    position: "absolute",
    top: theme.spacing(6),
    bottom: "0px",
    padding: theme.spacing(1),
  },
  row: {
    height: "100%",
  },
  item: {
    height: "33%",
  }
});

class NineGrid extends Component {
  constructor(props) {
    super(props);
    this.windowConfig = props.windowConfig;
    this.config = props.config;

    let slots = [];
    for (let slot of this.windowConfig.slots) {
      slots.push(slot);
    }
    for (let i = slots.length; i < 9; i ++) {
      slots.push({});
    }

    this.state = {
      slots: slots,
      layout: [
        { i: "0", x: 0, y: 0, w: 1, h: 1 },
        { i: "1", x: 1, y: 0, w: 1, h: 1 },
        { i: "2", x: 2, y: 0, w: 1, h: 1 },
        { i: "3", x: 0, y: 1, w: 1, h: 1 },
        { i: "4", x: 1, y: 1, w: 1, h: 1 },
        { i: "5", x: 2, y: 1, w: 1, h: 1 },
        { i: "6", x: 0, y: 2, w: 1, h: 1 },
        { i: "7", x: 1, y: 2, w: 1, h: 1 },
        { i: "8", x: 2, y: 2, w: 1, h: 1 }
      ]
    }

    this.itemRefs = [];
    for (let i = 0; i < 9; i ++) {
      this.itemRefs[i] = React.createRef();
    }

    this.fixLayout = this.fixLayout.bind(this);
    this.resetItem = this.resetItem.bind(this);
    this.setSlotConfig = this.setSlotConfig.bind(this);
  }

  fixLayout(layout) {
    const maxY = 2;
    const maxRowXs = layout.map((item) => item.y === maxY ? item.x : null).filter((value) => value !== null);
    const missingX = [0, 1, 2].find(value => maxRowXs.every(maxRowX => maxRowX !== value));
    return layout.map(item => {
      if (item.y > maxY) {
        return {
          ...item,
          y: maxY,
          x: missingX
        }
      }
      return item;
    });
  }

  resetItem(index) {
    return () => {
      let newSlots = [...this.state.slots];
      newSlots[index] = {};
      this.setState({slots: newSlots});
    }
  }

  setSlotConfig(index) {
    return (conf) => {
      let newSlots = [...this.state.slots];
      newSlots[index] = conf;
      this.setState({slots: newSlots});
    }
  }

  render() {
    const { layout, slots } = this.state;
    const { locked } = this.props;
    return (
      <ResponsiveGridLayout
        isResizable={false}
        layouts={{lg: layout, md: layout, sm: layout, xs: layout, xxs: layout}}
        cols={{lg: 3, md: 3, sm: 3, xs: 3, xxs: 3}}
        maxRows={3}
        onLayoutChange={l => this.setState({layout: this.fixLayout(l)})}
        isBounded={true}
        draggableHandle=".handle"
      >
        {
          slots.map((field, index) => (
            <div key={index.toString()} ref={this.itemRefs[index]}>
              {
                (() => {
                  switch (field.type) {
                    case "logs":
                      return (
                        <MessageDisplaySquare
                          reset={this.resetItem(index)}
                          locked={locked}
                        />
                      )
                    case "six-square":
                      return (
                        <SixValueSquare
                          reset={this.resetItem(index)}
                          locked={locked}
                          fields={
                            field.values.map(value => [
                              value.field,
                              value.name,
                              value.units,
                              null,
                              null,
                              null,
                              null,
                              value.func
                            ])
                          }
                        />
                      )
                    case "graph":
                      return (
                        <Graph
                          reset={this.resetItem(index)}
                          locked={locked}
                          fields={
                            field.values.map(value => ({
                              field: value.field,
                              name: value.name,
                              color: value.color,
                              unit: value.units
                            }))
                          }
                        />
                      )
                    case "four-button":
                      return (
                        <FourButtonSquare
                          reset={this.resetItem(index)}
                          locked={locked}
                          fields={
                            field.buttons.map(value => [
                              value.id,
                              value.type,
                              value.name,
                              value.field,
                              value.actions,
                              value.safe || false,
                              value.green || [],
                              value.keyEnable || -1,
                              value.keyDisable || -1
                            ])
                          }
                        />
                      )
                    case "launch":
                      return (
                        <LaunchButton
                          reset={this.resetItem(index)}
                          locked={locked}
                          mode={this.config.mode}
                        />
                      )
                    case "progress":
                      return (
                        <ProgressBarsSquare
                          reset={this.resetItem(index)}
                          locked={locked}
                          fields={
                            field.values.map(value => ({
                              field: value.field,
                              name: value.name,
                              units: value.units,
                              color: value.color,
                              minValue: value.minValue,
                              delta: value.delta
                            }))
                          }
                        />
                      )
                    case "orientation":
                      return (
                        <RocketOrientation
                          reset={this.resetItem(index)}
                          locked={locked}
                          fieldQW={field.qw}
                          fieldQX={field.qx}
                          fieldQY={field.qy}
                          fieldQZ={field.qz}
                        />
                      )
                    case "gpsmap": 
                      return (
                        <Map
                          reset={this.resetItem(index)}
                          locked={locked}
                          gpsLatitude={field.gpsLatitude}
                          gpsLongitude={field.gpsLongitude}
                        />
                    )
                    case undefined:
                      return (
                        <CreateSquare
                          reset={this.resetItem(index)}
                          locked={locked}
                          setSlotConfig={this.setSlotConfig(index)}
                        />
                      )
                    default:
                      return (
                        <ErrorSquare
                          reset={this.resetItem(index)}
                          locked={locked}
                          error={`Field type "${field.type}" not found`}
                        />
                      )
                  }
                })()
              }
            </div>
          ))
        }
      </ResponsiveGridLayout>
    )
  }
}

function NineGridWidthHeightProvideRGL(ComposedComponent) {
  return class WidthHeightProvider extends React.Component {

    static defaultProps = {
      measureBeforeMount: false
    };

    state = {
      width: 1280,
      height: 720
    };

    elementRef = React.createRef();
    mounted = false;

    componentDidMount() {
      this.mounted = true;
      window.addEventListener("resize", this.onWindowResize);
      this.onWindowResize();
    }

    componentWillUnmount() {
      this.mounted = false;
      window.removeEventListener("resize", this.onWindowResize);
    }

    onWindowResize = () => {
      if (!this.mounted) return;
      const node = this.elementRef.current;
      if (node instanceof HTMLElement && node.offsetWidth && node.offsetHeight) {
        this.setState({width: window.innerWidth, rowHeight: (window.innerHeight - node.offsetTop - 40) / 3});
      }
    };

    render() {
      const { measureBeforeMount, ...rest } = this.props;
      if (measureBeforeMount && !this.mounted) {
        return (
          <div
            className={clsx(this.props.className, "react-grid-layout")}
            style={this.props.style}
            ref={this.elementRef}
          />
        )
      }
      return (
        <ComposedComponent
          innerRef={this.elementRef}
          {...rest}
          {...this.state}
        />
      )
    }
  }
}

export default withTheme(withStyles(styles)(NineGrid));
