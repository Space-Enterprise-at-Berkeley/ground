import React, { Component } from "react";
import { HashRouter, Switch, Route, useLocation, Router, BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom";
import "./index.css";
import WindowSelector from "./WindowSelector";
import Main from "./Main";
import Control from "./Control";
import Aux1 from "./Aux1";
import Aux2 from "./Aux2";
import { ThemeProvider, createTheme, CssBaseline, Typography } from "@material-ui/core";
import Settings from "./components/Settings";
import Navbar from "./components/Navbar";
import comms from "./api/Comms";
import LayoutSwitch from "./components/LayoutSwitch";

class App extends Component {
  constructor() {
    super();
    this.state = {
      isDark: false,
      showSettings: false
    };

    this.changeLightDark = this.changeLightDark.bind(this);
    this.openSettings = this.openSettings.bind(this);
    this.closeSettings = this.closeSettings.bind(this);
  }

  changeLightDark() {
    // comms.setDarkMode(!this.state.isDark);
    this.setState({ isDark: !this.state.isDark });
  }
  openSettings() {
    this.setState({ showSettings: true });
  }

  closeSettings() {
    this.setState({ showSettings: false });
  }

  componentDidMount() {
    let config = JSON.parse(atob(window.location.hash.split("&")[1]));
    document.title = `Telemetry: ${config.windows[window.location.hash.split("&")[0].substring(2)].name}`;
    comms.connect();
  }

  componentWillUnmount() {
    comms.destroy();
  }

  render() {
    const theme = createTheme({
      palette: {
        type: this.state.isDark ? "dark" : "light",
        primary: {
          main: "#43a047",
          darker: "#388e3c",
          contrastText: "#fff",
        },
        success: {
          main: "#43a047",
          darker: "#388e3c",
          contrastText: "#fff",
        },
        secondary: {
          main: "#1976d2",
          darker: "#115293",
          contrastText: "#fff",
        },
        neutral: {
          main: "#64748B",
          contrastText: "#fff",
        },
      },
    });

    return (
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorSchema />
        <Settings
          open={this.state.showSettings}
          closeSettings={this.closeSettings}
        />
        <BrowserRouter>
          <Navbar
            changeLightDark={this.changeLightDark}
            openSettings={this.openSettings}
            config={JSON.parse(atob(window.location.hash.split("&")[1]))}
          />
          <LayoutSwitch />
        </BrowserRouter>
      </ThemeProvider>
    );
  }
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
