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
import { BrowserRouter,Route } from 'react-router-dom';
// import Example from "./components/Example";
// import Test2 from "./components/Test2";
import LoginPage from "./routes/LoginPage"
import AuthRoute from "./components/public/AuthRoute";
import HomePage from "./routes/HomePage";
import RegisterPage from "./routes/RegisterPage";
// import Head from "./components/public/Head";
// import LoginRoute from "./components/LoginRoute";

ReactDom.render((
  <div>
    <BrowserRouter>
      <div>
        <AuthRoute exact path='/' ForLogin={true} component={LoginPage}/>
        <AuthRoute path='/home' component={HomePage}/>
        <Route path='/login' ForLogin={true} component={LoginPage}/>
        <Route path='/register' component={RegisterPage}/>
      </div>
    </BrowserRouter>
  </div>
  ),document.getElementById("root"));
