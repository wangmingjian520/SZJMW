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
        //openKeys:['/yjzygl','/wzcbgl']
     //  openKeys:['/ystz'],
        currentKey:[]
    }
    
    // onOpenChange = (openKeys) => {
    //     const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
    //     if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
    //       this.setState({ openKeys });
    //     } else {
    //       this.setState({
    //         openKeys: latestOpenKey ? [latestOpenKey] : [],
    //       });
    //     }
    //   }

      getOpenkeys =(value,datelist)=>{ 
          for(var i =0;i<datelist.length;i++){
              if(datelist[i].children){
                for(var j =0;j<datelist[i].children.length;j++){
                    if(datelist[i].children[j].key.indexOf(value) !== -1){ 
                        this.setState({
                            openKeys :[datelist[i].key]
                        })
                        return ;
                    }
                     
                }
              }
          }
        

          }
    
    handleClick= ({item})=>{
        const { dispatch } = this.props;
        dispatch(switchMenu(item.props.title))
        this.setState({
            openKeys:item.props.openKeys,
            currentKey:item.props.eventKey
        })
    }
    onOpenChange =(openKeys)=>{ 
      //  alert(openKeys)
        this.setState({
            openKeys
        }) 
    }
    componentWillMount(){    
        let currentKey = window.location.hash.replace(/#|\?.*$/g,''); 
        if(currentKey ==='/'){
            currentKey='/zfgmfwxm';
            this.setState({ 
                openKeys:['/ysbz']
            })
        }
        const { userId } = this.props;
        axios.ajax({
            url:FaceUrl.menuUrl,
            method:FaceUrl.GET,
            baseApi:FaceUrl.bdApi,
            data:{
                userId,
                isShowLoading:true
            }
        }).then((res)=>{
            if(res.code == '1') {
             let datelist=res.data; 
             if(currentKey !=='/'){
                this.getOpenkeys(currentKey,datelist);
            } 
                const menuTreeNode = this.renderMenu(datelist);
                    this.setState({
                        currentKey,
                        menuTreeNode
                    })
                    
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
                     //   defaultOpenKeys={this.state.openKeys}
                        onOpenChange ={this.onOpenChange}
                        openKeys ={this.state.openKeys}
                        //onOpenChange={this.onOpenChange}
                        inlineIndent="15"
                        >
                        {this.state.menuTreeNode}
                    </Menu>
                
            </div>
        );
        
    } 
}
const mapStateToProps = state => {
    return {
        userId: state.userId
    }
};
export default connect(mapStateToProps)(NavLeft)