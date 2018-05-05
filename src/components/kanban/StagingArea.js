import {Component} from 'react';
import {Icon,Collapse,Spin} from 'antd';
import {observer} from 'mobx-react';
import KanbanStore from '../../stores/KanbanStore';
import Card from "./Card";
import PublicAuthKit from "../../utils/PublicAuthKit";

const Panel = Collapse.Panel;
require("../../assets/css/kanbanPage.css");

@observer
class StagingArea extends Component{
  // constructor(props){
  //   super(props);
  //   this.tdNextToBody
  // }
  visitiWholeTree=(node)=>{
    if(node.subColumn==null||node.subColumn.length===0){
      this.tdNextToBody[node.columnId] = node;
      return;
    }
    for(let item of node.subColumn){
      this.visitiWholeTree(item);
    }
  };
  render(){

    const panelStyle = {
      backgroundColor:'#f7f7f7',
      borderRadius: 0,
      border: 0,
      overflow: 'hidden',
    };
    /* 所有位置不合法以及在看版上添加的卡片需要渲染到暂存区当前看板区域内 */

    let cards = PublicAuthKit.deepCopy(KanbanStore.getCardUnderKanban);
    let kanbanCardArray = [];
    let kanbanInfo = KanbanStore.getKanbanInfo;
    let columns = PublicAuthKit.deepCopy(KanbanStore.getColumns);
    this.tdNextToBody = [];
    /* 构造tdNextToBody的map */
    for(let item of columns){
      this.visitiWholeTree(item);
    }

    for(let card of cards){
      if(card.columnId==null||card.columnId===''||
          this.tdNextToBody[card.columnId]==null||
          this.tdNextToBody[card.columnId].columnWidth<=card.positionY||
          kanbanInfo.kanbanHeight<=card.positionX
      ){
        kanbanCardArray.push(
          <div key={card.cardId} style={{
            margin:'6px 9px'
          }}>
            <Card card={card}/>
          </div>
        );
      }
    }


    let sprints = PublicAuthKit.deepCopy(KanbanStore.getOpenedSprints);
    let panelList = [];
    panelList.push(
      <Panel header='当前看板' key='0' id='kanban-stagging-area' style={{...panelStyle,color:'blue'}}>
        {
          <div style={{
            display: 'flex',
            // justifyContent: 'space-evenly',
            padding: '12px 0',
            background: '#e4e4e4',
            flexWrap: 'wrap',
            borderBottom: '1px solid #f1f1f1'
          }}>
            {kanbanCardArray.length===0?(
              <div style={{
                height:50,
                display:'flex',
                justifyContent:'center',
                alignItems:'center',
                background: '#e4e4e4',
                width:'100%'
              }}>
                <span style={{
                  color: 'rgba(0,0,0,0.45)'
                }}>暂无内容</span>
              </div>
            ):(
              kanbanCardArray
            )}
          </div>



          // .length===0?(
          //   <div style={{
          //     height:50,
          //     display:'flex',
          //     justifyContent:'center',
          //     alignItems:'center',
          //     // paddingTop: 18,
          //     background: '#e4e4e4',
          //   }}>
          //     <span style={{
          //       color: 'rgba(0,0,0,0.45)'
          //     }}>暂无内容</span>
          //   </div>
          // ):(
          //
          // )
        }

      </Panel>
    );

    for(let sprint of sprints){
      let cardArray = [];
      for(let card of sprint.cardList){
        cardArray.push(
          <div key={card.cardId} style={{
            margin:'6px 9px'
          }}>
            <Card card={card}/>
          </div>
        );
      }
      panelList.push(
        <Panel header={sprint.sprintName} key={sprint.sprintId} style={{...panelStyle,marginTop: 12}} >
          <div style={{
            display: 'flex',
            // justifyContent: 'space-evenly',
            padding: '12px 0',
            background: '#e4e4e4',
            flexWrap: 'wrap',
            borderBottom: '1px solid #f1f1f1'
          }}>
            {cardArray.length===0?(
              <div style={{
                height:50,
                display:'flex',
                justifyContent:'center',
                alignItems:'center',
                background: '#e4e4e4',
                width:'100%'
              }}>
                <span style={{
                  color: 'rgba(0,0,0,0.45)'
                }}>暂无内容</span>
              </div>
            ):(
              cardArray
            )}
          </div>
        </Panel>
      );
    }

    return (
      <Spin spinning={KanbanStore.getStagingAreaMaskLoadingStatus} size='large' className="spin-mask">
        <div id="staging-area" style={{
          width:350,
          // height:'100%',
          border:'1px solid rgb(232, 232, 232)'
        }}>
          <div style={{
            display:'flex',
            justifyContent:'center',
            alignItems:'center',
            position:'relative',
            height:52,
            background: '#fafafa78',
            borderBottom: '1px solid rgb(193, 200, 210)'
          }}>
          <span style={{
            fontSize: 16,
            fontWeight: 'bolder'
          }}>暂存区</span>
            <Icon type="double-left" style={{
              position:'absolute',
              right: 10,
              fontSize: 15,
              cursor:'pointer'
            }} onClick={()=>{
              KanbanStore.setShowStagingArea(false);
            }}/>
          </div>
          <div style={{
            // minHeight: 568,
            background: '#33333312',
            height: 'calc(100% - 52px)'
          }}>
            <Collapse style={{
              backgroundColor:'#e4e4e4',
              height: '100%',
              overflow: 'auto'
            }}>
              {panelList}
            </Collapse>
          </div>
        </div>
      </Spin>
    );
  }
}

export default StagingArea;
