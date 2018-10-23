import React from 'react';
import { connect } from 'react-redux'


import './index.less'

class Header extends React.Component{
    state={
        typeName:'预算管理',
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