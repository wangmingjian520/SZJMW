import React from 'react'
import { Layout } from 'antd';
import Header from './components/Header'
import NavLeft from './components/NavLeft'

import axios from './axios'
import { setUserInfo } from './redux/action'
import FaceUrl from './utils/apiAndInterfaceUrl'
import Dictionary from './utils/dictionary'
import { connect } from 'react-redux'

import './style/common.less';
const { Sider } = Layout;


class Index_main extends React.Component{
    // state={
    //     userName:'',
    //     userId:''
    // }

    // componentWillMount(){
    //     const { dispatch } = this.props;
    //     // 获取当前用户信息，tomcat中使用
    //     axios.ajax({
    //         url:FaceUrl.userInfoUrl,
    //         method:FaceUrl.POST,
    //         baseApi:FaceUrl.webApi,
    //         data:{
    //             isShowLoading:false
    //         }
    //     }).then((res)=>{
    //         if(res.code == '1') {
    //             dispatch(setUserInfo(res.data.userID))
    //             //console.log(res.data.userID);
    //         }
    //     })
    //    //let res = Dictionary.userInfo;
    //    //dispatch(setUserInfo(res.userID))

    // }

    render (){
        return(
            <Layout>
                
                <Header/>
                <Layout>
                    <Sider className="nav-left"> 
                    <NavLeft/>
                    </Sider>
                    <Layout style={{background:'#fff'}}>
                        
                        {this.props.children}
                    </Layout>
                </Layout>

            </Layout>
            
        );
    }
}
export default  connect()(Index_main)