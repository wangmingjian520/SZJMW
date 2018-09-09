import React from 'react';
import { HashRouter , Route , Switch } from 'react-router-dom'
import App from './App'
import Index_main from './index_main'
import Login from './pages/login'
import NoMatch from './pages/noMatch'
import Wzmlgl from './pages/yjwz/wzcbgl/wzmlgl'
import Wzcbkdgl from './pages/yjwz/wzcbgl/wzcbkdgl'

import Yjsjla from './pages/yjsjcl/yjsjla'

export default class IRouter extends React.Component{

    render(){
        return (
            <HashRouter>
                <App>
                <Switch>
                    {/* 应急管理主路由 */}
                    <Route  path="/main" render={()=>
                        <Index_main>
                        <Switch>
                            <Route path="/main/yjwz/wzcbgl/wzmlgl" component={Wzmlgl}></Route>
                            <Route path="/main/yjwz/wzcbgl/wzcbkdgl" component={Wzcbkdgl}></Route>

                            <Route path="/main/yjsjcl/yjsjla" component={Yjsjla}></Route>
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