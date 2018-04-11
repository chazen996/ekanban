import {Component} from 'react';
import {Icon,Radio} from 'antd';
import KanbanStore from '../../stores/KanbanStore';
import {observer} from 'mobx-react';

// import kanbanPageStyles from '../../assets/css/kanbanPage.css';

@observer
class EditKanbanTableHeadTd extends Component{
  // constructor(props){
  //   super(props);
  // }

  /* 根据渲染后外部td的实际高度设置当前div的高度 */
  resizeEditKanbanTableHeadTd=()=>{
    const rowSpan = this.props.rowSpan;
    const td = this.refs.EditKanbanTableHeadTd;
    td.style.height = `${ rowSpan*52 - 2}px`;
    td.parentNode.style.height = `${rowSpan*52}px`;
  };

  componentDidMount(){
    this.resizeEditKanbanTableHeadTd();
  }

  componentDidUpdate() {
    this.resizeEditKanbanTableHeadTd();
  }
  handleOnChangeRadio=(event)=>{
    if(event.target.value===2){
      if(this.props.column.columnId===KanbanStore.getEndColumnId){
        KanbanStore.setEndColumnId(-1);
      }
      KanbanStore.setStartColumnId(this.props.column.columnId);
    }else if(event.target.value===3){
      if(this.props.column.columnId===KanbanStore.getStartColumnId){
        KanbanStore.setStartColumnId(-1);
      }
      KanbanStore.setEndColumnId(this.props.column.columnId);
    }else{
      if(this.props.column.columnId===KanbanStore.getStartColumnId){
        KanbanStore.setStartColumnId(-1);
      }else if(this.props.column.columnId===KanbanStore.getEndColumnId){
        KanbanStore.setEndColumnId(-1);
      }
    }
  };
  handleOnAddColumn=(columnId)=>{
    this.props.handleOnAddColumn(columnId);
  };
  handleOnDeleteColumn=(columnId)=>{
    this.props.handleOnDeleteColumn(columnId);
  };
  handleOnExtendColumn=(columnId)=>{
    this.props.handleOnExtendColumn(columnId);
  };
  handleOnShrinkColumn=(columnId)=>{
    this.props.handleOnShrinkColumn(columnId);
  };
  render(){

    const openedColumnSettingPanelId = KanbanStore.getOpenedColumnSettingPanelId;
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
      color:'white'
    };
    const columnSettingPanelStyle = {
      height:100,
      position: 'absolute',
      top: 'calc(100%)',
      width: 160,
      background: '#000',
      opacity: 0.8,
      left:-1,
      boxShadow:'rgba(0, 0, 0) 1px 2px 6px',
      display: openedColumnSettingPanelId===this.props.column.columnId?('flex'):('none'),
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2
    };
    let radioValue = null;
    const startColumnId = KanbanStore.getStartColumnId;
    const endColumnId = KanbanStore.getEndColumnId;
    if(startColumnId===this.props.column.columnId){
      radioValue = 2;
    }else if(endColumnId===this.props.column.columnId){
      radioValue = 3;
    }else{
      radioValue = 1;
    }

    return (
      <div style={{
        minWidth:160,
        minHeight:50,
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        position:'relative',
        background:'#fafafa78'
      }} ref="EditKanbanTableHeadTd">
        <span>{`${this.props.column.columnName},${this.props.column.status}`}</span>
        {
          radioValue===2||radioValue===3?(
            <div style={{
              position:'absolute',
              left: 0,
              top: 0
            }}>
            <span style={{
              fontSize:12
            }}>{radioValue===2?('Start'):('End')}</span>
            </div>
          ):(null)
        }
        <Icon type="close" style={{
          position:'absolute',
          top:0,
          right:0,
          cursor:'pointer'
        }} onClick={this.handleOnDeleteColumn.bind(this,this.props.column.columnId)}/>
        <div style={{
          position:'absolute',
          bottom:0,
          display:'flex',
          justifyContent:'center',
          width:'100%'
        }}>
          <div style={{
            position:'absolute',
            left:0
          }}>
            <Icon type="setting" style={{
              cursor:'pointer',
            }} onClick={()=>{
              if(openedColumnSettingPanelId===-1){
                KanbanStore.setOpenedColumnSettingPanelId(this.props.column.columnId);
              }else if(openedColumnSettingPanelId!==this.props.column.columnId){
                KanbanStore.setOpenedColumnSettingPanelId(this.props.column.columnId);
              }else{
                KanbanStore.setOpenedColumnSettingPanelId(-1);
              }
            }}/>
          </div>
          <div>
            <Icon type="plus" style={{
              cursor:'pointer'
            }} onClick={this.handleOnAddColumn.bind(this,this.props.column.columnId)}/>
          </div>
          <div style={{
            position:'absolute',
            right:0
          }}>
            {this.props.nextToTbody&&this.props.column.columnWidth>1?(
              <Icon type="left" style={{
                cursor:'pointer'
              }} onClick={this.handleOnShrinkColumn.bind(this,this.props.column.columnId)}/>
            ):(null)}
            {this.props.nextToTbody?(
              <Icon type="right" style={{cursor:'pointer'}} onClick={this.handleOnExtendColumn.bind(this,this.props.column.columnId)}/>
            ):(<Icon type="right" style={{cursor:'not-allowed'}}/>)}
          </div>
        </div>
        <div style={columnSettingPanelStyle}>
          <Radio.Group value={radioValue} onChange={this.handleOnChangeRadio}>
            <Radio style={radioStyle} value={1}>普通列</Radio>
            <Radio style={radioStyle} value={2}>起始列</Radio>
            <Radio style={radioStyle} value={3}>终止列</Radio>
          </Radio.Group>
        </div>
      </div>
    );
  }
}

export default EditKanbanTableHeadTd;
