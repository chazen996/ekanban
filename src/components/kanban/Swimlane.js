import {Component} from 'react';

class Swimlane extends Component{
  resizeEditKanbanTableHeadTd=()=>{
    const swimlaneWidth = this.props.swimlane.width;
    const swimlaneHeight = this.props.swimlane.height;
    const swimlaneDiv = this.refs.swimlane;
    swimlaneDiv.style.height = `${ swimlaneHeight*101 - 1}px`;
    swimlaneDiv.style.width = `${swimlaneWidth*161 - 1}px`;
  };

  componentDidMount(){
    this.resizeEditKanbanTableHeadTd();
  }

  componentDidUpdate() {
    this.resizeEditKanbanTableHeadTd();
  }
  render(){

    return (
      <div style={{
        background: '#e6f7ff',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 2,
        opacity: 0.4
      }} ref='swimlane'>

      </div>
    );
  }
}

export default Swimlane;
