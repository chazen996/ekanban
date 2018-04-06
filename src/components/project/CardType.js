import {Component} from 'react';
import {Icon} from 'antd';
import ProjectStore from "../../stores/ProjectStore";
import {observer} from 'mobx-react';
import Config from "../../utils/Config";

@observer
class CardType extends  Component{
  handleOnCardTypeClick = (type)=>{
    ProjectStore.setCardTypeChecked(type);
  }
  render(){
    const cardType = (type)=>{

       const typeStyle = {
        borderRadius: 4,
        border: '1px solid',
         width:50,
         borderColor:Config.cardTypeColor[type],
        background: Config.cardTypeColor[type],
         color: 'white',
      justifyContent: 'center',
      display: 'flex',
         cursor:'pointer',
         height: 22,
      alignItems: 'center'
      };
      return (
        <div style={typeStyle} onClick={this.handleOnCardTypeClick.bind(this,type)}>
          <span>{type}</span>
          {type===ProjectStore.getCardTypeChecked?(
            <div>
              <Icon type="check" />
            </div>):(null)}
        </div>
      );
    }

    // const checked = ProjectStore.getCardTypeChecked;
    return (
      <div style={{display:'flex',width: 220,justifyContent: 'space-between'}}>
        {cardType('story')}
        {cardType('task')}
        {cardType('bug')}
        {cardType('other')}
      </div>
    );
  }
}

export default CardType;
