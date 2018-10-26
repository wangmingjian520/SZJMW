

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

export default [
    
    { path: "/infoDetail/:detailId", name: "InfoDetail", component: InfoDetail , auth: true},
    
    /* 预算编制管理 */
    { path: "/zfgmfwxm", name: "Zfgmfwxm", component: Zfgmfwxm , auth: true},
    { path: "/xmjbxx", name: "Xmjbxx", component: Xmjbxx , auth: true},
    { path: "/bmzjys", name: "Bmzjys", component: Bmzjys , auth: true},
    
    /* 预算调整管理 */
    { path: "/ystzsq", name: "Ystzsq", component: Ystzsq , auth: true},
    /* 预算计划管理 */
    { path: "/ysjhgl", name: "Ysjhgl", component: Ysjhgl, auth: true },
    { path: "/ysjhsp", name: "Ysjhsp", component: Ysjhsp , auth: true},
    /* 预算支出 */
    { path: "/yszc", name: "Jjflkm", component: Jjflkm, auth: true },
    /* 预算执行与监控 */
    { path: "/yszxqk", name: "Yszxqk", component: Yszxqk, auth: true },
    /*Excel的导入导出 */
    { path: "/yscxtj", name: "Excel", component: Excel, auth: true },
    /*政府预算经济分类*/
    { path: "/zfysjjfl", name: "Zfysjjfl", component: Zfysjjfl, auth: true },
    /*部门预算经济分类*/
    { path: "/bmysjjfl", name: "Bmysjjfl", component: Bmysjjfl, auth: true },
    /*政府购买服务目录*/
    { path: "/zfgmfwml", name: "Zfgmfwml", component: Zfgmfwml , auth: true},
  ]