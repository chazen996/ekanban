import {Component} from 'react';
// import kanbanPageStyles from '../../assets/css/kanbanPage.css';
import EditKanbanTableTd from './EditKanbanTableTd';

class EditKanbanTable extends Component{
  render(){
    return (
      <div>
        <table>
          <thead>
            <tr>
              <td colSpan={2}>
                <EditKanbanTableTd/>
              </td>
              <td rowSpan={2}>
                <EditKanbanTableTd/>
              </td>
            </tr>
            <tr>
              <td>
                <EditKanbanTableTd/>
              </td>
              <td>
                <EditKanbanTableTd/>
              </td>
            </tr>
          </thead>
          <tbody>

          </tbody>
        </table>
      </div>
    );
  }
}

export default EditKanbanTable;
