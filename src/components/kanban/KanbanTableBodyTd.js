import {Component} from 'react';
import {observer} from 'mobx-react';
import CardContainer from "./CardContainer";

@observer
class EditKanbanTableBodyTd extends Component{

  render(){
    const innerDivNumber = this.props.column.columnWidth;
    const cardData = this.props.cardData;
    const innerDivStyle = {
      width:160,
      height:100,
      display:'inline-block',
      verticalAlign: 'top'
    };
    let innerDivList = [];
    for(let i=0;i<innerDivNumber;i++){
      if(i===0){
        innerDivList.push(
          <CardContainer key={`${this.props.column.columnId}:${i}`}
                         style={{...innerDivStyle}}
                         x={this.props.dataX}
                         y={i}
                         columnId={this.props.column.columnId}
                         cardData={cardData[i]}
                         canMoveCard={this.props.canMoveCard}
                         handleOnDropCard={this.props.handleOnDropCard}
          />
        );
      }else{
        innerDivList.push(
          <CardContainer key={`${this.props.column.columnId}:${i}`}
                         style={{...innerDivStyle,borderLeft:'1px dashed #0000ff14'}}
                         x={this.props.dataX}
                         y={i}
                         columnId={this.props.column.columnId}
                         cardData={cardData[i]}
                         canMoveCard={this.props.canMoveCard}
                         handleOnDropCard={this.props.handleOnDropCard}
          />
        );
      }
    }
    return (
      <div style={{
        height:100
      }}>
        {innerDivList}
      </div>
    );
  }
}

export default EditKanbanTableBodyTd;
