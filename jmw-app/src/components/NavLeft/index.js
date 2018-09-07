import React from 'react'
import { Menu } from 'antd';
import MenuConfig from '../../config/menuConfig'
import { NavLink , Link } from 'react-router-dom'

const { SubMenu } = Menu;

export default class NavLeft extends React.Component{
    state = {
        currentKey: ''
    }
   
    componentWillMount(){
        const menuTreeNode = this.renderMenu(MenuConfig);

        this.setState({
            menuTreeNode
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
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1']}
                        style={{ height: '100%', borderLeft: 2 }}
                        >

                        {this.state.menuTreeNode}
                    </Menu>
                
            </div>
        );
        
    } 
}