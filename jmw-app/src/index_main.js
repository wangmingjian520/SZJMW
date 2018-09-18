import React from 'react'
import { Layout } from 'antd';
import Header from './components/Header'
import NavLeft from './components/NavLeft'

import './style/common.less';
const { Sider } = Layout;


export default class Index_main extends React.Component{

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
