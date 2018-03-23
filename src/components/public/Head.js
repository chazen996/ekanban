import {Component} from 'react';
import Navigator from './Navigator';

class Head extends Component{
  render(){
    const naviData = {
      'nameArray': ['home'],
      'idArray': ' '
    }

    return(
      <Navigator naviData={naviData}/>
    );
  }

}
export default Head;
