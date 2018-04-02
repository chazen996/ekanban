import {Component} from 'react';
import {Input,Icon,Pagination} from 'antd';
import {observer} from 'mobx-react';
import Config from "../../utils/Config";
import projectPageStyles from '../../assets/css/projectPage.css';
import PublicAuthKit from '../../utils/PublicAuthKit';
import ProjectStore from "../../stores/ProjectStore";
import UserItem from "./UserItem";

@observer
class UserList extends Component{
  constructor(props){
    super(props);

    this.state = {
      currentPage:1
    };
  }

  componentDidMount(){
    ProjectStore.loadData(26);
  }

  render(){
    let allUserUnderProject = ProjectStore.getAllUserUnderProject;
    /* 过滤掉自身 */
    for(let i=0;i<allUserUnderProject.length;i++){
      if(allUserUnderProject[i].username===PublicAuthKit.getItem('username')){
        allUserUnderProject.splice(i,1);
        break;
      }
    }

    /* 分页操作start */
    const totalNumber = allUserUnderProject.length;
    const pageSize = 7;
    const maxPageNumber = (parseInt(totalNumber/pageSize,10)+(Math.round(totalNumber%pageSize)!==0?1:0));
    const currentPage =  this.state.currentPage>maxPageNumber?maxPageNumber:this.state.currentPage;

    allUserUnderProject = allUserUnderProject.slice((currentPage-1)*pageSize,(currentPage*pageSize));
    /* 分页操作end */
    const result = [];
    for(let item of allUserUnderProject){
      result.push(<UserItem user={item}/>);
    }

    return (
      <div style={{width: 270,height: 480,background: '#3333'}}>
        <div style={{
          height:44,
          borderBottom:'1px solid white',
          display:'flex',
          alignItems:'center',
          position:'relative'
        }}>
          <img className={projectPageStyles["own-avatar"]} src={`${Config.baseURL}/images/${PublicAuthKit.getItem('username')}.jpg` } alt='avatar' />
          <span style={{margin: '0 auto',fontSize: 16,fontWeight: 'bolder'}}>用户列表</span>
          <Icon type="menu-fold" style={{
            position: 'absolute',
            right: 10,
            fontSize: 15,
            cursor:'pointer'
          }} />
        </div>
        <div style={{
          height:28,
          borderBottom:'1px solid white',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <Input.Search
            placeholder="搜索用户"
            onSearch={value => console.log(value)}
            style={{ width: '100%' }}
            size='small'
          />
        </div>
        <div style={{
          height:408,
          borderBottom:'1px solid white',
          position:'relative'
        }}>
          <div>
            {result}
          </div>
          <div style={{
            position: 'absolute',
            bottom: 5,
            width: '100%',
            display: 'flex',
            justifyContent: 'center'
          }}><Pagination simple current={currentPage} pageSize={pageSize} total={totalNumber} onChange={(page, pageSize)=>{
            this.setState({
              currentPage:page
            });
          }} /></div>
        </div>
      </div>
    );
  }

}

export default UserList;
