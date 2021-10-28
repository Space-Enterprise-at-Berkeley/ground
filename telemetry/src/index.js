import React from 'react';
import {
  HashRouter,
  Switch,
  Route
} from "react-router-dom";
import ReactDOM from 'react-dom';
import './index.css';
import WindowSelector from './WindowSelector';
import Main from './Main';
import Control from './Control';
import Aux1 from './Aux1';
import Aux2 from './Aux2';
import DAQ3Test from "./DAQ3Test";

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <Switch>
        <Route path='/selector' exact component={WindowSelector}/>
        <Route path='/main' exact component={Main} />
        <Route path='/control' exact component={Control} />
        <Route path='/aux1' exact component={Aux1} />
        <Route path='/aux2' exact component={Aux2} />
        <Route path='/daq3test' exact component={DAQ3Test} />
      </Switch>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
