import {Component} from 'react';
import Header from '../components/public/Header';

class HomePage extends Component{

  render(){
    const naviData = {
      'nameArray': ['首页'],
      'idArray': ' '
    }

    return (
      <Header naviData={naviData}/>
    );
  }


}

export default HomePage;
