import {Component} from 'react';
import Card from './Card';
// import KanbanStore from "../../stores/KanbanStore";
// import {observer} from 'mobx-react';
// import PublicAuthKit from '../../utils/PublicAuthKit';

// @observer
class CardContainer extends Component{
  render(){
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

    return (
      <div style={this.props.style}>
        {cardResult}
      </div>
    );
  }
}

export default CardContainer;
