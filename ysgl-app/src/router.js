import React from 'react';
import { HashRouter , Route , Switch , Redirect} from 'react-router-dom'
import App from './App'
import Index_main from './index_main'
import AuthRoute  from './components/Auth'
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
import Zfysjjfl from './pages/ysjjfl/zfysjjfl'
import Bmysjjfl from './pages/ysjjfl/bmysjjfl'
import Zfgmfwml from './pages/zfgmfwml'

import Excel from './pages/excel'
import Ysbztz from './pages/ysbz/ystz';



export default class IRouter extends React.Component{
    
    render(){
        return (
            <HashRouter>
                <App >
                <Switch>
                    <Route path="/Login" component={Login} ></Route>
                    {/* 预算管理主路由 */}
                    <Route  path="/"  render={()=>
                        <Index_main>
                        <Switch>
                            <Route path="/infoDetail/:detailId" component={InfoDetail} />
                            {/* 预算编制管理 */}
                            <AuthRoute path="/" exact component={Xmjbxx} />
                            <AuthRoute path="/zfgmfwxm" component={Zfgmfwxm} />
                            <AuthRoute path="/xmjbxx" component={Xmjbxx} />
                            <AuthRoute path="/ysbztz/:detailId" component={Ysbztz} />
                            <AuthRoute path="/bmzjys" component={Bmzjys} />
                            
                            {/* 预算调整管理 */}
                            <AuthRoute path="/ystzsq" component={Ystzsq}/>
                            {/* 预算计划管理 */}
                            <AuthRoute path="/ysjhgl" component={Ysjhgl}/>
                            <AuthRoute path="/ysjhsp" component={Ysjhsp}/>
                            {/* 预算支出 */}
                            <AuthRoute path="/yszc" component={Jjflkm}/>
                            {/* 预算执行与监控 */}
                            <AuthRoute path="/yszxqk" component={Yszxqk}/>
                            {/*Excel的导入导出 */}
                            <AuthRoute path="/yscxtj" component={Excel}/>
                            {/*政府预算经济分类*/}
                            <AuthRoute path="/zfysjjfl" component={Zfysjjfl}/>
                            {/*部门预算经济分类*/}
                            <AuthRoute path="/bmysjjfl" component={Bmysjjfl}/>
                            {/*政府购买服务目录*/}
                            <AuthRoute path="/zfgmfwml" component={Zfgmfwml}/>
                            
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