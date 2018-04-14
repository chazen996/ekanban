import {Component} from 'react';
import {Icon} from 'antd';
import Config from "../../utils/Config";

class Card extends Component{
  render(){
    const assignedPerson = this.props.card.assignedPerson;
    console.log(assignedPerson);
    return (
      <div style={{
        height:90,
        width:150,
        border:'1px solid #3333',
        background: Config.cardTypeColor[this.props.card.cardType],
      }}>
        <div style={{
          height:'18.8%',
          width:'100%',
          display:'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          borderBottom: '1px solid #d9d9d9'
        }}>
          <Icon type="close" style={{
            color:'white',
            cursor:'pointer'
          }}/>
        </div>
        <div style={{
          height:'81.2%'
        }}>
          <div style={{
            display:'inline-block',
            height: '100%',
            width: assignedPerson===0?'100%':'66.7%',
            padding: 5,
          }}>
            <div style={{
              textOverflow:'ellipsis', display: '-webkit-box',
              WebkitLineClamp: '3',
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              width:'100%',
              height:'100%',
              color:'white'
            }}>
              {this.props.card.cardContent}
            </div>
          </div>
          <div style={{
            display:assignedPerson===0?'none':'inline-block',
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
              <img src={`${Config.baseURL}/images/${this.props.card.assignedPerson}.jpg`} alt="assignedPerson" style={{
                width: 35,
                height: 35,
                borderRadius: 50
              }}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Card;
