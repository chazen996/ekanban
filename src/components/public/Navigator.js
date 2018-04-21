import {Component} from 'react';
import {withRouter} from 'react-router-dom';

class Navigator extends Component{
  render(){
    const breadcrumbNameMap = {
      0: '/home',
      1: '/project/',
      2: '/sprint/',
      3: '/kanban/',
    };


    const nameArray = this.props.naviData.nameArray;
    const idArray = this.props.naviData.idArray;
    const number = nameArray.length;
    let result = [];
    for(let i = 0;i<number;i++){
      if(i!==0){
        result.push(
          <span key={`${i}${i}`} style={{
            margin: '0 5px'
          }}>/</span>
        );
      }
      result.push(
        <a key={i} href='javascript:void(0)' onClick={()=>{
          this.props.history.push(`${breadcrumbNameMap[i]}${idArray[i]===''||idArray[i]===' '?'':idArray[i]}`);
        }}>{nameArray[i]}</a>);
    }
    return(
      <div style={{ marginLeft: '1%'}}>
        {result}
      </div>
    );
  }

}
export default withRouter(Navigator);


