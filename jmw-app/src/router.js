import React from 'react';
import { HashRouter , Route , Switch , Redirect} from 'react-router-dom'
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
                    <Route path="/Login" component={Login}></Route>
                    {/* 应急管理主路由 */}
                    <Route  path="/" render={()=>
                        <Index_main>
                        <Switch>
                            <Route path="/main/yjzygl/wzcbgl/wzmlgl" component={Wzmlgl}></Route>
                            <Route path="/main/yjzygl/wzcbgl/wzcbkdgl" component={Wzcbkdgl}></Route>

                            <Route path="/main/yjsjcl/yjsjla" component={Yjsjla}></Route>
                            <Redirect to="/main"/>
                            <Route component={NoMatch}></Route>
                        </Switch>
                        </Index_main>

                    }/>

                    
                </Switch>
                </App>   
            </HashRouter>
        );
    }
}