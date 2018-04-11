import {Component} from 'react';

class Swimlane extends Component{
  resizeEditKanbanTableHeadTd=()=>{
    const swimlaneWidth = this.props.swimlane.width;
    const swimlaneHeight = this.props.swimlane.height;
    const swimlaneDiv = this.refs.swimlane;
    const acrossColumnNumber = this.props.swimlane.acrossColumn.split(',').length;
    swimlaneDiv.style.width = `${swimlaneWidth*160 + acrossColumnNumber-1}px`;
    // if(swimlaneWidth===1){
    //   swimlaneDiv.style.width = `${swimlaneWidth*160}px`;
    // }else{
    //   swimlaneDiv.style.width = `${swimlaneWidth*161-1}px`;
    // }
    swimlaneDiv.style.height = `${ swimlaneHeight*101 - 1}px`;
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
                  <div style={{...divStyle,color:'#096dd9',cursor:'pointer'}} onClick={this.handleOnJoinSwimlane.bind(this,this.props.swimlane.swimlaneId,this.props.swimlane.groupId)}>
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
              userSelect:'none'
            }}>{this.props.swimlane.swimlaneName}</span>
          </div>
        ):(null)}

      </div>
    );
  }
}

export default Swimlane;
