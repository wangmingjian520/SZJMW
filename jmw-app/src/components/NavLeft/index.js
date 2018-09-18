import React from 'react'
import { Menu } from 'antd';
import MenuConfig from '../../config/menuConfig'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from './../../axios'
import { switchMenu } from './../../redux/action'
import FaceUrl from '../../utils/apiAndInterfaceUrl'
const { SubMenu } = Menu;

class NavLeft extends React.Component{
    state = {
        openKeys:['/yjzygl','/wzcbgl']
    }
    
    
    handleClick= ({item})=>{
        console.log(item);
        const { dispatch } = this.props;
        dispatch(switchMenu(item.props.title))
        this.setState({
            openKeys:item.props.openKeys,
            currentKey:item.props.eventKey
        })
    }

    componentWillMount(){   
        let currentKey = window.location.hash.replace(/#|\?.*$/g,'');
        axios.ajax({
            url:FaceUrl.menuUrl,
            method:FaceUrl.GET,
            baseApi:FaceUrl.bdApi,
            data:{
                isShowLoading:true
            }
        }).then((res)=>{
            if(res.code == '1') {
                const menuTreeNode = this.renderMenu(res.data);
                    this.setState({
                        currentKey,
                        menuTreeNode
                    })
                    console.log(currentKey);
            }
        })
    }
    // 菜单渲染
    renderMenu =(data)=>{
        return data.map((item)=>{
            if(item.children){
                return (
                    <SubMenu title={item.title} key={item.key}>
                        { this.renderMenu(item.children)}
                    </SubMenu>
                )
            }
            return <Menu.Item title={item.title} key={item.key}>
                <NavLink to={item.key}>{item.title}</NavLink>
            </Menu.Item>
        })
    }

    render(){
        return(
            <div>
                   <Menu
                        theme="light"
                        mode="inline"
                        style={{ height: '100%', borderLeft: 1 }}
                        onClick={this.handleClick}
                        selectedKeys={[this.state.currentKey]}
                        defaultOpenKeys={this.state.openKeys}
                        inlineIndent="15"
                        >
                        {this.state.menuTreeNode}
                    </Menu>
                
            </div>
        );
        
    } 
}

export default  connect()(NavLeft)