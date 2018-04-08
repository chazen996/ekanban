import {Component} from 'react';
import {observer} from 'mobx-react';
import {Pagination} from 'antd';
import ProjectStore from '../../stores/ProjectStore';
import Kanban from "./Kanban";

@observer
class KanbanList extends Component{
  constructor(props){
    super(props);

    this.state = {
      currentPage:1,
    };
  }
  render(){
    let kanbans = ProjectStore.getKanbans;
    /* 处理分页操作 start*/
    const totalNumber = kanbans.length;
    const pageSize = 4;
    const maxPageNumber = (parseInt(totalNumber/pageSize,10)+(Math.round(totalNumber%pageSize)!==0?1:0));
    const currentPage =  this.state.currentPage>maxPageNumber?maxPageNumber:this.state.currentPage;

    kanbans = kanbans.slice((currentPage-1)*pageSize,(currentPage*pageSize));
    const kanbanArray = [];
    /* 分页操作end */
    for(let item of kanbans){
      kanbanArray.push(<Kanban key={item.kanbanId} kanban={item}/>)
    }

    return (
      <div>
        {kanbanArray.length===0?(
          <div style={{
            height: 50,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: '#f5f5f5'
          }}>
            <span style={{
              color:'rgba(0,0,0,0.45)'
            }}>暂无内容</span>
          </div>
        ):(
          <div>
            <div style={{
              display:'flex',
              marginBottom:20
            }}>
              {kanbanArray}
            </div>
            <div style={{position:'relative',height:32}}>
              <Pagination style={{
                position:'absolute',
                right:0
              }} current={currentPage} pageSize={pageSize} total={totalNumber} onChange={(page, pageSize)=>{
                this.setState({
                  currentPage:page
                });
              }} />
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default KanbanList;
