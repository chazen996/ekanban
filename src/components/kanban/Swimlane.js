import {Component} from 'react';
import {Input} from 'antd';

class Swimlane extends Component{
  constructor(props){
    super(props);
    this.state={
      showRenameInput:false
    };
  }

  resizeEditKanbanTableHeadTd=()=>{
    const swimlaneWidth = this.props.swimlane.width;
    const swimlaneHeight = this.props.swimlane.height;
    const swimlaneDiv = this.refs.swimlane;
    const acrossColumnNumber = this.props.swimlane.acrossColumn.split(',').length;
    swimlaneDiv.style.width = `${swimlaneWidth*160 + acrossColumnNumber-1}px`;
    swimlaneDiv.style.height = `${ swimlaneHeight*101 - 1}px`;

    /* 其在出现时获得焦点 */
    if(this.refs.renameInput){
      this.refs.renameInput.focus();
    }
  };

  componentDidMount(){
    this.resizeEditKanbanTableHeadTd();
  }

  componentDidUpdate() {
    this.resizeEditKanbanTableHeadTd();
  }

  handleOnDeleteSwimlane=(groupId)=>{
    this.props.handleOnDeleteSwimlane(groupId);
  };
  handleOnJoinSwimlane=(targetSwimlaneId,groupId)=>{
    this.props.handleOnJoinSwimlane(targetSwimlaneId,groupId);
  };
  handleOnSplitSwimlane=(targetSwimlaneId)=>{
    this.props.handleOnSplitSwimlane(targetSwimlaneId);
  };
  handleOnRenameSwimlane=(swimlaneId)=>{
    this.setState({
      showRenameInput:false
    });
    let targetInput = document.getElementById(`${this.props.swimlane.swimlaneId}-input`);
    this.props.handleOnRenameSwimlane(swimlaneId,targetInput.value);
  };
  render(){
    const divStyle = {
      fontSize:12,
      margin:'0 3px',
      height: 17,
      width: 17,
      transform: 'scale(0.9,0.9)',
      display:'flex',
      justifyContent:'center',
      alignItems:'center',
      cursor:'pointer',
      borderRadius: 27,
      border: '1px solid',
      userSelect:'none'
    };
    const optionable = {
      splitable:false,
      joinable:false
    };

    if(this.props.swimlane.groupMemberNumber>1){
      optionable.splitable = false;
      optionable.joinable = true;
    }else if(this.props.swimlane.width>1||this.props.swimlane.height>1){
      optionable.splitable = true;
      optionable.joinable = false;
    }
    return (
      <div className={this.props.swimlane.groupId} style={{
        background: '#e6f7ff',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 2,
        // opacity: 0.4,
      }} ref='swimlane'>
        {this.props.showSwimlaneInfo?(
          <div>
            <div style={{
              display:'flex',
              marginTop: 2
            }}>
              <div style={{...divStyle,color:'red'}} onClick={this.handleOnDeleteSwimlane.bind(this,this.props.swimlane.groupId)}>
                <span>删</span>
              </div>
              {
                optionable.joinable?(
                  <div style={{...divStyle,color:'#096dd9',cursor:'pointer'}} onMouseDown={this.test} onClick={this.handleOnJoinSwimlane.bind(this,this.props.swimlane.swimlaneId,this.props.swimlane.groupId)}>
                    <span>合</span>
                  </div>
                ):(
                  <div style={{...divStyle,color:'rgba(0,0,0,0.45)',cursor:'not-allowed'}}>
                    <span>合</span>
                  </div>
                )
              }
              {
                optionable.splitable?(
                  <div style={{...divStyle,color:'#096dd9',cursor:'pointer'}} onClick={this.handleOnSplitSwimlane.bind(this,this.props.swimlane.swimlaneId)}>
                    <span>拆</span>
                  </div>
                ):(
                  <div style={{...divStyle,color:'rgba(0,0,0,0.45)',cursor:'not-allowed'}}>
                    <span>拆</span>
                  </div>
                )
              }
            </div>
            <span style={{
              position:'absolute',
              left:3,
              top:17,
              userSelect:'none',
              maxWidth: '50%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }} onDoubleClick={()=>{
              this.setState({
                showRenameInput:true
              });
            }} title={this.props.swimlane.swimlaneName}>{this.props.swimlane.swimlaneName}</span>
            <Input id={`${this.props.swimlane.swimlaneId}-input`} style={{
              position:'absolute',
              width:'60%',
              top:17,
              left:3,
              height:20,
              display:this.state.showRenameInput?'':'none'
            }} size='small' placeholder={this.props.swimlane.swimlaneName} onBlur={this.handleOnRenameSwimlane.bind(this,this.props.swimlane.swimlaneId)} ref='renameInput'/>
          </div>
        ):(null)}

      </div>
    );
  }
}

export default Swimlane;
