import {Route, Redirect} from 'react-router-dom';
import PublicAuthKit from '../../utils/PublicAuthKit';

/* 通过对Route的扩展增加权限控制的功能：未登录时，除注册页面以外访问任何其他页面均跳转至login页面 */
const AuthRoute = ({component: Component, ...rest}) => (
  <Route
    {...rest}
    render={props => (
      PublicAuthKit.checkAuth() ? (
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

export default AuthRoute;
