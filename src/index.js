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

import LoginPage from "./routes/LoginPage"
import AuthRoute from "./components/public/AuthRoute";
import HomePage from "./routes/HomePage";
import RegisterPage from "./routes/RegisterPage";
import ProjectPage from "./routes/ProjectPage";
import KanbanPage from "./routes/KanbanPage";
import EditKanbanPage from "./routes/EditKanbanPage";

import Card from "./components/kanban/StagingArea";

ReactDom.render((
  <div>
    <BrowserRouter>
      <div>
        <AuthRoute exact path='/' component={HomePage}/>
        <AuthRoute path='/home' component={HomePage}/>
        <Route path='/login' component={LoginPage}/>
        <Route path='/register' component={RegisterPage}/>

        <AuthRoute exact path='/project/:projectId' component={ProjectPage}/>
        <AuthRoute exact path='/kanban/:kanbanId' component={KanbanPage}/>
        <AuthRoute exact path='/editKanban/:kanbanId' component={EditKanbanPage}/>
        <Route path='/test' component={Card}/>
      </div>
    </BrowserRouter>
  </div>
  ),document.getElementById("root"));
