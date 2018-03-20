import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Test1 from "./Test1";
import Test2 from "./Test2";

const Home = () => {
  return (
    <div>
      Home
      <Switch>
        <Route exact path='/home' component={Test1}/>
        <Route path='/home/test2' component={Test2}/>
      </Switch>
    </div>
  );
};

Home.propTypes = {
};

export default Home;
