import React from 'react';
import { HashRouter, Switch, Route } from "react-router-dom";
import ReactDOM from 'react-dom';
import './index.css';
import WindowSelector from './WindowSelector';
import Main from './Main';
import Control from './Control';
import Aux1 from './Aux1';
import Aux2 from './Aux2';
import Cam1 from './Cam1';
import Cam2 from './Cam2';

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <Switch>
        <Route path='/selector' exact component={WindowSelector}/>
        <Route path='/main' exact component={Main} />
        <Route path='/control' exact component={Control} />
        <Route path='/aux1' exact component={Aux1} />
        <Route path='/aux2' exact component={Aux2} />
		<Route path='/cam1' exact component={Cam1} />
        <Route path='/cam2' exact component={Cam2} />
      </Switch>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
