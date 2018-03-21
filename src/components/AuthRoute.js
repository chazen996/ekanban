import {Route, Redirect} from 'react-router-dom';
import AuthSessionStorge from '../utils/AuthSessionStorage';

/* 控制路由跳转前检查是否登陆，如未登陆直接跳转到login界面 */
function checkAuth() {
  let username = AuthSessionStorge.getItem('username');
  let loginStatus = AuthSessionStorge.getItem('loginStatus');
  /* 如果本地加密的登陆信息不存在或者登陆信息不合法，则返回false */
  if(loginStatus){
    let array = loginStatus.split(';');
    if(array[0]===username&&array[1]==='login'){
      return true;
    }
    return false;
  }
  return false;
}

/* 通过ForLogin字段控制路由跳转规则：未登录时，访问任何页面均跳转至login页面；登陆成功后，访问/目录或登陆页面应直接跳转到主页 */
const AuthRoute = ({component: Component, ForLogin, ...rest}) => {
  if (ForLogin) {
    return (
      <Route
        {...rest}
        render={props => (
          checkAuth() ? (
            <Redirect
              to={{
                pathname: "/example",
                state: {from: props.location}
              }}
            />
          ) : (
            <Component {...props} />
          )
        )
        }
      />
    );
  }else {
    return (
      <Route
        {...rest}
        render={props => (
          checkAuth() ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: {from: props.location}
              }}
            />
          )
        )
        }
      />
    );
  }

};

export default AuthRoute;
