import React from 'react'
import { Menu } from 'antd';
import MenuConfig from '../../config/menuConfig'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { switchMenu } from './../../redux/action'
const { SubMenu } = Menu;

class NavLeft extends React.Component{
    state = {
        openKeys:['/main/yjzygl','/main/yjzygl/wzcbgl']
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
        const menuTreeNode = this.renderMenu(MenuConfig);
        let currentKey = window.location.hash.replace(/#|\?.*$/g,'');
        
        //console.log("111"+currentKey);
        this.setState({
            currentKey,
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
                        style={{ height: '100%', borderLeft: 2 }}
                        onClick={this.handleClick}
                        defaultSelectedKeys={[this.state.currentKey]}
                        defaultOpenKeys={this.state.openKeys}
                        
                        >
                        {this.state.menuTreeNode}
                    </Menu>
                
            </div>
        );
        
    } 
}

export default  connect()(NavLeft)