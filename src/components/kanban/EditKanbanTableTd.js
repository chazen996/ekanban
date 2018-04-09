import {Component} from 'react';
import {Icon,Radio} from 'antd';
import KanbanStore from '../../stores/KanbanStore';
import {observer} from 'mobx-react';

// import kanbanPageStyles from '../../assets/css/kanbanPage.css';

@observer
class EditKanbanTableTd extends Component{
  constructor(props){
    super(props);

    this.state = {
      radioValue: 1,
    };

  }

  /* 根据渲染后外部td的实际高度设置当前div的高度 */
  resizeEditKanbanTableTd=()=>{
    const rowSpan = this.props.rowSpan;
    const td = this.refs.editKanbanTableTd;
    td.style.height = `${ rowSpan*52 - 2}px`;
  };

  componentDidMount(){
    this.resizeEditKanbanTableTd();
  }

  componentDidUpdate() {
    this.resizeEditKanbanTableTd();
  }
  handleOnChangeRadio=(event)=>{
    this.setState({
      radioValue: event.target.value,
    });
  };
  handleOnAddSubColumn=(columnId)=>{
    this.props.handleOnAddSubColumn(columnId);
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
      alignItems: 'center'
    };

    return (
      <div style={{
        minWidth:160,
        minHeight:50,
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        position:'relative',
        background:'#fafafa78'
      }} ref="editKanbanTableTd">
        <span>{this.props.column.columnName}</span>
        <Icon type="close" style={{
          position:'absolute',
          top:0,
          right:0,
          cursor:'pointer'
        }}/>
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
            }} onClick={this.handleOnAddSubColumn.bind(this,this.props.column.columnId)}/>
          </div>
          <div style={{
            position:'absolute',
            right:0
          }}>
            {this.props.nextToTbody?(
              <Icon type="left" style={{
                cursor:'pointer'
              }}/>
            ):(null)}
            {this.props.nextToTbody?(
              <Icon type="right" style={{cursor:'pointer'}}/>
            ):(<Icon type="right" style={{cursor:'not-allowed'}}/>)}
          </div>
        </div>
        <div style={columnSettingPanelStyle}>
          <Radio.Group value={this.state.radioValue} onChange={this.handleOnChangeRadio}>
            <Radio style={radioStyle} value={1}>普通列</Radio>
            <Radio style={radioStyle} value={2}>起始列</Radio>
            <Radio style={radioStyle} value={3}>终止列</Radio>
          </Radio.Group>
        </div>
      </div>
    );
  }
}

export default EditKanbanTableTd;
