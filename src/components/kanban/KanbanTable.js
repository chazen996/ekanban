import {Component} from 'react';
import {Icon} from 'antd';
import KanbanStore from '../../stores/KanbanStore';
import {observer} from 'mobx-react';
import PublicAuthKit from "../../utils/PublicAuthKit";
import KanbanTableHeadTd from "./KanbanTableHeadTd";
import StagingArea from "./StagingArea";

@observer
class KanbanTable extends Component{
  constructor(props){
    super(props);
    this.columnMap = [];
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
  render(){
    const showStagingArea = KanbanStore.getShowStagingArea;
    let columns = PublicAuthKit.deepCopy(KanbanStore.getColumns);

    let columnQueue = columns;
    let currentLayer = 1;
    let nodesNumberOfcurrentLayer = columnQueue.length;
    let nodesNumberOfNextLayer = 0;

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
            KanbanStore.setShowStagingArea(!showStagingArea);
            // const kanbanContent = document.querySelector("#kanban-content");
            // const stagingArea = document.querySelector("#staging-area");
            //
            // kanbanContent.style.width = `${window.innerWidth - stagingArea.offsetWidth}px`;
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

            </tbody>
          </table>
        </div>
      </div>
    );
  }

}

export default KanbanTable;
