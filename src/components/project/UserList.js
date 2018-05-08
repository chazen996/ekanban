import {Component} from 'react';
import {Input,Icon,Pagination,message,Modal,Popover} from 'antd';
import {observer} from 'mobx-react';
import {withRouter} from 'react-router-dom';
import Config from "../../utils/Config";
import projectPageStyles from '../../assets/css/projectPage.css';
import PublicAuthKit from '../../utils/PublicAuthKit';
import ProjectStore from "../../stores/ProjectStore";
import UserItem from "./UserItem";
import UserItemForSearchPanel from "./UserItemForSearchPanel";

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

  handleOnRemoveUser=(userId)=>{
    /* 获取projectId */
    const projectId = this.props.match.params.projectId;
    ProjectStore.removeUserFromProject(projectId,userId).then(response=>{
      if(response){
        if(response.data==="success"){
          message.success('移除用户成功！');
          ProjectStore.loadData(projectId);
        }else if(response.data==="failure"){
          message.error('移除用户失败，请稍后再试！');
        }
      }else{
        message.error('网络错误，请稍后再试！');
      }
    });
  }

  handleOnExitProjectGroup = (userId)=>{
    const projectId = this.props.match.params.projectId;
    Modal.confirm({
      title: '确定退出当前项目组?',
      content: '退出当前项目组后，无法查看项目下的任何信息，请谨慎操作!',
      onOk() {
        const projectInfo = ProjectStore.getProjectInfo;
        if(userId===projectInfo.createdBy){
          message.error('您当前为项目所有者，请先尝试转移控制权!');
        }else{
          ProjectStore.removeUserFromProject(projectId,userId).then(response=>{
            if(response){
              if(response.data==='success'){
                message.success('退出当前项目组成功');
                setTimeout(window.location.href="/home",1500);
              }else if(response.data==='failure'){
                message.error('操作失败，请稍后再试!');
              }
              /*****/
              // else if(response.data==='only-one-user'){
              //   ProjectStore.getAllUserUnderProjectFromWebServer(projectId,PublicAuthKit.getItem('username')).then(response=>{
              //     if(response){
              //       if(response.data.length===1){
              //         if(response.data[0].username===PublicAuthKit.getItem('username')){
              //           message.error('当前项目组下无其他成员，暂时无法退出！');
              //         }else{
              //           message.error('网络错误，请稍后再试！');
              //           setTimeout(window.location.reload(),1500);
              //         }
              //       }else{
              //         message.error('网络错误，请稍后再试！');
              //         setTimeout(window.location.reload(),1500);
              //       }
              //     }else{
              //       message.error('网络错误，请稍后再试！');
              //     }
              //   })
              // }
              /*****/


            }else{
              message.error('网络错误，请稍后再试！');
            }
          });
        }
      },
      onCancel() {},
      okText:'确定',
      cancelText:'取消'
    });
  }

  handleOnChangeControlRight=(userId)=>{
    const projectId = this.props.match.params.projectId;
    ProjectStore.changeProjectControlRight(projectId,userId).then(response=>{
      if(response){
        if(response.data==='success'){
          message.success('转让控制权成功！');
          ProjectStore.loadData(projectId);
        }else if(response.data==='failure'){
          message.error('转让失败，请稍后再试！');
        }
      }else{
        message.error('网络错误，请稍后再试！');
      }
    });
  };

  render(){
    const projectInfo = ProjectStore.projectInfo;
    const userInfo = ProjectStore.getUserInfo;
    let allUserUnderProject = PublicAuthKit.deepCopy(ProjectStore.getAllUserUnderProject);
    /* 自身数据不应显示在列表当中 */
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
      result.push(<UserItem key={item.id} user={item} handleOnRemoveUser={this.handleOnRemoveUser} handleOnChangeControlRight={this.handleOnChangeControlRight}/>);
    }
    /* 渲染用户数据end */
    /* 搜索用户面板相关start */
    const showSearchUserPanelDisplay = this.state.showSearchUserPanel;
    const showSearchUserPanelStyle = {
      background: '#fafafa',
      width: '100%',
      position: 'absolute',
      top: 27,
      zIndex: 2,
      boxShadow: '#6666662e 4px 4px 10px',
      display:showSearchUserPanelDisplay,
      flexDirection:'column'
    };

    let userForSearchPanel = this.state.userForSearchPanel;
    /* 当前登陆用户不应显示在搜索框中 */
    for(let i=0;i<userForSearchPanel.length;i++){
      if(userForSearchPanel[i].username===PublicAuthKit.getItem('username')){
        userForSearchPanel.splice(i,1);
      }
    }
    userForSearchPanel = userForSearchPanel.slice(0,5);
    const userForSearchPanelArray = [];
    for(let item of userForSearchPanel){
      userForSearchPanelArray.push(<UserItemForSearchPanel key={item.id} user={item} handleOnRemoveUser={this.handleOnRemoveUser} handleOnChangeControlRight={this.handleOnChangeControlRight}/>);
    }
    /* 搜索用户面板相关end */

    return (
      <div style={{width: 270,height: 'calc(100% - 29px)',background: '#3333',border: '2px solid #e8e8e8',boxSizing: 'content-box',display: 'inline-block',verticalAlign: 'top',marginTop: 43}}>
        <div style={{
          height:44,
          borderBottom:'1px solid white',
          display:'flex',
          alignItems:'center',
          position:'relative'
        }}>
          <img className={projectPageStyles["own-avatar"]} src={`${Config.baseURL}/images/${PublicAuthKit.getItem('username')}.jpg` } alt='avatar' />
          {projectInfo.createdBy===userInfo.id?(
            <span style={{
              fontSize: 12,
              color: '#ff6000',
              border: '1px solid',
              borderRadius: 3,
              marginLeft: 43,
              position:'absolute'
            }}>组长</span>
          ):(null)}
          <span style={{margin: '0 auto',fontSize: 16,fontWeight: 'bolder'}}>用户列表</span>
          <Icon type="menu-fold" style={{
            position: 'absolute',
            right: 10,
            fontSize: 15,
            cursor:'pointer'
          }} onClick={ this.handleOnExitProjectGroup.bind(this,userInfo.id)}/>
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
            onBlur={(event)=>{
              console.log(window.event.srcElement);
              this.setState({
                showSearchUserPanel:'none',
                userForSearchPanel:[]
              });
            }}
            style={{ width: '100%' }}
            size='small'
            onChange={(event)=>{
              const value = event.target.value;
              if(value!==''){
                this.setState({
                  showSearchUserPanel:'flex'
                });
                ProjectStore.getUserLikeTheUsername(value).then(response=>{
                  if(response){
                    this.setState({
                      userForSearchPanel:response.data
                    });
                  }else{
                    message.error('网络错误，查询失败');
                  }
                });

              }else{
                this.setState({
                  showSearchUserPanel:'none'
                });
              }
            }}
          />
          <div style={showSearchUserPanelStyle} onMouseDown={(event)=>{
            /* 神来之笔：阻止input的失焦事件的检测，可实现点击其他区域隐藏该div，而自身的点击事件不会处罚input的失焦事件 */
            event.preventDefault();
          }}>
            {userForSearchPanelArray.length===0?(
              <div style={{
                background: '#fafafa',
                width: '100%',
                position: 'absolute',
                zIndex: 2,
                boxShadow: '#6666662e 4px 4px 10px',
                height:50,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <span style={{
                  color:'rgba(0,0,0,0.45)'
                }}>暂无内容</span>
              </div>
            ):(
              userForSearchPanelArray
            )}
          </div>
        </div>
        {
          result.length!==0?(
            <div style={{
              height:'calc(100% - 72px)',
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
              height: 'calc(100% - 72px)'
            }}>
              <span style={{
                color: 'rgba(0, 0, 0, 0.2)',
                fontSize: 16
              }}>暂无成员
                <Popover content={(<div>使用搜索框添加成员</div>)}>
                  <Icon type="question-circle-o" style={{marginLeft:5,cursor:'pointer'}}/>
                </Popover></span>
            </div>
          )
        }

      </div>
    );
  }

}

export default withRouter(UserList);
