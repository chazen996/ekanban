import {Component} from 'react';
import {Icon,message,notification,Popover} from 'antd';
import EditKanbanTableHeadTd from './EditKanbanTableHeadTd';
import EditKanbanTableBodyTd from './EditKanbanTableBodyTd';
import KanbanStore from '../../stores/KanbanStore';
import {observer} from 'mobx-react';
import PublicAuthKit from '../../utils/PublicAuthKit';
import Swimlane from './Swimlane';
import {withRouter} from 'react-router-dom';

require("../../assets/css/kanbanPage.css");

const openNotification = () => {
  notification.open({
    message: 'Tips:',
    description: (
      <div>按住鼠标<b style={{color: '#c7254e', backgroundColor: '#f9f2f4'}}>左键</b>拖拽<b style={{background: 'aliceblue',
         color: '#4192d9'}}>单元格</b>绘制泳道
      </div>),
  });
};

@observer
class EditKanbanTable extends Component{
  constructor(props){
    super(props);

    this.columnMap = [];
    this.theadTdNextToBody = [];
    this.swimlaneGroupIdArry = [];

    this.toBeDeletedColumn = [];
    this.toBeDeletedSwimlane = [];


    this.state = {
      drawSwimlane:false
    };
  }


  componentDidUpdate(){
    const tbody = document.getElementsByTagName('tbody')[0];
    const kanbanContent = document.getElementById('kanban-content');
    // const bodyContainer = document.getElementsByClassName('body-container')[0];
    tbody.onmousedown = null;
    tbody.onmousemove = null;
    document.onmouseup = null;

    if(this.state.drawSwimlane){
      tbody.onmousedown=()=>{
        let evt = window.event;
        PublicAuthKit.clearSelections();
        if(evt.target.parentNode==null){
          return;
        }else if(evt.target.parentNode.className.indexOf('cellDiv')===-1){
          return;
        }
        // if(!evt.target.match('div')&&evt.target)
        const topAndLeft = {
          left: 0,
          top: 0,
        };
        PublicAuthKit.getTopAndLeft(kanbanContent,topAndLeft);

        // let startX = evt.clientX - topAndLeft.left + bodyContainer.scrollLeft + document.documentElement.scrollTop;
        // let startY = evt.clientY - topAndLeft.top + bodyContainer.scrollLeft + document.documentElement.scrollTop;

        let startX = evt.clientX - topAndLeft.left + kanbanContent.scrollLeft + document.documentElement.scrollTop;
        let startY = evt.clientY - topAndLeft.top + kanbanContent.scrollTop + document.documentElement.scrollTop;

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
            kanbanContent.scrollLeft + document.documentElement.scrollLeft;
          let newY = (evt.clientY - topAndLeft.top) +
            kanbanContent.scrollTop + document.documentElement.scrollTop;

          selDiv.style.left = `${Math.min(newX, startX)}px`;
          selDiv.style.top = `${Math.min(newY, startY)}px`;
          selDiv.style.width = `${Math.abs(newX - startX)}px`;
          selDiv.style.height = `${Math.abs(newY - startY)}px`;

          const newL = selDiv.offsetLeft;
          const newT = selDiv.offsetTop;
          const newW = selDiv.offsetWidth;
          const newH = selDiv.offsetHeight;
          for (let i = 0; i < selList.length; i += 1) {
            const sl = selList[i].parentNode.offsetLeft;
            const st = selList[i].parentNode.offsetTop;
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
                selList[i].classList.add('selected');
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
            if(item.indexOf('swimlaneDiv')!==-1){
              hasConflict = true;
              break;
            }
          }

          if(!hasConflict){
            /* 可创建泳道 */
            this.handleOnCreateSwimlane(selectedArray);
          }else{
            /* 恢复所有选中的div的原状态 */
            message.warning('泳道无法重叠,请重试', 1.5);
            for (let i = 0; i < selectedArray.length; i += 1) {
              selectedArray[i].className = selectedArrayClassNameBackUp[i];
            }
          }

          /* 将所有cellDiv的selected去除 */
          for(let item of selectedArray){
            item.classList.remove('selected');
          }

          selectedArray = [];
          selectedArrayClassNameBackUp = [];
          PublicAuthKit.clearSelections();
        };
      }
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
  handleOnCreateSwimlane=(cellDivs)=>{
    const swimlanes = PublicAuthKit.deepCopy(KanbanStore.getSwimlanes);
    const groupId = PublicAuthKit.generateNoneDuplicateID(3);
    const kanbanInfo = KanbanStore.getKanbanInfo;
    for(let cell of cellDivs){
      let columnId = cell.getAttribute('data-columnid');

      let position = parseInt(cell.getAttribute('data-x'),10);
      let columnPosition = parseInt(cell.getAttribute('data-y'),10);
      let swimlaneId = PublicAuthKit.generateNoneDuplicateID(3);
      let swimlane = {
        swimlaneName : '未命名泳道',
        position:position,
        swimlaneId: swimlaneId,
        groupId:groupId,
        height:1,
        acrossColumn:columnId,
        kanbanId: kanbanInfo.kanbanId,

        columnPosition:columnPosition,
        groupMemberNumber:cellDivs.length
      };
      swimlanes.push(swimlane);
    }
    KanbanStore.setSwimlanes(swimlanes);
  };
  addDeletedItem=(item,type)=>{
    if(type==='column'){
      this.toBeDeletedColumn.push(item.columnId);
    }else if(type==='swimlane'){
      this.toBeDeletedSwimlane.push(item.swimlaneId);
    }
  };
  handleOnDeleteSwimlane=(value,deletedById)=>{
    let swimlanes = PublicAuthKit.deepCopy(KanbanStore.getSwimlanes);

    if(deletedById){
      for(let i=0;i<swimlanes.length;i++){
        let swimlane = swimlanes[i];
        if(value===swimlane.swimlaneId){
          this.addDeletedItem(swimlane,'swimlane');
          swimlanes.splice(i,1);
          break;
        }
      }
    }else{
      for(let i=0;i<swimlanes.length;i++){
        let swimlane = swimlanes[i];
        if(value===swimlane.groupId){
          this.addDeletedItem(swimlane,'swimlane');
          swimlanes.splice(i,1);
          i -= 1;
        }
      }
    }
    KanbanStore.setSwimlanes(swimlanes);
  };

  handleOnJoinSwimlane=(targetSwimlaneId,groupId)=>{
    let swimlanes = PublicAuthKit.deepCopy(KanbanStore.getSwimlanes);

    let maxX = null;let minX = null;
    let maxY = null;let minY = null;
    let flag = true;
    let referenceOfTargetSwimlane = null;
    for(let i=0;i<swimlanes.length;i++){
      let swimlane = swimlanes[i];
      if(groupId===swimlane.groupId){
        if(flag){
          maxX = swimlane.position;minX = swimlane.position;
          maxY = swimlane.columnPosition;minY = swimlane.columnPosition;
          flag = false;
        }else{
          if(maxX<swimlane.position){
            maxX = swimlane.position;
          }
          if(minX>swimlane.position){
            minX = swimlane.position;
          }
          if(maxY<swimlane.columnPosition){
            maxY = swimlane.columnPosition;
          }
          if(minY>swimlane.columnPosition){
            minY = swimlane.columnPosition;
          }
        }
        if(targetSwimlaneId!==swimlane.swimlaneId){
          this.handleOnDeleteSwimlane(swimlane.swimlaneId,true);
          swimlanes.splice(i,1);
          i -= 1;
        }else{
          referenceOfTargetSwimlane = swimlane;
        }
      }
    }
    let count = maxY - minY +1;
    let columnTemp = {
      columnId:referenceOfTargetSwimlane.acrossColumn
    };
    let targetSwimlaneColumnPosition = this.getColumnPositionYOfTdNextToBody(columnTemp);
    let acrossColumnArray = [];
    for(let j=0;j<count;j++){
      acrossColumnArray.push(this.theadTdNextToBody[targetSwimlaneColumnPosition+j].columnId);
    }
    referenceOfTargetSwimlane.height = maxX-minX+1;
    referenceOfTargetSwimlane.acrossColumn = acrossColumnArray.join(',');
    referenceOfTargetSwimlane.groupMemberNumber = 1;

    KanbanStore.setSwimlanes(swimlanes);
  };
  handleOnSplitSwimlane=(targetSwimlaneId)=>{
    let swimlanes = PublicAuthKit.deepCopy(KanbanStore.getSwimlanes);
    let reference = null;
    for(let item of swimlanes){
      if(item.swimlaneId===targetSwimlaneId){
        reference = item;
        break;
      }
    }
    const acrossColumnArray = reference.acrossColumn.split(',');
    const groupMemberNumber = acrossColumnArray.length*reference.height;
    for(let i=0;i<reference.height;i++){
      for(let j=0;j<acrossColumnArray.length;j++){
        if(i===0&&j===0){
          continue;
        }
        let swimlaneId = PublicAuthKit.generateNoneDuplicateID(3);
        let swimlane = {
          swimlaneName : reference.swimlaneName,
          position:reference.position+i,
          swimlaneId: swimlaneId,
          groupId:reference.groupId,
          height:1,
          acrossColumn:acrossColumnArray[j],

          columnPosition:reference.columnPosition+j,
          groupMemberNumber:groupMemberNumber
        };
        swimlanes.push(swimlane);
      }
    }

    reference.height = 1;
    reference.acrossColumn = acrossColumnArray[0];
    reference.groupMemberNumber = groupMemberNumber;

    KanbanStore.setSwimlanes(swimlanes);
  };

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
    if(node.status==='todo:s'){
      KanbanStore.setStartColumnId(node.columnId);
    }else if(node.status==='done:s'){
      KanbanStore.setEndColumnId(node.columnId);
    }

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
    const columnIdTemp = PublicAuthKit.generateNoneDuplicateID(3);
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
      return false;
    }
    const targetColumnId = parentColumnIdArray[parentColumnIdArray.length-1];
    return array[targetColumnId];
  }
  deleteWholeTree=(node)=>{
    this.addDeletedItem(node,'column');
    for(let item of node.subColumn){
      this.deleteWholeTree(item);
    }
  };
  handleOnDeleteColumn=(columnId)=>{
    let columns = PublicAuthKit.deepCopy(KanbanStore.getColumns);
    this.generateColumnMap(columns);
    const targetColumn = this.columnMap[columnId];
    this.deleteWholeTree(targetColumn);
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
    /* 寻找最下面的泳道 */
    let swimlanes = KanbanStore.getSwimlanes;
    let maxNumber = -1;
    for(let item of swimlanes){
      if(item.position+item.height-1>maxNumber){
        maxNumber = item.position+item.height-1;
      }
    }
    if(kanbanInfo.kanbanHeight===1){
      message.error('无法继续减少列高');
      return;
    }
    if(kanbanInfo.kanbanHeight-1<=maxNumber){
      message.error('最下方存在泳道，无法删除');
      return;
    }
    kanbanInfo.kanbanHeight = kanbanInfo.kanbanHeight-1;
    KanbanStore.setKanbanInfo(kanbanInfo);
  };
  checkPositionSuccession(positionArray,result){
    for(let i=1;i<positionArray.length-1;i++){
      if((positionArray[i]-positionArray[i-1])!==(positionArray[i+1]-positionArray[i])||(positionArray[i]-positionArray[i-1])!==1){
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
    let flag = false;
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
      if(acrossColumnNumber===0||(acrossColumnNumber===1&&swimlane.columnPosition<acrossColumnPositionOfTdNextToBody[0])){
        this.handleOnDeleteSwimlane(swimlane.swimlaneId,true);
        swimlanes.splice(i,1);
        i -= 1;
      }else{
        let totalWidth = 0;
        for(let j=0;j<acrossColumnNumber;j++){
          totalWidth += this.theadTdNextToBody[acrossColumnPositionOfTdNextToBody[0]+j].columnWidth;
        }
        swimlane.width = totalWidth;
        if(swimlane.acrossColumn.split(',').length!==acrossColumn.length){
          flag = true;
        }
        swimlane.acrossColumn = acrossColumn.join(',');
        if(swimlane.columnPosition!==this.getColumnPositionYOfTdNextToBody(this.columnMap[acrossColumn[0]])){
          flag = true;
        }
        swimlane.columnPosition = this.getColumnPositionYOfTdNextToBody(this.columnMap[acrossColumn[0]]);
      }

    }
    if(flag){
      KanbanStore.setSwimlanes(swimlanes);
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
  confirmSubColumnContainsTargetStatus=(array,status)=>{
    for(let item of array){
      if(item.status===status){
        return true;
      }
    }
    return false;
  };
  initColumnStatusTool=(node,status)=>{
    node.status = status;
    if(status==='todo'){
      node.allowedEnd = false;
    }else if(status==='done'){
      node.allowedStart = false;
    }
    for(let item of node.subColumn){
      this.initColumnStatusTool(item,status);
    }
  };
  initColumnStatus=(columns)=>{
    this.generateColumnMap(columns);
    let startColumnId = KanbanStore.getStartColumnId;
    let endColumnId = KanbanStore.getEndColumnId;
    if(this.columnMap[startColumnId]==null){
      startColumnId = -1;
      KanbanStore.setStartColumnId(-1);
    }
    if(this.columnMap[endColumnId]==null){
      endColumnId = -1;
      KanbanStore.setEndColumnId(-1);
    }
    let column = null;
    let parentColumn = null;
    if(startColumnId!==-1){
      column = this.columnMap[startColumnId];
      this.initColumnStatusTool(column,'todo');
      column.status = 'todo:s';
      column.allowedEnd = true;
      parentColumn = this.getParentColumn(this.columnMap,column);
      while(parentColumn){
        // parentColumn = this.getParentColumn(this.columnMap,column);
        if(this.confirmSubColumnContainsTargetStatus(parentColumn.subColumn,'other')){
          parentColumn.status = 'other';
        }else if(parentColumn.subColumn.length>column.position+1){
          parentColumn.status = 'other';
        }else{
          parentColumn.status = 'todo';
        }
        for(let i=0;i<column.position;i++){
          this.initColumnStatusTool(parentColumn.subColumn[i],'todo');
        }
        column = parentColumn;
        parentColumn = this.getParentColumn(this.columnMap,parentColumn);
      }
      for(let i=0;i<column.position;i++){
        this.initColumnStatusTool(columns[i],'todo');
      }
    }

    if(endColumnId!==-1){
      column = this.columnMap[endColumnId];
      this.initColumnStatusTool(column,'done');
      column.status = 'done:s';
      column.allowedStart = true;
      parentColumn = this.getParentColumn(this.columnMap,column);
      while(parentColumn){
        if(this.confirmSubColumnContainsTargetStatus(parentColumn.subColumn,'other')){
          parentColumn.status = 'other';
        }else if(column.position>0){
          parentColumn.status = 'other';
        }else{
          parentColumn.status = 'done';
        }
        for(let i=column.position+1;i<parentColumn.subColumn.length;i++){
          this.initColumnStatusTool(parentColumn.subColumn[i],'done');
        }
        column = parentColumn;
        parentColumn = this.getParentColumn(this.columnMap,parentColumn);
      }
      for(let i=column.position+1;i<columns.length;i++){
        this.initColumnStatusTool(columns[i],'done');
      }
    }
  };
  getTopestParentColumn=(columnMap,column)=>{
    let columnParentId = column.parentId.split(',');
    if(columnParentId.length===1){
      return column;
    }
    return columnMap[columnParentId[1]];
  };
  clearOtherStartOrColumn=(columns,columnId,status)=>{
    for(let item of columns){
      this.clearOtherStartOrColumnTool(item,columnId,status);
    }
  };
  clearOtherStartOrColumnTool=(node,columnId,status)=>{
    if(node.status===status&&node.columnId!==columnId){
      node.status = 'doing';
    }
    for(let item of node.subColumn){
      this.clearOtherStartOrColumnTool(item,columnId,status);
    }
  };

  handleOnChangeRadio=(targetColumnId,value)=>{
    let originStartColumnId = KanbanStore.getStartColumnId;
    let originEndColumnId = KanbanStore.getEndColumnId;
    let columns = PublicAuthKit.deepCopy(KanbanStore.getColumns);
    this.generateColumnMap(columns);
    let targetColumn = this.columnMap[targetColumnId];
    if(value===2){
      if(originEndColumnId===targetColumnId){
        KanbanStore.setEndColumnId(-1);
      }
      targetColumn.status = 'todo:s';
      this.clearOtherStartOrColumn(columns,targetColumnId,'todo:s');
      KanbanStore.setStartColumnId(targetColumnId);
    }else if(value===3){
      if(originStartColumnId===targetColumnId){
        KanbanStore.setStartColumnId(-1);
      }
      targetColumn.status='done:s';
      this.clearOtherStartOrColumn(columns,targetColumnId,'done:s');
      KanbanStore.setEndColumnId(targetColumnId);
    }else{
      if(originStartColumnId===targetColumnId){
        KanbanStore.setStartColumnId(-1);
      }else if(originEndColumnId===targetColumnId){
        KanbanStore.setEndColumnId(-1);
      }
      targetColumn.status = 'doing';
    }
    KanbanStore.setColumns(columns);
  };
  handleOnSave=()=>{
    let startColumnId = KanbanStore.getStartColumnId;
    let endColumnId = KanbanStore.getEndColumnId;
    const columns = PublicAuthKit.deepCopy(KanbanStore.getColumns);
    this.generateColumnMap(columns);
    if(this.columnMap[startColumnId]==null){
      startColumnId = -1;
      KanbanStore.setStartColumnId(-1);
    }
    if(this.columnMap[endColumnId]==null){
      endColumnId = -1;
      KanbanStore.setEndColumnId(-1);
    }

    if(startColumnId!==-1&&endColumnId===-1){
      let startColumn = this.columnMap[startColumnId];
      let topestParentColumn = this.getTopestParentColumn(this.columnMap,startColumn);
      if(topestParentColumn.position!==columns.length-1){
        KanbanStore.setEndColumnId(columns[columns.length-1].columnId);
      }
    }else if(startColumnId===-1&&endColumnId!==-1){
      let endColumn = this.columnMap[endColumnId];
      let topestParentColumn = this.getTopestParentColumn(this.columnMap,endColumn);
      if(topestParentColumn.position!==0){
        KanbanStore.setStartColumnId(columns[0].columnId);
      }
    }else if(startColumnId===-1&&endColumnId===-1){
      if(columns.length>=2){
        KanbanStore.setStartColumnId(columns[0].columnId);
        KanbanStore.setEndColumnId(columns[columns.length-1].columnId);
      }else if(columns.length===1){
        KanbanStore.setEndColumnId(columns[0].columnId);
      }
    }
    for(let item of columns){
      this.initColumnStatusTool(item,'doing');
    }
    this.initColumnStatus(columns);
    let swimlanes = KanbanStore.getSwimlanes;
    let kanbanInfo = KanbanStore.getKanbanInfo;
    let resultColumns = [];
    for(let index in this.columnMap){
      resultColumns.push(this.columnMap[index]);
    }
    let kanbanData = {
      columns:resultColumns,
      swimlanes:PublicAuthKit.deepCopy(swimlanes),
      toBeDeletedColumn:this.toBeDeletedColumn,
      toBeDeletedSwimlane:this.toBeDeletedSwimlane,
      kanbanId:kanbanInfo.kanbanId,
      kanbanHeight:kanbanInfo.kanbanHeight
    };

    KanbanStore.setKanbanPageMaskLoadingStatus(true);
    KanbanStore.saveKanbanData(kanbanData).then(response=>{
      if(response){
        if(response.data==='success'){
          message.success('保存成功');
          this.toBeDeletedColumn = [];
          this.toBeDeletedSwimlane = [];
          KanbanStore.loadData(kanbanInfo.kanbanId);
        }else if(response.data==='failure'){
          KanbanStore.setKanbanPageMaskLoadingStatus(false);
          message.error('保存失败，请稍后再试！');
          KanbanStore.setColumns(columns);
        }
      }else{
        KanbanStore.setKanbanPageMaskLoadingStatus(false);
        message.error('网络错误，请稍后再试！');
        KanbanStore.setColumns(columns);
      }
    });

  };
  handleOnRenameColumn=(columnId,value)=>{
    const columns = PublicAuthKit.deepCopy(KanbanStore.getColumns);
    this.generateColumnMap(columns);
    let targetColumn = this.columnMap[columnId];
    targetColumn.columnName = value;
    KanbanStore.setColumns(columns);
  };
  handleOnRenameSwimlane=(swimlaneId,value)=>{
    const swimlanes = PublicAuthKit.deepCopy(KanbanStore.getSwimlanes);
    let reference = null;
    for(let item of swimlanes){
      if(item.swimlaneId===swimlaneId){
        reference = item;
      }
    }
    for(let item of swimlanes){
      if(item.groupId===reference.groupId){
        item.swimlaneName = value;
      }
    }
    KanbanStore.setSwimlanes(swimlanes);
  };



  render(){
    notification.config({
      placement: 'topRight',
    });

    const kanbanInfo = KanbanStore.getKanbanInfo;
    let columns = PublicAuthKit.deepCopy(KanbanStore.getColumns);

    /* 利用层级遍历生成树级结构 */
    let columnQueue = columns;
    let currentLayer = 1;
    let nodesNumberOfcurrentLayer = columnQueue.length;
    let nodesNumberOfNextLayer = 0;
    /* 设置tdNextToBody */
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
    /* 初始化列的status */
    this.initColumnStatus(columns);
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
            handleOnRenameColumn={this.handleOnRenameColumn}
            handleOnChangeRadio={this.handleOnChangeRadio}
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
    const swimlaneData = PublicAuthKit.deepCopy(KanbanStore.getSwimlanes);
    /* 计算泳道的宽度 */
    this.processSwimlane(swimlaneData);
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
        for(let k=0;k<swimlaneData.length;k++){
          let swimlaneTemp = swimlaneData[k];
          let temp = {
            columnId:swimlaneTemp.acrossColumn.split(',')[0]
          };
          let positionY = this.getColumnPositionYOfTdNextToBody(temp);
          if(positionY===-1){
            swimlaneData.splice(k,1);
            k = k-1;
            continue;
          }
          if(i===swimlaneTemp.position&&j===positionY){
            swimlane = (
              <Swimlane swimlane={swimlaneTemp}
                        showSwimlaneInfo={this.confirmShowSwimlaneInfo(swimlaneTemp.groupId)}
                        handleOnDeleteSwimlane={this.handleOnDeleteSwimlane}
                        handleOnJoinSwimlane={this.handleOnJoinSwimlane}
                        handleOnSplitSwimlane={this.handleOnSplitSwimlane}
                        handleOnRenameSwimlane={this.handleOnRenameSwimlane}
              />
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
        let borderBottomStyle = null;
        let borderTopStyle = null;
        if(i===tableHeight-1){
          borderBottomStyle = 'solid';
          if(beCoveredBySwimlane){
            borderTopStyle = 'solid';
          }else{
            borderTopStyle = 'dashed';
          }
        }else{
          if(beCoveredBySwimlane){
            borderTopStyle = 'solid';
            borderBottomStyle = 'solid';
          }else{
            borderTopStyle = 'dashed';
            borderBottomStyle = 'dashed';
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
            borderBottomStyle:borderBottomStyle,
            borderTopStyle: borderTopStyle
          }} key={j}>
            <EditKanbanTableBodyTd beCoveredBySwimlane={beCoveredBySwimlane} column={this.theadTdNextToBody[j]} dataX={i} dataY={j}/>
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
        <div id="kanban-edit-panel" style={{
          display: 'flex',
          justifyContent: 'flex-end',
          height: 32,
          zIndex:4,
          boxShadow: 'rgb(240, 241, 242) 0px 2px 8px',
          borderBottom: '1px solid #0000001a',
          alignItems: 'center'
        }}>
          <Icon type="plus-square-o" style={iconStyle}
                onClick={this.handleOnAddColumn.bind(this,null,true)}/>
          <Icon type="down" style={iconStyle}
                onClick={this.handleOnAddKanbanHeight}/>
          <Icon type="up" style={iconStyle}
                onClick={this.handleOnReduceKanbanHeight}/>
          <Icon type="edit" style={{...iconStyle,color:this.state.drawSwimlane?'blue':''}} onClick={()=>{
            if(!this.state.drawSwimlane){
              openNotification();
            }
            this.setState({
              drawSwimlane:!this.state.drawSwimlane
            });
          }}/>
          <Icon type="save" style={iconStyle} onClick={this.handleOnSave}/>

          <Icon type="arrow-left" style={{...iconStyle,position: 'absolute',left: 0}} onClick={()=>{
            this.props.history.push(`/kanban/${kanbanInfo.kanbanId}`);
          }}/>
        </div>
        <div id="kanban-content" style={{position:'relative',overflow:'auto',
          whiteSpace: 'nowrap'}}>
          <table>
            <thead>
              {tHead}
            </thead>
            <tbody>
              {tBody}
            </tbody>
          </table>

          {
            tHead==null||tHead.length===0?(
              <div style={{
                height:'100%',
                width:'100%',
                display:'flex',
                justifyContent:'center',
                alignItems:'center'
              }}>
                  <span style={{
                    color:'rgba(0,0,0,0.45)',
                    fontSize:'15px'
                  }}>暂无内容，请尝试添加一列
                    <Popover content={(<div>
                      toolbar上第一个按钮
                    </div>)}>
                      <Icon type="question-circle-o" style={{marginLeft:5,cursor:'pointer'}}/>
                    </Popover></span>
              </div>
            ):(null)
          }
        </div>
      </div>
    );
  }
}

export default withRouter(EditKanbanTable);
