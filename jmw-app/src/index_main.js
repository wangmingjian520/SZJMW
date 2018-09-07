import React from 'react'
import { Layout,  Breadcrumb } from 'antd';
import Header from './components/Header'
import NavLeft from './components/NavLeft'

import './style/common.less';
const { Content, Sider } = Layout;


export default class Index_main extends React.Component{

    render (){
        return(
            <Layout>
                
                <Header/>
                <Layout>
                    <Sider className="nav-left"> 
                    <NavLeft/>
                    </Sider>
                    <Layout style={{ padding: '0 24px 24px' }}>
                        <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>首页</Breadcrumb.Item>
                        <Breadcrumb.Item>应急管理</Breadcrumb.Item>
                        <Breadcrumb.Item>应急资源管理</Breadcrumb.Item>
                        </Breadcrumb>
                        <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
                        {/* Content */}
                        {this.props.children}
                        </Content>
                    </Layout>
                </Layout>

            </Layout>
            
        );
    }
}
