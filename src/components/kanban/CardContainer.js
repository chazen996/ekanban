import {Component} from 'react';
import Card from './Card';
import { DropTarget } from 'react-dnd';
import Config from "../../utils/Config";
// import KanbanStore from "../../stores/KanbanStore";
// import {observer} from 'mobx-react';
// import PublicAuthKit from '../../utils/PublicAuthKit';

const cardContainerTarget = {
  drop(props) {
    props.handleOnDropCard(props.columnId, props.x,props.y);
  },
  canDrop(props) {
    return props.canMoveCard(props.columnId, props.x,props.y);
  },
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  };
}

// @observer
class CardContainer extends Component{
  renderOverlay(color) {
    return (
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        opacity: 0.5,
        backgroundColor: color,
        zIndex: 25,
      }} />
    );
  }
  render(){
    const { connectDropTarget, isOver,canDrop } = this.props;

    let card = this.props.cardData;
    let columnId = this.props.columnId;
    let x = this.props.x;
    let y = this.props.y;

    let cardResult = null;
    if(card!=null&&card.columnId===columnId&&x===card.positionX&&y===card.positionY) {
      cardResult = (
        <div style={{
          display:'flex',
          justifyContent:'center',
          alignItems:'center',
          height: '100%'
        }}>
          <Card card={card}/>
        </div>
      );
    }

    return connectDropTarget(
      <div style={{...this.props.style,position:'relative',zIndex:22}}>
        {cardResult}
        {isOver && !canDrop && this.renderOverlay('red')}
        {!isOver && canDrop && this.renderOverlay('yellow')}
        {isOver && canDrop && this.renderOverlay('green')}
      </div>
    );
  }
}

export default DropTarget(Config.itemTypes.card, cardContainerTarget, collect)(CardContainer);
