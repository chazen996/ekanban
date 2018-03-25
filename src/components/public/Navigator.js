import {Component} from 'react';
// import {withRouter} from 'react-router-dom';

class Navigator extends Component{
  // constructor(props){
  //   super(props);
  // }
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
      result.push(<a key={i} href={`${breadcrumbNameMap[i]}${idArray[i]}`}>{i===0?(nameArray[i]):(`/${nameArray[i]}`)}</a>);
    }
    return(
      <div style={{ marginLeft: '1%'}}>
        {result}
      </div>
    );
  }

}
export default Navigator;


