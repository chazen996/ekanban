import {Component} from 'react';
import {Icon,message} from 'antd';
import Config from "../../utils/Config";
import KanbanStore from "../../stores/KanbanStore";
import { DragSource } from 'react-dnd';

const cardSource = {
  beginDrag(props) {
    KanbanStore.setDragingCard(props.card);
    return {};
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

class Card extends Component{
  deleteCard=(card)=>{
    KanbanStore.deleteCard(card).then(response=>{
      if(response){
        if(response.data==='success'){
          message.success('删除成功');
          const kanbanInfo = KanbanStore.getKanbanInfo;
          KanbanStore.loadData(kanbanInfo.kanbanId);
          KanbanStore.loadSprints(kanbanInfo.kanbanId);
        }else if(response.data==='failure'){
          message.error('删除失败，请稍后再试');
        }
      }else{
        message.error('网络错误，请稍后再试');
      }
    })
  };

  render(){
    const { connectDragSource, isDragging } = this.props;

    const assignedPerson = this.props.card.assignedPerson;
    return connectDragSource(
      <div style={{
        height:90,
        width:150,
        border:'1px solid #3333',
        background: Config.cardTypeColor[this.props.card.cardType],
        opacity:isDragging?0.5:1,
        zIndex:30,
        position:'relative'
      }}>
        <div style={{
          height:'18.8%',
          width:'100%',
          display:'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          borderBottom: '1px solid #d9d9d9',
          cursor:'move',
          position:'relative'
        }}>
          <div style={{
            position: 'absolute',
            left: 0,
            background: '#f5f5f5',
            color: 'black',
            height: '86%',
            // paddingLeft: 5,
            // paddingRight: 5,
            borderRadius: 2,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }} title={this.props.card.cardType==='other'?this.props.card.cardDescription:this.props.card.cardType}>
            <span style={{
              fontSize: 12,
              transform: 'scale(0.8)',
              maxWidth: 59,
              overflow: 'hidden',
              height:18
            }}>{this.props.card.cardType==='other'?this.props.card.cardDescription:this.props.card.cardType}</span>
          </div>
          <Icon type="close" style={{
            color:'white',
            cursor:'pointer'
          }} onClick={this.deleteCard.bind(this,this.props.card)}/>
        </div>
        <div style={{
          height:'81.2%',
          cursor:'pointer'
        }} onClick={()=>{
          const assignedPerson = this.props.card.assignedPerson;
          KanbanStore.setTargetCard(this.props.card);
          KanbanStore.setShowEditCardModal(true);
          const assignedPersonId = assignedPerson==null?0:assignedPerson.id;
          KanbanStore.setCardTypeChecked(this.props.card.cardType);
          KanbanStore.setAssignedPersonId(assignedPersonId);
        }}>
          <div style={{
            display:'inline-block',
            height: '100%',
            width: assignedPerson==null?'100%':'66.7%',
            padding: 5,
            paddingRight:assignedPerson==null?'5':'0'
          }}>
            <div style={{
              textOverflow:'ellipsis', display: '-webkit-box',
              WebkitLineClamp: '3',
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              width:'100%',
              height:'100%',
              color:'white',
              whiteSpace: 'normal',
              wordBreak: 'break-word'
            }}>
              {this.props.card.cardContent}
            </div>
          </div>
          {assignedPerson==null?(
            null
          ):(
            <div style={{
              display:'inline-block',
              height: '100%',
              width: '33.3%',
              verticalAlign:'top'
            }}>
              <div style={{
                width:'100%',
                height:'100%',
                display:'flex',
                justifyContent:'center',
                alignItems:'center'
              }}>
                <img src={`${Config.baseURL}/images/${assignedPerson.username}.jpg`} alt="assignedPerson" style={{
                  width: 35,
                  height: 35,
                  borderRadius: 50
                }}/>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default DragSource(Config.itemTypes.card, cardSource, collect)(Card);
