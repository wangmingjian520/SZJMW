import React from 'react';
import { HashRouter , Route , Switch , Redirect} from 'react-router-dom'
import App from './App'
import Index_main from './index_main'
import Auth from './components/Auth'
import Login from './pages/login'

import NoMatch from './pages/noMatch'
import Zfgmfwxm from './pages/ysbz/zfgmfwxm'
import Xmjbxx from './pages/ysbz/xmjbxx'
import Bmzjys from './pages/ysbz/bmzjys'

import InfoDetail from './pages/infoDetail'

import Ystzsq from './pages/ystz/ystzsq'
import Ysjhgl from './pages/ysjh/ysjhgl'
import Ysjhsp from './pages/ysjh/ysjhsp'
import Jjflkm from './pages/jjflkm'
import Yszxqk from './pages/yszxjk/yszxqk'
import Excel from './pages/excel'

function isLogin(nextState, replaceState) {
    let  auth = new Auth(); //初始化一个全局的Auth对象
    let Todo = window.location.hash.replace(/#|\?.*$/g,'');
            if (!auth.isLogin){
                auth.login(()=>{
                    this.props.history.push(Todo);
                })
                console.log(auth.isLogin);
            }
}

export default class IRouter extends React.Component{
    
    render(){
        return (
            <HashRouter>
                <App >
                <Switch>
                    <Route path="/Login" component={Login} ></Route>
                    {/* 预算管理主路由 */}
                    <Route  path="/" onEnter={isLogin} render={()=>
                        <Index_main>
                        <Switch>
                            
                            <Route path="/infoDetail/:detailId" component={InfoDetail} />
                            {/* 预算编制管理 */}
                            <Route path="/zfgmfwxm" component={Zfgmfwxm}></Route>
                            <Route path="/xmjbxx" component={Xmjbxx}></Route>
                            <Route path="/bmzjys" component={Bmzjys}></Route>

                            {/* 预算调整管理 */}
                            <Route path="/ystzsq" component={Ystzsq}></Route>
                            {/* 预算计划管理 */}
                            <Route path="/ysjhgl" component={Ysjhgl}></Route>
                            <Route path="/ysjhsp" component={Ysjhsp}></Route>
                            {/* 预算支出 */}
                            <Route path="/yszc" component={Jjflkm}></Route>
                            {/* 预算执行与监控 */}
                            <Route path="/yszxqk" component={Yszxqk}></Route>
                             {/*Excel的导入导出 */}
                             <Route path="/yscxtj" component={Excel}></Route>

                            {/* <Redirect to="/zfgmfwxm" /> */}
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