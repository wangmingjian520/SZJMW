import React from 'react';
import { connect } from 'react-redux'

import axios from './../../axios'
import { setUserInfo } from './../../redux/action'
import FaceUrl from '../../utils/apiAndInterfaceUrl'
import Dictionary from '../../utils/dictionary'
import './index.less'

class Header extends React.Component{
    state={
        typeName:'预算管理',
        userName:'',
        userId:''
    }
    componentWillMount(){
        const { dispatch } = this.props;
        
        // 获取当前用户信息，tomcat中使用
        // axios.ajax({
        //     url:FaceUrl.userInfoUrl,
        //     method:FaceUrl.POST,
        //     baseApi:FaceUrl.webApi,
        //     data:{
        //         isShowLoading:false
        //     }
        // }).then((res)=>{
        //     if(res.code == '1') {
        //         
        //         dispatch(setUserInfo(res.userID))
        //         console.log(res);
        //     }
        // })
       let res = Dictionary.userInfo;
       dispatch(setUserInfo(res.userID))

    }
    render(){
        return(
            <div className="secondHeader">
                <span className="header-Info">{this.state.typeName}</span>

            </div>
                   
            );
        }
}

export default  connect()(Header)