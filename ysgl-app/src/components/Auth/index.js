import React from 'react';
import axios from './../../axios'
import FaceUrl from './../../utils/apiAndInterfaceUrl'
import Dictionary from './../../utils/dictionary'
import { setUserInfo } from './../../redux/action'
import { connect } from 'react-redux';
import { HashRouter , Route , Switch , Redirect} from 'react-router-dom'
import NoMatch from './../../pages/noMatch'
class Auth extends React.Component{
        

        getUserId = () => {
            let userId = '';
            //let redirectUrl = 'http://192.168.50.30:8060/redirect?url=http://192.168.50.29:3030/';
            const { dispatch } = this.props;
        //    //登录H5成功后，访问redirect接口获取当前用户信息，
        //     axios.ajax({
        //         url:"http://192.168.50.30:8060/bud/platform/getUser",
        //         method:FaceUrl.GET,
        //         baseApi:FaceUrl.webApi,
        //         data:{
        //             isShowLoading:false
        //         }
        //     }).then((res)=>{
        //         if(res.code == '0'&& res.errorStatus=='10') {
        //            window.location = redirectUrl
        //         }
        //     })
            
            let res = Dictionary.userInfo;
            userId = res.userID;
            dispatch(setUserInfo(userId))
            //console.log("auth_Dictionary==="+userId);
            let { component: Component, ...rest} = this.props;
            
            return (
                <Route
                  render={props =>
                    userId ? (
                        <Component {...rest} />
                      ) : (
                        <Redirect
                            to={NoMatch}
                            />
                          
                      )
                  }
                  />
                  );

        }

        //判断用户INfo是否为空
        render() {
            return (
                <div>
                    {this.getUserId()}
                </div>
            )
          }
      
}
const mapStateToProps = state => {
    return {
        userId: state.userId
    }
};
export default connect(mapStateToProps)(Auth)

