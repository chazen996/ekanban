import {Component} from 'react';
import Card from './Card';
import KanbanStore from "../../stores/KanbanStore";
import {observer} from 'mobx-react';
import PublicAuthKit from '../../utils/PublicAuthKit';

@observer
class CardContainer extends Component{
  render(){
    let cards = PublicAuthKit.deepCopy(KanbanStore.getCardUnderKanban);
    let columnId = this.props.columnId;
    let x = this.props.x;
    let y = this.props.y;
    let reference = null;
    for(let i=0;i<cards.length;i++){
      let card = cards[i];
      if(card.columnId===columnId&&x===card.positionX&&y===card.positionY){
        reference = card;
        break;
      }
    }
    let cardResult = null;
    if(reference!=null){
      cardResult = (
        <div style={{
          display:'flex',
          justifyContent:'center',
          alignItems:'center',
          height: '100%'
        }}>
          <Card card={reference}/>
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
