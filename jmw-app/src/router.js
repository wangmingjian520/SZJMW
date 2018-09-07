import React from 'react';
import { HashRouter , Route , Switch } from 'react-router-dom'
import App from './App'
import Index_main from './index_main'
import Login from './pages/login'
import NoMatch from './pages/noMatch'
import Wzmlgl from './pages/yjwz/wzcbgl/wzmlgl'
import Wzcbkdgl from './pages/yjwz/wzcbgl/wzcbkdgl'

export default class IRouter extends React.Component{

    render(){
        return (
            <HashRouter>
                <App>
                <Switch>
                    {/* 应急管理主路由 */}
                    <Route  path="/" render={()=>
                        <Index_main>
                        <Switch>
                            <Route path="/yjwz/wzcbgl/wzmlgl" component={Wzmlgl}></Route>
                            <Route path="/yjwz/wzcbgl/wzcbkdgl" component={Wzcbkdgl}></Route>
                            <Route component={NoMatch}></Route>
                        </Switch>
                        </Index_main>

                    }/>

                    <Route path="/Login" component={Login}></Route>
                </Switch>
                </App>   
            </HashRouter>
        );
    }
}