import React from 'react'
import { Menu } from 'antd';
import MenuConfig from '../../config/menuConfig'
import { NavLink , Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { swtichMenu } from './../../redux/action'
const { SubMenu } = Menu;

class NavLeft extends React.Component{
    state = {
        currentKey: ''
    }
    
    handleClick= (item)=>{
        console.log(item);
        const { dispatch } = this.props;
        dispatch(swtichMenu(this.props.title))
        this.setState({
            currentKey:item.key
        })
    }

    componentWillMount(){
        const menuTreeNode = this.renderMenu(MenuConfig);
        let currentKey = window.location.hash.replace('/#|\?.*$/g','')
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
                        selectedKeys={this.state.currentKey}
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

export default  connect()(NavLeft)