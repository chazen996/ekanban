import {Component} from 'react';
import {Icon,Radio,Input} from 'antd';
import KanbanStore from '../../stores/KanbanStore';
import {observer} from 'mobx-react';

// import kanbanPageStyles from '../../assets/css/kanbanPage.css';

@observer
class EditKanbanTableHeadTd extends Component{
  constructor(props){
    super(props);
    this.state={
      showRenameInput:false
    };
  }

  /* 根据渲染后外部td的实际高度设置当前div的高度 */
  resizeEditKanbanTableHeadTd=()=>{
    const rowSpan = this.props.rowSpan;
    const colSpan = this.props.colSpan;
    const colWidth = this.props.column.columnWidth;
    const td = this.refs.EditKanbanTableHeadTd;
    td.style.height = `${ rowSpan*52 - 2}px`;
    td.parentNode.style.maxWidth = `${colWidth*160 + colSpan-1}px`;
    td.parentNode.style.height = `${rowSpan*52}px`;

    /* 其在出现时获得焦点 */
    this.refs.renameInput.focus();
    this.refs.columnSettingPanel.focus();
  };

  componentDidMount(){
    this.resizeEditKanbanTableHeadTd();
  }

  componentDidUpdate() {
    this.resizeEditKanbanTableHeadTd();
  }
  handleOnChangeRadio=(event)=>{
    this.props.handleOnChangeRadio(this.props.column.columnId,event.target.value);
    // if(event.target.value===2){
    //   if(this.props.column.columnId===KanbanStore.getEndColumnId){
    //     KanbanStore.setEndColumnId(-1);
    //   }
    //   KanbanStore.setStartColumnId(this.props.column.columnId);
    //   let columns = PublicAuthKit.deepCopy(KanbanStore.getColumns);
    //
    // }else if(event.target.value===3){
    //   if(this.props.column.columnId===KanbanStore.getStartColumnId){
    //     KanbanStore.setStartColumnId(-1);
    //   }
    //   KanbanStore.setEndColumnId(this.props.column.columnId);
    // }else{
    //   if(this.props.column.columnId===KanbanStore.getStartColumnId){
    //     KanbanStore.setStartColumnId(-1);
    //   }else if(this.props.column.columnId===KanbanStore.getEndColumnId){
    //     KanbanStore.setEndColumnId(-1);
    //   }
    // }
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
  handleOnRenameColumn=(columnId)=>{
    this.setState({
      showRenameInput:false
    });
    let targetInput = document.getElementById(`${this.props.column.columnId}-input`);
    this.props.handleOnRenameColumn(columnId,targetInput.value);
  };
  render(){

    const openedColumnSettingPanelId = KanbanStore.getOpenedColumnSettingPanelId;
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
      // color:'white'
    };
    const columnSettingPanelStyle = {
      height:100,
      position: 'absolute',
      top: 'calc(100%)',
      width: 160,
      background: '#f5f5f5',
      // opacity: 0.8,
      left:-1,
      boxShadow:'rgb(0, 0, 0) 1px 2px 6px',
      display: openedColumnSettingPanelId===this.props.column.columnId?('flex'):('none'),
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 3
    };
    let radioValue = null;
    // const startColumnId = KanbanStore.getStartColumnId;
    // const endColumnId = KanbanStore.getEndColumnId;
    // if(startColumnId===this.props.column.columnId){
    //   radioValue = 2;
    // }else if(endColumnId===this.props.column.columnId){
    //   radioValue = 3;
    // }else{
    //   radioValue = 1;
    // }
    let status = this.props.column.status;
    if(status==='todo:s'){
      radioValue = 2;
    }else if(status==='done:s'){
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
        <span style={{
          maxWidth: '50%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          userSelect:'none'
        }} onDoubleClick={()=>{
          this.setState({
            showRenameInput:true
          });
        }} title={this.props.column.columnName}>{this.props.column.columnName}</span>
        <Input id={`${this.props.column.columnId}-input`} style={{
          position:'absolute',
          width:'60%',
          height:20,
          display:this.state.showRenameInput?'':'none'
        }} size='small' placeholder={this.props.column.columnName} onBlur={this.handleOnRenameColumn.bind(this,this.props.column.columnId)} ref='renameInput'/>
        <div style={{
          position:'absolute',
          left: 0,
          top: 0
        }}>
          {
            radioValue===2?(
              <span style={{
                fontSize:12,
                background: 'orange',
                color: 'white',
                borderRadius: 5,
                padding: '0 3px'
              }}>Start</span>
            ):(null)
          }
          {
            radioValue===3?(
              <span style={{
                fontSize:12,
                background: '#52c41a',
                color: 'white',
                borderRadius: 5,
                padding: '0 3px'
              }}>End</span>
            ):(null)
          }
        </div>

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
            }} onMouseDown={(event)=>{
              event.preventDefault();
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
        <div style={columnSettingPanelStyle} tabIndex="-1" onBlur={()=>{
          KanbanStore.setOpenedColumnSettingPanelId(-1);
        }} ref='columnSettingPanel'>
          <Radio.Group value={radioValue} onChange={this.handleOnChangeRadio}>
            <Radio style={radioStyle} value={1}>普通列</Radio>
            <Radio style={radioStyle} disabled={!(this.props.column.allowedStart||this.props.column.allowedStart==null)} value={2}>起始列</Radio>
            <Radio style={radioStyle} disabled={!(this.props.column.allowedEnd||this.props.column.allowedEnd==null)} value={3}>终止列</Radio>
          </Radio.Group>
        </div>
      </div>
    );
  }
}

export default EditKanbanTableHeadTd;
