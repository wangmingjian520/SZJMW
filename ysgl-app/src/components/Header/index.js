import React from 'react';


import './index.less'

export default class Header extends React.Component{
    state={}
    componentWillMount(){
        this.setState({
            typeName:'预算管理系统'
        })
    }

    render(){
        return(
            <div className="secondHeader">
                <span className="header-Info">{this.state.typeName}</span>

            </div>
                   
            );
        }
   
}