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
      currentPage:1,
      showSearchUserPanel:'none',
      userForSearchPanel:[]
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

    /* 渲染用户数据start */
    const result = [];
    for(let item of allUserUnderProject){
      result.push(<UserItem key={item.id} user={item}/>);
    }
    /* 渲染用户数据end */
    /* 搜索用户面板相关start */
    const showSearchUserPanelDisplay = this.state.showSearchUserPanel;
    const showSearchUserPanelStyle = {
      background: '#fafafa',
      width: '100%',
      height: 50,
      position: 'absolute',
      top: 27,
      zIndex: 2,
      boxShadow: '#6666662e 4px 4px 10px',
      display:showSearchUserPanelDisplay
    };

    // const userForSearchPanel = this.state.userForSearchPanel;
    // for(let item of userForSearchPanel){
    //
    // }
    /* 搜索用户面板相关end */

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
          justifyContent: 'center',
          position:'relative',
        }}>
          <Input.Search
            placeholder="搜索用户"
            onSearch={value => console.log(value)}
            style={{ width: '100%' }}
            size='small'
            onChange={(event)=>{
              const value = event.target.value;
              if(value!==''){
                this.setState({
                  showSearchUserPanel:'flex'
                });
              }else{
                this.setState({
                  showSearchUserPanel:'none'
                });
              }
            }}
          />
          <div style={showSearchUserPanelStyle}>
            <div>
              <div>
                chazen996
              </div>
              <div>
                <Icon type="user-add" />
                <Icon type="user-delete" />
              </div>
            </div>
          </div>
        </div>
        {
          result.length!==0?(
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
                justifyContent: 'center',
                paddingTop:7,
                borderTop:'1px solid white'
              }}><Pagination simple current={currentPage} pageSize={pageSize} total={totalNumber} onChange={(page, pageSize)=>{
                this.setState({
                  currentPage:page
                });
              }} /></div>
            </div>
          ):(
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 408
            }}>
              <span style={{
                color: 'rgba(0, 0, 0, 0.2)',
                fontSize: 16
              }}>暂无内容</span>
            </div>
          )
        }

      </div>
    );
  }

}

export default UserList;
