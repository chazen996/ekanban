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
import { BrowserRouter } from 'react-router-dom';
import Example from "./components/Example";
// import Home from "./components/Home";
// import Test2 from "./components/Test2";
import LoginPage from "./routes/LoginPage"
import AuthRoute from "./components/AuthRoute";
// import LoginRoute from "./components/LoginRoute";

ReactDom.render((
  <div>
    <BrowserRouter>
      <div>
        <AuthRoute exact path='/' ForLogin={true} component={LoginPage}/>
        <AuthRoute path='/example' component={Example}/>
        <AuthRoute path='/login' ForLogin={true} component={LoginPage}/>
      </div>
    </BrowserRouter>
  </div>
  ),document.getElementById("root"));
