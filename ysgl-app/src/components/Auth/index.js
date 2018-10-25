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
            let location = FaceUrl.cas_host+FaceUrl.api_host;
            let userId = '';
            
            const { dispatch } = this.props;
            //ID为null，通过接口获取当前用户信息，
            // axios.ajax({
            //     url:FaceUrl.userInfoUrl,
            //     method:FaceUrl.POST,
            //     baseApi:FaceUrl.webApi,
            //     data:{
            //         isShowLoading:false
            //     }
            // }).then((res)=>{
            //     if(res.code == '1') {
            //         userId = res.data.userID;
            //         dispatch(setUserInfo(userId))
            //         sessionStorage.setItem("userId",userId)
            //         console.log("auth==="+res.data.userID);
            //     }else{
            //         window.parent.location.href = location;
            //     }
            // })
            
            let res = Dictionary.userInfo;
            userId = res.userID;
            dispatch(setUserInfo(userId))
            sessionStorage.setItem("userId",userId)
            console.log("auth_Dictionary==="+userId);
            
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

