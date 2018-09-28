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
import Yjzj from './pages/yjzygl/yjzj';
import Yjtxl from './pages/yjzygl/yjtxl';
import Yabz from './pages/yjya/yabz';
import Yascxd from './pages/yjya/yascxd';
import Yadjjba from './pages/yjya/yadjjba';
import Ylgc from './pages/yjyl/ylgc';
import Ylzj from './pages/yjyl/ylzj';
import Yljh from './pages/yjyl/yljh';
import Yjsjsl from './pages/yjsjcl/yjsjsl';
import Yjsjja from './pages/yjsjcl/yjsjja';
import Fxyxxgl from './pages/yjdlxxxt/fxyxxgl';

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
                            <Route path="/fwjggl" component={Fwjggl}></Route>
                            <Route path="/fwjghtgl" component={Fwjghtgl}></Route>
                            <Route path="/jcjhgl" component={Jcjhgl}></Route>
                            <Route path="/jcdj" component={Jcjlgl}></Route>
                            <Route path="/wtzg" component={Jczggl}></Route>

                            <Route path="/sbssgl" component={Sbssgl}></Route>
                            <Route path="/yjzzjbxx" component={Yjzzjbxx}></Route>
                            <Route path="/yjzhbgl" component={Yjzhbgl}></Route>
                            <Route path="/sbssgl" component={Sbssgl}></Route>
                            <Route path="/yjjydw" component={Yjjydw}></Route>
                            <Route path="/yjzj" component={Yjzj}></Route>
                            <Route path="/yjtxl" component={Yjtxl}></Route>
                            {/* 应急预案 */}
                            <Route path="/yabz" component={Yabz}></Route>
                            <Route path="/yascxd" component={Yascxd}></Route>
                            <Route path="/yadjjba" component={Yadjjba}></Route>
                            {/* 应急事件处理 */}
                            <Route path="/yjsjsl" component={Yjsjsl}></Route>
                            <Route path="/yjsjja" component={Yjsjja}></Route>
                            <Route path="/yjsjla" component={Yjsjla}></Route>

                            {/* 应急演练 */}
                            <Route path="/yljh" component={Yljh}></Route>
                            <Route path="/ylgc" component={Ylgc}></Route>
                            <Route path="/ylzj" component={Ylzj}></Route>

                            {/* 应急地理信息系统 */}
                            <Route path="/fxyxxgl" component={Fxyxxgl}></Route>
                            {/* <Route path="/ylgc" component={Ylgc}></Route> */}

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