import React from 'react';
import { HashRouter , Route , Switch , Redirect} from 'react-router-dom'
import App from './App'
import Index_main from './index_main'
import Login from './pages/login'
import NoMatch from './pages/noMatch'
import Wzmlgl from './pages/yjzygl/wzcbgl/wzmlgl'
import Wzcbkdgl from './pages/yjzygl/wzcbgl/wzcbkdgl'
import Wzcbxx from './pages/yjzygl/wzcbgl/wzcbxx'
import Yjsjla from './pages/yjsjcl/yjsjla'
import Fwjggl from './pages/yjzygl/wzcbgl/fwjg/fwjggl';
import Fwjghtgl from './pages/yjzygl/wzcbgl/fwjg/fwjghtgl';
import Jcjhgl from './pages/yjzygl/wzcbgl/wzcbjc/jcjhgl';
import InfoDetail from './pages/infoDetail';
import Jczggl from './pages/yjzygl/wzcbgl/wzcbjc/jczggl';
import Jcjlgl from './pages/yjzygl/wzcbgl/wzcbjc/jcjlgl';
import Sbssgl from './pages/yjzygl/sbssgl';
import Yjzzjbxx from './pages/yjzygl/yjzztx/yjzzjbxx';
import Yjzhbgl from './pages/yjzygl/yjzztx/yjzhbgl';
import Yjjydw from './pages/yjzygl/yjjydw';
import Zjkxxwh from './pages/yjzygl/yjzj/zjkxxwh';
import Zjxxcx from './pages/yjzygl/yjzj/zjxxcx';
import Yjzj from './pages/yjzygl/yjzj';
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
                            <Route path="/infoDetail/:detailId" component={InfoDetail} />
                            {/* 应急资源管理 */}
                            <Route path="/wzmlgl" component={Wzmlgl}></Route>
                            <Route path="/wzcbkdgl" component={Wzcbkdgl}></Route>
                            <Route path="/wzcbxx" component={Wzcbxx}></Route>
                            <Route path="/yjsjla" component={Yjsjla}></Route>
                            <Route path="/fwjggl" component={Fwjggl}></Route>
                            <Route path="/fwjghtgl" component={Fwjghtgl}></Route>
                            <Route path="/jcjhgl" component={Jcjhgl}></Route>
                            <Route path="/jcjlgl" component={Jcjlgl}></Route>
                            <Route path="/jczggl" component={Jczggl}></Route>

                            <Route path="/sbssgl" component={Sbssgl}></Route>
                            <Route path="/yjzzjbxx" component={Yjzzjbxx}></Route>
                            <Route path="/yjzhbgl" component={Yjzhbgl}></Route>
                            <Route path="/sbssgl" component={Sbssgl}></Route>
                            <Route path="/yjjydw" component={Yjjydw}></Route>
                            <Route path="/yjzj" component={Yjzj}></Route>
                            <Route path="/zjxxcx" component={Zjxxcx}></Route>

                            <Redirect to="/wzmlgl" />
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