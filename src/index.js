/*import dva from 'dva';
import './index.css';*/

// 1. Initialize
/*const app = dva();*/

// 2. Plugins
// app.use({});

// 3. Model
// app.model(require('./models/example').default);

// 4. Router
/*app.router(require('./router').default);*/

// 5. Start
/*app.start('#root');*/
// import React from 'react';
import ReactDom from 'react-dom';
import {BrowserRouter, Route} from 'react-router-dom';
import Example from "./components/Example";
import Home from "./components/Home";

ReactDom.render((
  <BrowserRouter>
    <div>
      <Route exact  path='/' component={Home}/>
      <Route path='/example' component={Example}/>
    </div>
  </BrowserRouter>
  ),document.getElementById("root"));
