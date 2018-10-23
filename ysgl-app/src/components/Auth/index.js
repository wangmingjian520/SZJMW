import React from 'react';
import axios from './../../axios'
import FaceUrl from './../../utils/apiAndInterfaceUrl'
import Dictionary from './../../utils/dictionary'
import { connect } from 'react-redux'
import { setUserInfo } from './../../redux/action'

const {isLogin} = false; //是否登录
class Auth extends React.Component{
    state={
        userName:'',
        userId:''
    }
    
    //判断用户INfo是否为空
    static login(callback){
        const { userId } = this.props;
        if (userId){
            this.isLogin = true;
            callback(); //有用户ID，则调用回调函数
        } else {
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
            //         this.isLogin = true;
            //         dispatch(setUserInfo(res.data.userID))
            //         console.log("auth==="+res.data.userID);
            //     }else{
            //         //没有登录信息跳转H1登录界面
            //         alert("登录失败");
            //     }
            // })
            let res = Dictionary.userInfo;
            dispatch(setUserInfo(res.userID))
            
        }
    }

}
const mapStateToProps = state => {
    return {
        userId: state.userId
    }
};
export default connect(mapStateToProps)(Auth)