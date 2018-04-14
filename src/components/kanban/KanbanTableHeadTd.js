import {Component} from 'react';
import {observer} from 'mobx-react';

// import kanbanPageStyles from '../../assets/css/kanbanPage.css';

@observer
class KanbanTableHeadTd extends Component{
  constructor(props){
    super(props);
    this.state={
      showRenameInput:false
    };
  }

  /* 根据渲染后外部td的实际高度设置当前div的高度 */
  resizeKanbanTableHeadTd=()=>{
    const rowSpan = this.props.rowSpan;
    const colSpan = this.props.colSpan;
    const colWidth = this.props.column.columnWidth;
    const td = this.refs.KanbanTableHeadTd;
    td.style.height = `${ rowSpan*52 - 2}px`;
    td.parentNode.style.maxWidth = `${colWidth*160 + colSpan-1}px`;
    td.parentNode.style.height = `${rowSpan*52}px`;

  };

  componentDidMount(){
    this.resizeKanbanTableHeadTd();
  }

  componentDidUpdate() {
    this.resizeKanbanTableHeadTd();
  }

  render(){
    return (
      <div style={{
        minWidth:160,
        minHeight:50,
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        position:'relative',
        background:'#fafafa78'
      }} ref="KanbanTableHeadTd">
        <span style={{
          maxWidth: '50%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          userSelect:'none'
        }} title={this.props.column.columnName}>{this.props.column.columnName}</span>
        {
          this.props.column.status==='todo:s'||this.props.column.status==='done:s'?(
            <div style={{
              position:'absolute',
              left: 0,
              top: 0
            }}>
            <span style={{
              fontSize:12
            }}>{this.props.column.status==='todo:s'?('Start'):('End')}</span>
            </div>
          ):(null)
        }
      </div>
    );
  }
}

export default KanbanTableHeadTd;
