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

          </div>
        );
      }else{
        innerDivList.push(
          <div key={`${this.props.column.columnId}:${i}`} style={{...innerDivStyle,borderLeft:'1px dashed #0000ff57'}}>

          </div>
        );
      }
    }
    return (
      <div className={`cellDiv ${this.props.beCoveredBySwimlane?'swimlaneDiv':''}`} data-columnid={this.props.column.columnId} data-x={this.props.dataX} data-y={this.props.dataY} style={{
        height:100
      }}>
        {innerDivList}
      </div>
    );
  }
}

export default EditKanbanTableBodyTd;
