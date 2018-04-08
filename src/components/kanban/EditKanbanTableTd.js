import {Component} from 'react';
// import kanbanPageStyles from '../../assets/css/kanbanPage.css';

class EditKanbanTableTd extends Component{
  componentDidMount() {
    const td = this.refs.editKanbanTableTd;
    td.style.height = `${td.parentNode.offsetHeight -2}px`;
  }
  render(){
    return (
      <div style={{
        minWidth:200,
        minHeight:100,
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        position:'relative',
        background:'lightskyblue'
      }} ref="editKanbanTableTd">
        <span>测试列名</span>
      </div>
    );
  }
}

export default EditKanbanTableTd;
