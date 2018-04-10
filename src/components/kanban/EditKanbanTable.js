import {Component} from 'react';
// import kanbanPageStyles from '../../assets/css/kanbanPage.css';
// import icons from 'material-design-icons';
import {Icon,message} from 'antd';
import EditKanbanTableHeadTd from './EditKanbanTableHeadTd';
import EditKanbanTableBodyTd from './EditKanbanTableBodyTd';
import KanbanStore from '../../stores/KanbanStore';
import {observer} from 'mobx-react';
import PublicAuthKit from '../../utils/PublicAuthKit';
import Swimlane from './Swimlane';

@observer
class EditKanbanTable extends Component{
  constructor(props){
    super(props);

    this.columnMap = [];
    this.theadTdNextToBody = [];

    this.state = {
      drawSwimlane:false
    };
  }

  componentDidMount() {

  }

  componentDidUpdate(){
    const tbody = document.getElementsByTagName('tbody')[0];
    const kanbanContent = document.getElementById('kanban-content');
    const bodyContainer = document.getElementsByClassName('body-container')[0];
    tbody.onmousedown = null;
    tbody.onmousemove = null;
    document.onmouseup = null;

    if(this.state.drawSwimlane){
      tbody.onmousedown=()=>{
        let evt = window.event;
        const topAndLeft = {
          left: 0,
          top: 0,
        };
        PublicAuthKit.getTopAndLeft(kanbanContent,topAndLeft);

        let startX = evt.clientX - topAndLeft.left + bodyContainer.scrollLeft + document.documentElement.scrollTop;
        let startY = evt.clientY - topAndLeft.top + bodyContainer.scrollLeft + document.documentElement.scrollTop;

        let selDiv = document.createElement('div');
        selDiv.style.cssText = 'position:absolute;width:0px;height:0px;font-size:0px;margin:0px;padding:0px;border:1px dashed #0099FF;background-color:#C3D5ED;z-index:200;filter:alpha(opacity:60);opacity:0.6;display:none;pointer-events:none';
        selDiv.className = 'selectDiv';
        kanbanContent.appendChild(selDiv);
        selDiv.style.left = `${startX}px`;
        selDiv.style.top = `${startY}px`;

        let selList = [];
        const cellDivs = tbody.getElementsByClassName('cellDiv');
        for(let item of cellDivs){
          selList.push(item);
        }

        let selectedArray = [];
        let selectedArrayClassNameBackUp = [];

        tbody.onmousemove=()=>{
          evt = window.event;
          selDiv.style.display = '';
          let newX = (evt.clientX - topAndLeft.left) +
            bodyContainer.scrollLeft + document.documentElement.scrollLeft;
          let newY = (evt.clientY - topAndLeft.top) +
            bodyContainer.scrollTop + document.documentElement.scrollTop;

          selDiv.style.left = `${Math.min(newX, startX)}px`;
          selDiv.style.top = `${Math.min(newY, startY)}px`;
          selDiv.style.width = `${Math.abs(newX - startX)}px`;
          selDiv.style.height = `${Math.abs(newY - startY)}px`;

          const newL = selDiv.offsetLeft;
          const newT = selDiv.offsetTop;
          const newW = selDiv.offsetWidth;
          const newH = selDiv.offsetHeight;
          for (let i = 0; i < selList.length; i += 1) {
            const sl = selList[i].offsetLeft;
            const st = selList[i].offsetTop + tbody.offsetTop;
            if(sl + selList[i].offsetWidth > newL &&
              newL + newW > sl &&
              newT < st + selList[i].offsetHeight && newT + newH > st){
              let hasSameItem = false;/* 防止重复添加相同的div */
              for (let index = 0; index < selectedArray.length; index += 1) {
                const item = selectedArray[index];
                if (item === selList[i]) {
                  hasSameItem = true;
                  break;
                }
              }
              if (!hasSameItem) { /* 记录选中状态前的item */
                selectedArrayClassNameBackUp.push(selList[i].className);
              }
              if (selList[i].className.indexOf('selected') === -1) {
                selList[i].className = `${selList[i].className} selected`;
              }
              if (!hasSameItem) { /* 拿到所有选中的item数组 */
                selectedArray.push(selList[i]);
              }
            }else{
              let hasItem = false;
              let newI = 0;
              for (; newI < selectedArray.length; newI += 1) {
                if (selectedArray[newI] === selList[i]) {
                  hasItem = true;
                  break;
                }
              }
              if (hasItem) {
                selectedArray[newI].className = selectedArrayClassNameBackUp[newI];
                selectedArray.splice(newI, 1);
                selectedArrayClassNameBackUp.splice(newI, 1);
              }
            }
          }


        };
        document.onmouseup=()=>{
          evt = window.event;
          /* 清除页面上的所有selDiv */
          tbody.onmousemove = null;
          let selDivList = document.getElementsByClassName('selectDiv');
          let deletedArray = [];
          for(let i=0;i<selDivList.length;i++){
            deletedArray.push(selDivList[i]);
          }
          for(let item of deletedArray){
            kanbanContent.removeChild(item);
          }

          /*检查是否有重叠泳道(看备份的className是否都不包含select)*/
          let hasConflict = false;
          for(let item of selectedArrayClassNameBackUp){
            if(item.className.indexOf('selected')!==-1){
              hasConflict = true;
              break;
            }
          }

          if(!hasConflict){
            /* 可创建泳道 */
          }else{
            /* 恢复所有选中的div的原状态 */
            message.warning('泳道无法重叠,请重试', 1.5);
            for (let i = 0; i < selectedArray.length; i += 1) {
              selectedArray[i].className = selectedArrayClassNameBackUp[i];
            }
          }

          selectedArray = [];
          selectedArrayClassNameBackUp = [];
        };
      }
    }
  }

  generateColumnMap(array){
    this.columnMap = [];
    this.visitiWholeTree(array);
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
  visitiWholeTreeToolSpecial(node){
    if(node.subColumn==null||node.subColumn.length===0){
      this.theadTdNextToBody.push(node);
      return;
    }
    for(let item of node.subColumn){
      this.visitiWholeTreeToolSpecial(item);
    }
  }

  createTr(tdList,key){
    return (
      <tr key={key}>
        {tdList}
      </tr>
    );
  }

  handleOnAddColumn=(columnId,rootColumn)=>{
    const kanbanInfo = KanbanStore.getKanbanInfo;
    let columns = PublicAuthKit.deepCopy(KanbanStore.getColumns);
    this.generateColumnMap(columns);
    const column = {};
    const columnIdTemp = `temp:${PublicAuthKit.generateNoneDuplicateID(3)}`;
    if(!rootColumn){
      const targetColumn = this.columnMap[columnId];
      column['columnName'] = '未命名列名';
      column['columnId'] = columnIdTemp;
      column['columnWidth'] = 1;
      column['parentId'] = `${targetColumn.parentId},${targetColumn.columnId}`;
      column['kanbanId'] = kanbanInfo.kanbanId;
      column['position'] = targetColumn.subColumn.length;
      column['subColumn'] = [];

      targetColumn.subColumn.splice(targetColumn.subColumn.length,1,column);

    }else{
      column['columnName'] = '未命名列名';
      column['columnId'] = columnIdTemp;
      column['columnWidth'] = 1;
      column['parentId'] = "0";
      column['kanbanId'] = kanbanInfo.kanbanId;
      column['position'] = columns.length;
      column['subColumn'] = [];

      columns.splice(columns.length,1,column);
    }
    KanbanStore.setColumns(columns);
  };
  getParentColumn(array,column){
    const parentColumnIdArray = column.parentId.split(',');
    if(parentColumnIdArray.length<=1){
      console.log('无法找到此列的父级');
      return;
    }
    const targetColumnId = parentColumnIdArray[parentColumnIdArray.length-1];
    return array[targetColumnId];
  }
  handleOnDeleteColumn=(columnId)=>{
    let columns = PublicAuthKit.deepCopy(KanbanStore.getColumns);
    this.generateColumnMap(columns);
    const targetColumn = this.columnMap[columnId];
    if(targetColumn.parentId==='0'){
      for(let i=targetColumn.position+1;i<columns.length;i++){
        columns[i].position -= 1;
      }
      columns.splice(targetColumn.position,1);
    }else{
      const parentColumn = this.getParentColumn(this.columnMap,targetColumn);
      for(let i=targetColumn.position+1;i<parentColumn.subColumn.length;i++){
        parentColumn.subColumn[i].position -= 1;
      }
      parentColumn.subColumn.splice(targetColumn.position,1);
    }

    KanbanStore.setColumns(columns);
  };
  handleOnExtendColumn=(columnId)=>{
    let columns = PublicAuthKit.deepCopy(KanbanStore.getColumns);
    this.generateColumnMap(columns);
    const targetColumn = this.columnMap[columnId];
    targetColumn.columnWidth = targetColumn.columnWidth+1;
    KanbanStore.setColumns(columns);
  };
  handleOnShrinkColumn=(columnId)=>{
    let columns = PublicAuthKit.deepCopy(KanbanStore.getColumns);
    this.generateColumnMap(columns);
    const targetColumn = this.columnMap[columnId];
    targetColumn.columnWidth = targetColumn.columnWidth<=1?1:(targetColumn.columnWidth - 1);
    KanbanStore.setColumns(columns);
  };
  handleOnAddKanbanHeight=()=>{
    const kanbanInfo = KanbanStore.getKanbanInfo;
    kanbanInfo.kanbanHeight += 1;
    KanbanStore.setKanbanInfo(kanbanInfo);
  };
  handleOnReduceKanbanHeight=()=>{
    const kanbanInfo = KanbanStore.getKanbanInfo;
    kanbanInfo.kanbanHeight -= 1;
    KanbanStore.setKanbanInfo(kanbanInfo);
  };
  checkPositionSuccession(positionArray,result){

    for(let i=1;i<positionArray.length-1;i++){
      if((positionArray[i]-positionArray[i-1])===(positionArray[i+1]-positionArray[i])&&(positionArray[i]-positionArray[i-1])===1){
        result['flag'] = false;
        if(positionArray[i]-positionArray[i-1]===1){
          result["successionPosition"]=i;
        }else{
          result["successionPosition"]=i-1;
        }
        break;
      }
    }
    return result;
  }
  removeTargetValue(array,array2,value){
    for(let i=0; i<array.length; i++) {
      if(array[i] === value) {
        array.splice(i, 1);
        array2.splice(i,1);
        i -= 1
      }
    }
  }
  processSwimlane(swimlanes){
    let columns = PublicAuthKit.deepCopy(KanbanStore.getColumns);
    this.generateColumnMap(columns);
    for(let i=0;i<swimlanes.length;i++){
      let swimlane = swimlanes[i];
      let acrossColumn = swimlane.acrossColumn.split(',');
      let acrossColumnPositionOfTdNextToBody = [];
      for(let item of acrossColumn){
        acrossColumnPositionOfTdNextToBody.push(this.getColumnPositionYOfTdNextToBody(this.columnMap[item]));
      }
      this.removeTargetValue(acrossColumnPositionOfTdNextToBody,acrossColumn,-1);
      /* 检查对应column Y坐标是否连续 */
      let result ={
        flag:true,
        successionPosition:acrossColumnPositionOfTdNextToBody[0]
      };
      this.checkPositionSuccession(acrossColumnPositionOfTdNextToBody,result);
      let acrossColumnNumber = 0;
      if(result.flag){
        acrossColumnNumber = acrossColumnPositionOfTdNextToBody.length;
      }else{
        acrossColumnNumber = result.successionPosition - acrossColumnPositionOfTdNextToBody[0] + 1;
      }
      if(acrossColumnNumber===0){
        swimlanes.splice(i,1);
        i -= 1;
      }else{
        let totalWidth = 0;
        for(let j=0;j<acrossColumnNumber;j++){
          totalWidth += this.theadTdNextToBody[acrossColumnPositionOfTdNextToBody[0]+j].columnWidth;
        }
        swimlane.width = totalWidth;
        swimlane.acrossColumn = acrossColumn.join(',');
      }


      // if(this.columnMap[swimlane.columnId]==null||this.columnMap[swimlane.columnId].subColumn.length!==0){
      //   swimlanes.splice(i,1);
      //   i -= 1;
      // }else{
      //   let targetColumn = this.columnMap[swimlane.columnId];
      //   let targetColumnPositionY = this.getColumnPositionYOfTdNextToBody(targetColumn);
      //   let totalWidth = 0;
      //   for(let j=0;j<swimlane.acrossColumnNumber;j++){
      //     totalWidth += this.theadTdNextToBody[targetColumnPositionY+j].columnWidth;
      //   }
      //   swimlane.width = totalWidth;
      // }
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
  render(){
    const kanbanInfo = KanbanStore.getKanbanInfo;
    let columns = PublicAuthKit.deepCopy(KanbanStore.getColumns);

    /* 利用层级遍历生成树级结构 */
    let columnQueue = columns;
    let currentLayer = 1;
    let nodesNumberOfcurrentLayer = columnQueue.length;
    let nodesNumberOfNextLayer = 0;
    /* 设置tdNextToBody */
    this.theadTdNextToBody = [];
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

    /* 第二遍遍历生成表头数据 */
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
          <EditKanbanTableHeadTd
            column={column} colSpan={colSpan} rowSpan={rowSpan}
            nextToTbody={column.subColumn===null||column.subColumn.length===0}
            handleOnAddColumn={this.handleOnAddColumn}
            handleOnDeleteColumn={this.handleOnDeleteColumn}
            handleOnExtendColumn={this.handleOnExtendColumn}
            handleOnShrinkColumn={this.handleOnShrinkColumn}
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
    /* 处理万恶的泳道 */
    const testSwimlaneData = [
      {
        columnId:3,
        position:0,
        groupId:1,
        height:1,
        acrossColumn:'3'
      },{
        columnId:4,
        position:0,
        groupId:1,
        height:3,
        acrossColumn:'4,2'
      }
    ];
    /* 计算泳道的宽度 */
    this.processSwimlane(testSwimlaneData);
    /***************/
    /*开始生成表体数据*/
    const tableHeight = kanbanInfo.kanbanHeight;
    const tableWidth = this.theadTdNextToBody.length;
    let tBody = [];
    trList = [];
    for(let i=0;i<tableHeight;i++){
      tdList = [];
      for(let j=0;j<tableWidth;j++){
        let swimlane = null;
        for(let k=0;k<testSwimlaneData.length;k++){
          let swimlaneTemp = testSwimlaneData[k];
          let temp = {
            columnId:swimlaneTemp.acrossColumn.split(',')[0]
          };
          let positionY = this.getColumnPositionYOfTdNextToBody(temp);
          if(positionY===-1){
            testSwimlaneData.splice(k,1);
            k = k-1;
            continue;
          }
          if(i===swimlaneTemp.position&&j===positionY){
            swimlane = (
              <Swimlane swimlane={swimlaneTemp}/>
            );
            break;
          }
        }

        tdList.push(
          <td style={{
            margin:0,
            padding:0,
            border:'1px solid #C1C8D2',
            position:'relative'
          }} key={j}>
            <EditKanbanTableBodyTd column={this.theadTdNextToBody[j]}/>
            {swimlane}
          </td>
        );
      }
      trList.push(this.createTr(tdList,i));
    }
    tBody = trList;
    const iconStyle = {
      fontSize:22,
      cursor:'pointer',
      margin:'0 10px',
    };

    return (
      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          position: 'fixed',
          height: 32,
          right: 0,
          top: 81
        }}>
          <Icon type="plus-square-o" style={iconStyle}
                onClick={this.handleOnAddColumn.bind(this,null,true)}/>
          <Icon type="down" style={iconStyle}
                onClick={this.handleOnAddKanbanHeight}/>
          <Icon type="edit" style={iconStyle} onClick={()=>{
            this.setState({
              drawSwimlane:!this.state.drawSwimlane
            });
          }}/>
          <Icon type="up" style={iconStyle}
                onClick={this.handleOnReduceKanbanHeight}/>
          <Icon type="save" style={iconStyle}/>
        </div>
        <div id="kanban-content" style={{position:'relative'}}>
          <table style={{
            marginTop:42
          }}>
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

export default EditKanbanTable;
