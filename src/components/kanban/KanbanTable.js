import {Component} from 'react';
import {Icon,message} from 'antd';
import KanbanStore from '../../stores/KanbanStore';
import {observer} from 'mobx-react';
import PublicAuthKit from "../../utils/PublicAuthKit";
import KanbanTableHeadTd from "./KanbanTableHeadTd";
import StagingArea from "./StagingArea";
import SwimlaneForKanban from "./SwimlaneForKanban";
import KanbanTableBodyTd from "./KanbanTableBodyTd";


import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

@observer
class KanbanTable extends Component{
  constructor(props){
    super(props);
    this.columnMap = [];
    this.theadTdNextToBody = [];
    this.swimlaneGroupIdArry = [];

    this.cardMap = [];
    this.cardPosition = [];
  }
  componentDidUpdate(){
    this.resizeBodyContent();
  }

  resizeBodyContent=()=>{
    const kanbanContent = document.querySelector("#kanban-content");
    const stagingArea = document.querySelector("#staging-area");

    kanbanContent.style.width = `${window.innerWidth - stagingArea.offsetWidth -10}px`;
    setTimeout(this.resizeBodyContentTool(),200);
  };
  resizeBodyContentTool(){
    const kanbanContent = document.querySelector("#kanban-content");
    kanbanContent.style.width = `${kanbanContent.offsetWidth +10}px`;
  }
  createTr(tdList,key){
    return (
      <tr key={key}>
        {tdList}
      </tr>
    );
  }
  visitiWholeTree(array){
    for(let item of array){
      this.visitiWholeTreeTool(item);
    }
  }
  visitiWholeTreeTool(node){
    if(node.subColumn==null||node.subColumn.length===0){
      this.columnMap[node.columnId] = node;
      node.colSpan = 1;
      return 1;
    }
    let resultColSpan = 0;
    this.columnMap[node.columnId] = node;
    for(let item of node.subColumn){
      resultColSpan = resultColSpan + this.visitiWholeTreeTool(item);
    }
    node.colSpan = resultColSpan;
    return resultColSpan;
  }
  processSwimlane(swimlanes){
    for(let i=0;i<swimlanes.length;i++){
      let swimlane = swimlanes[i];
      let acrossColumn = swimlane.acrossColumn.split(',');
      let acrossColumnPositionOfTdNextToBody = [];
      for(let item of acrossColumn){
        let temp = {
          columnId:item
        };
        acrossColumnPositionOfTdNextToBody.push(this.getColumnPositionYOfTdNextToBody(temp));
      }

      let acrossColumnNumber = acrossColumnPositionOfTdNextToBody.length;

      let totalWidth = 0;
      for(let j=0;j<acrossColumnNumber;j++){
        totalWidth += this.theadTdNextToBody[acrossColumnPositionOfTdNextToBody[0]+j].columnWidth;
      }
      swimlane.width = totalWidth;
      swimlane.acrossColumn = acrossColumn.join(',');
      swimlane.columnPosition = this.getColumnPositionYOfTdNextToBody(this.columnMap[acrossColumn[0]]);
    }
  }
  getColumnPositionYOfTdNextToBody(column){
    if(column==null){
      return -1;
    }
    for(let i=0;i<this.theadTdNextToBody.length;i++){
      if(this.theadTdNextToBody[i].columnId.toString()===column.columnId.toString()){
        return i;
      }
    }
    return -1;
  }
  visitiWholeTreeToolSpecial(node){
    if(node.subColumn==null||node.subColumn.length===0){
      this.theadTdNextToBody.push(node);
      return;
    }
    for(let item of node.subColumn){
      this.visitiWholeTreeToolSpecial(item);
    }
  }
  confirmShowSwimlaneInfo=(groupId)=>{
    if(this.swimlaneGroupIdArry[groupId]!=null){
      return false;
    }else{
      this.swimlaneGroupIdArry[groupId] = true;
      return true;
    }
  };
  generateCardPositionTriple=(columnId,positionX,positionY)=>{
    let temp = [columnId,positionX,positionY];
    this.cardPosition[temp.join(',')] = 1;
  };
  canMoveCard=(columnId,positionX,positionY)=>{
    let temp = [columnId,positionX,positionY];
    if(this.cardPosition[temp.join(',')]!=null){
      return false;
    }
    return true;
  };
  generateCardMap=(cards)=>{
    this.cardMap = [];
    for(let card of cards){
      this.cardMap[card.cardId] = card;
    }
  };
  handleOnDropCard=(columnId,positionX,positionY)=>{
    let cards = PublicAuthKit.deepCopy(KanbanStore.getCardUnderKanban);
    const kanbanInfo = KanbanStore.getKanbanInfo;
    this.generateCardMap(cards);
    let cardTemp = PublicAuthKit.deepCopy(KanbanStore.getDragingCard);
    let targetCard = this.cardMap[cardTemp.cardId];
    if(targetCard==null){
      /*此卡片不在看板上，来源为暂存区*/
      targetCard = {
        ...cardTemp,
        kanbanId:kanbanInfo.kanbanId,
      };
      cards.push(targetCard);
    }
    targetCard.columnId = columnId;
    targetCard.positionX = positionX;
    targetCard.positionY = positionY;

    KanbanStore.setCardUnderKanban(cards);
  };

  render(){
    const showStagingArea = KanbanStore.getShowStagingArea;

    let columns = PublicAuthKit.deepCopy(KanbanStore.getColumns);

    let columnQueue = columns;
    let currentLayer = 1;
    let nodesNumberOfcurrentLayer = columnQueue.length;
    let nodesNumberOfNextLayer = 0;

    this.theadTdNextToBody = [];
    this.swimlaneGroupIdArry = [];
    for(let item of columns){
      this.visitiWholeTreeToolSpecial(item);
    }

    /* 第一遍遍历获取表头树总层数 */
    while (columnQueue.length!==0){
      let column = columnQueue.shift();
      nodesNumberOfcurrentLayer = nodesNumberOfcurrentLayer - 1;
      for(let item of column.subColumn){
        columnQueue.push(item);
        nodesNumberOfNextLayer = nodesNumberOfNextLayer + 1;
      }
      if(nodesNumberOfcurrentLayer===0&&nodesNumberOfNextLayer!==0) {
        nodesNumberOfcurrentLayer = nodesNumberOfNextLayer;
        currentLayer = currentLayer + 1;
        nodesNumberOfNextLayer = 0;
      }
    }

    columns = PublicAuthKit.deepCopy(KanbanStore.getColumns);
    /* 确定各列的colSpan(会添加colSpan字段) */
    this.visitiWholeTree(columns);

    const treeHeight = currentLayer;
    columnQueue = columns;
    let tdList = [];
    let trList = [];
    let tHead = null;
    currentLayer = 1;
    nodesNumberOfcurrentLayer = columnQueue.length;
    nodesNumberOfNextLayer = 0;
    while (columnQueue.length!==0){
      let column = columnQueue.shift();
      nodesNumberOfcurrentLayer = nodesNumberOfcurrentLayer - 1;
      for(let item of column.subColumn){
        columnQueue.push(item);
        nodesNumberOfNextLayer = nodesNumberOfNextLayer + 1;
      }
      let colSpan = column.colSpan;
      let rowSpan = column.subColumn.length===0||column.subColumn==null?(treeHeight-currentLayer+1):1;
      tdList.push(
        <td style={{
          margin:0,
          padding:0,
          border:'1px solid #C1C8D2'
        }} key={column.columnId} colSpan={colSpan}
            rowSpan={rowSpan}>
          <KanbanTableHeadTd
            column={column} colSpan={colSpan} rowSpan={rowSpan}
          />
        </td>);
      if(nodesNumberOfcurrentLayer===0) {
        trList.push(this.createTr(tdList,currentLayer));
        tdList = [];
        if(nodesNumberOfNextLayer!==0){
          nodesNumberOfcurrentLayer = nodesNumberOfNextLayer;
          currentLayer = currentLayer + 1;
          nodesNumberOfNextLayer = 0;
        }
      }
    }
    tHead = trList;

    const kanbanInfo = KanbanStore.getKanbanInfo;
    /* 处理泳道 */
    const swimlaneData = PublicAuthKit.deepCopy(KanbanStore.getSwimlanes);

    const cardUnderKanban = PublicAuthKit.deepCopy(KanbanStore.getCardUnderKanban);
    /* 清除不合法的任务卡片 */
    let cardIdList = {
      cardIdList:[],
      kanbanId:KanbanStore.getKanbanInfo.kanbanId
    };
    for(let i=0;i<cardUnderKanban.length;i++){
      let card = cardUnderKanban[i];
      if(card.columnId==null||this.getColumnPositionYOfTdNextToBody(card)===-1){
        cardIdList['cardIdList'].push(card.cardId);
        cardUnderKanban.splice(i,1);
        i -= 1;
      }else if(card.positionX>=kanbanInfo.kanbanHeight){
        cardIdList['cardIdList'].push(card.cardId);
        cardUnderKanban.splice(i,1);
        i -= 1;
      }
    }

    if(cardIdList.cardIdList.length!==0){
      KanbanStore.deleteUnusualCard(cardIdList).then(response=>{
        if(response){
          if(response.data==='success'){
            message.warning('发现异常任务，已自动清除');
            KanbanStore.setKanbanPageMaskLoadingStatus(true);
            KanbanStore.loadData(kanbanInfo.kanbanId);
          }
        }
      });
    }

    // for(let item of cardUnderKanban){
    //   this.cardHandledMap[item.cardId] = item;
    // }

    /* 计算泳道的宽度 */
    this.processSwimlane(swimlaneData);
    /***************/
    /*开始生成表体数据*/
    this.cardPosition = [];
    const tableHeight = kanbanInfo.kanbanHeight;
    const tableWidth = this.theadTdNextToBody.length;
    let tBody = [];
    trList = [];
    for(let i=0;i<tableHeight;i++){
      tdList = [];
      for(let j=0;j<tableWidth;j++){
        let swimlane = null;
        for(let k=0;k<swimlaneData.length;k++){
          let swimlaneTemp = swimlaneData[k];
          let temp = {
            columnId:swimlaneTemp.acrossColumn.split(',')[0]
          };
          let positionY = this.getColumnPositionYOfTdNextToBody(temp);
          if(i===swimlaneTemp.position&&j===positionY){
            swimlane = (
              <SwimlaneForKanban swimlane={swimlaneTemp} showSwimlaneInfo={this.confirmShowSwimlaneInfo(swimlaneTemp.groupId)}/>
            );
            break;
          }
        }
        /* 解决跨列的泳道的border问题 */
        let beCoveredBySwimlane = false;
        for(let k=0;k<swimlaneData.length;k++){
          let swimlaneTemp = swimlaneData[k];
          if(swimlaneTemp.columnPosition<=j&&
            swimlaneTemp.columnPosition+swimlaneTemp.acrossColumn.split(',').length-1>=j&&
            swimlaneTemp.position<=i&&swimlaneTemp.position+swimlaneTemp.height-1>=i){
            beCoveredBySwimlane = true;
            break;
          }
        }
        let borderBottom = null;
        let borderTop = null;
        if(i===tableHeight-1){
          borderBottom = '1px solid #C1C8D2';
          if(beCoveredBySwimlane){
            borderTop = '1px solid #C1C8D2';
          }else{
            borderTop = 'none';
          }
        }else{
          if(beCoveredBySwimlane){
            borderTop = '1px solid #C1C8D2';
            borderBottom = '1px solid #C1C8D2';
          }else{
            borderTop = 'none';
            borderBottom = 'none';
          }
        }
        let cardList = [];

        // PublicAuthKit.removeItem('cardPosition');
        /* 判断当前单元格是否有卡片需要渲染（剪枝增加性能） */
        for(let l=0;l<cardUnderKanban.length;l++){
          let card = cardUnderKanban[l];
          if(card.columnId===this.theadTdNextToBody[j].columnId&&card.positionX===i){
            // cardList.push(card);
            cardList[card.positionY]=card;
            cardUnderKanban.splice(l,1);
            l -= 1;
            this.generateCardPositionTriple(card.columnId,card.positionX,card.positionY);
          }
        }

        tdList.push(
          <td style={{
            margin:0,
            padding:0,
            borderWidth:1,
            borderColor:'#C1C8D2',
            borderStyle:'solid',
            position:'relative',
            borderTop:borderTop,
            borderBottom:borderBottom
            // borderBottomStyle:borderBottomStyle,
            // borderTopStyle: borderTopStyle
          }} key={j}>
            <KanbanTableBodyTd column={this.theadTdNextToBody[j]}
                               dataX={i}
                               dataY={j}
                               cardData={cardList}
                               canMoveCard={this.canMoveCard}
                               handleOnDropCard={this.handleOnDropCard}
            />
            {swimlane}
          </td>
        );
      }
      trList.push(this.createTr(tdList,i));
    }
    tBody = trList;
    // this.deleteUnusualCard();

    const iconStyle = {
      fontSize:22,
      cursor:'pointer',
      margin:'0 10px',
    };
    return (
      <div>
        <div id="kanban-edit-panel" style={{
          display: 'flex',
          justifyContent: 'flex-end',
          height: 32,
          zIndex:4,
          boxShadow: 'rgb(240, 241, 242) 0px 2px 8px',
          borderBottom: '1px solid #0000001a',
          alignItems: 'center'
        }}>
          <Icon type="eye-o" style={{...iconStyle,color:showStagingArea?'blue':''}} onClick={()=>{
            const kanbanInfo = KanbanStore.getKanbanInfo;
            if(!showStagingArea){
              KanbanStore.setStagingAreaMaskLoadingStatus(true);
              KanbanStore.setShowStagingArea(true);
              KanbanStore.loadSprints(kanbanInfo.kanbanId);
            }else{
              KanbanStore.setShowStagingArea(false);
            }
          }}/>
        </div>
        <div style={{
          display:showStagingArea?'inline-block':'none',
          overflow: 'hidden'
        }}>
          <StagingArea />
        </div>
        <div id="kanban-content" style={{
          position:'relative',
          overflow:'auto',
          whiteSpace: 'nowrap',
          display:'inline-block',
          verticalAlign:'top'
        }}>

          <table>
            <thead>
              {tHead}
            </thead>
            <tbody>
              {tBody}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

}

export default DragDropContext(HTML5Backend)(KanbanTable);
