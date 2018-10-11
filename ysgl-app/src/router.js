import React from 'react';
import { HashRouter , Route , Switch , Redirect} from 'react-router-dom'
import App from './App'
import Index_main from './index_main'
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

export default class IRouter extends React.Component{

    render(){
        return (
            <HashRouter>
                <App>
                <Switch>
                    <Route path="/Login" component={Login}></Route>
                    {/* 预算管理主路由 */}
                    <Route  path="/" render={()=>
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
                            

                            <Redirect to="/zfgmfwxm" />
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