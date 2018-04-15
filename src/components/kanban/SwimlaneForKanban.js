import {Component} from 'react';

class SwimlaneForKanban extends Component{
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
  };

  componentDidMount(){
    this.resizeEditKanbanTableHeadTd();
  }

  componentDidUpdate() {
    this.resizeEditKanbanTableHeadTd();
  }

  render(){
    // const divStyle = {
    //   fontSize:12,
    //   margin:'0 3px',
    //   height: 17,
    //   width: 17,
    //   transform: 'scale(0.9,0.9)',
    //   display:'flex',
    //   justifyContent:'center',
    //   alignItems:'center',
    //   cursor:'pointer',
    //   borderRadius: 27,
    //   border: '1px solid',
    //   userSelect:'none'
    // };
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
      <div>
        <div className={this.props.swimlane.groupId} style={{
          background: '#e6f7ff',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 2,
          // opacity: 0.4,
        }} ref='swimlane'>
        </div>
        {this.props.showSwimlaneInfo?(
          <span style={{
            position:'absolute',
            left:3,
            top:3,
            userSelect:'none',
            maxWidth: '50%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            zIndex: 4,
            color: 'rgb(0, 0, 0)',
            fontStyle: 'italic',
            fontWeight: 'bold',
          }} title={this.props.swimlane.swimlaneName}>{this.props.swimlane.swimlaneName}</span>
        ):(null)}
      </div>
    );
  }
}
export default SwimlaneForKanban;
