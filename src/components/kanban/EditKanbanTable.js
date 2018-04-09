import {Component} from 'react';
// import kanbanPageStyles from '../../assets/css/kanbanPage.css';
import {Button} from 'antd';
import EditKanbanTableTd from './EditKanbanTableTd';
import KanbanStore from '../../stores/KanbanStore';
import {observer} from 'mobx-react';
import PublicAuthKit from '../../utils/PublicAuthKit';

@observer
class EditKanbanTable extends Component{
  constructor(props){
    super(props);

    this.columnMap = [];

  }

  componentDidMount() {

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

  createTr(tdList,key){
    return (
      <tr key={key}>
        {tdList}
      </tr>
    );
  }

  handleOnAddSubColumn=(columnId)=>{
    const kanbanInfo = KanbanStore.getKanbanInfo;
    let columns = PublicAuthKit.deepCopy(KanbanStore.getColumns);
    this.generateColumnMap(columns);
    const targetColumn = this.columnMap[columnId];

    const column = {};
    const columnIdTemp = `temp:${PublicAuthKit.generateNoneDuplicateID(3)}`;
    column['columnName'] = '未命名列名';
    column['columnId'] = columnIdTemp;
    column['columnWidth'] = 1;
    column['parentId'] = `${targetColumn.parentId},${targetColumn.columnId}`;
    column['kanbanId'] = kanbanInfo.kanbanId;
    column['position'] = targetColumn.subColumn.length;
    column['subColumn'] = [];

    targetColumn.subColumn.splice(targetColumn.subColumn.length,1,column);

    KanbanStore.setColumns(columns);
  };
  render(){
    let columns = PublicAuthKit.deepCopy(KanbanStore.getColumns);

    /* 利用层级遍历生成树级结构 */
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

    /* 第二遍遍历生成表头数据 */
    const treeHeight = currentLayer;
    columnQueue = columns;
    let tdList = [];
    let trList = [];
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
          <EditKanbanTableTd
            column={column} colSpan={colSpan} rowSpan={rowSpan}
            nextToTbody={column.subColumn===null||column.subColumn.length===0}
            handleOnAddSubColumn={this.handleOnAddSubColumn}
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

    return (
      <div>
        <Button onClick={()=>{
          let columns = PublicAuthKit.deepCopy(KanbanStore.getColumns);
          this.generateColumnMap(columns);
          this.columnMap['1'].columnName="测试一下。希望成功";
          KanbanStore.setColumns(columns);
        }}>
          测试一下
        </Button>
        <table>
          <thead>
            {trList}
          </thead>
          <tbody>

          </tbody>
        </table>
      </div>
    );
  }
}

export default EditKanbanTable;
