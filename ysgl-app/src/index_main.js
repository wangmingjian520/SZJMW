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