import {Component} from 'react';
// import {Icon,Radio} from 'antd';
// import KanbanStore from '../../stores/KanbanStore';
import {observer} from 'mobx-react';

@observer
class EditKanbanTableBodyTd extends Component{
  // constructor(props){
  //   super(props);
  //
  // }

  render(){
    const innerDivNumber = this.props.column.columnWidth;
    const innerDivStyle = {
      width:160,
      height:100,
      display:'inline-block',
    };
    let innerDivList = [];
    for(let i=0;i<innerDivNumber;i++){
      if(i===0){
        innerDivList.push(
          <div key={`${this.props.column.columnId}:${i}`} style={{...innerDivStyle}}>
            {this.props.column.columnName}
          </div>
        );
      }else{
        innerDivList.push(
          <div key={`${this.props.column.columnId}:${i}`} style={{...innerDivStyle,borderLeft:'1px dashed #0000ff57'}}>
            {this.props.column.columnName}
          </div>
        );
      }
    }
    return (
      <div className="cellDiv">
        {innerDivList}
      </div>
    );
  }
}

export default EditKanbanTableBodyTd;
