export default class ApiAndInterfaceUrl {
    static GET = "GET";
    static POST = "POST";

    //static bdApi = "http://192.168.50.29:8060/bud/api";
    static bdApi =" http://119.147.216.208/api/intrl/bud/api";
    //菜单接口
    static menuUrl = '/platform/listResource';
    //h1接口
    //static redirectUrl = 'http://192.168.50.29:8060/bud/redirect?url=http://192.168.50.29:3030/';
    static redirectUrl ='http://119.147.216.208/api/intrl/bud/redirect?url=http://192.168.50.29:3030/'
    
    //userInfo接口
    // static webApi = "http://192.168.50.181:8060/";
    // static userInfoUrl = '/user/info';
    //预算编制-项目基本信息
     //预算编制-政府购买服务项目管理
     static xmjbxx = '/xmxx/list/1';
     static xmxxAdd = '/xmxx/save';
     static xmxxDetail = '/xmxx/findById/';
     static xmxxDel = '/xmxx/delete';
     static xmxxsplist = '/xmxx/splist'
     //预算编制-政府购买服务项目管理
     static gmfwgl = '/gmfw/list';
     static gmfwAdd = '/gmfw/save';
     static gmfwfindByXmId = '/gmfw/findByXmId/';
     static gmfwDel = '/gmfw/delete';
 
     //预算调整-预算调整申请管理
     static ystzsqgl = '/ystz/list';
     static ystzsqAdd = '/ystz/save';
     static ystzsqDetail = '/ystz/findById';
     static ystzsqDel = '/ystz/delete';
      //预算计划-预算计划管理
      static ysjhgl = '/ysjh/list';
      static ysjhAdd = '/ysjh/save';
      static ysjhDetail = '/ysjh/findById';
      static ysjhDel = '/ysjh/delete';
      //预算计划-预算计划审批
      static ysjhspgl = '/yssp/list';
      static ysjhspAdd = '/yssp/save';
      static ysjhspDetail = '/yssp/findById';
      static ysjhspDel = '/yssp/delete';
      //预算支出
     static jjflkmgl = '/jjflkm/list';
     static jjflkmAdd = '/jjflkm/save';
     static jjflkmDetail = '/jjflkm/findById';
     static jjflkmDel = '/jjflkm/delete';
 
     //预算执行与监控-预算执行情况
     static zxqkgl = '/zxqk/list';
     static zxqkAdd = '/zxqk/save';
     static zxqkDetail = '/zxqk/findById';
     static zxqkDel = '/zxqk/delete';
     //预算经济分类-政府预算经济分类
     static zfysjjflgl = '/gov/page';
     static zfysjjflList = '/gov/list';
     static zfysjjflAdd = '/gov/save';
     static zfysjjflDetail = '/gov/findById/';
     static zfysjjflDel = '/gov/delete';
     //预算经济分类-部门预算经济分类
     static depysjjflgl = '/dep/page';
     static depysjjflList = '/dep/list';
     static depysjjflAdd = '/dep/save';
     static depysjjflDetail = '/dep/findById';
     static depysjjflDel = '/dep/delete';
     
      //政府购买服务目录
      static zfgmfwmlTree = '/fwml/tree';
      static zfgmfwmlAdd = '/fwml/save';
      static zfgmfwmlDetail = '/fwml/findOne/';
      static zfgmfwmlParent = '/fwml/childs/';
      static zfgmfwmlDel = '/fwml/delete';
      
     //预算编制-流程接口
     static ProcVo = '/proc/info/';
     static procStart = '/proc/start';
     static procRun = '/proc/run';
     static procGetPersons = '/proc/getPersons';
     //资金预算
     static zjysgl = '/zjys/list';
     static zjysAdd = '/zjys/save';
     static zjysfindByXmId = '/zjys/findByXmIdAndVersion/';
     static zjysDel = '/zjys/deleteById/';
     //设备设施管理
     static sbssgl = '/sbss/list';
     static sbssAdd = '/sbss/save';
     static sbssDetail = '/sbss/findById';
     static sbssDel = '/sbss/delete';
     //应急组织体系-应急组织基本信息
     static orggl = '/org/list';
     static orgAdd = '/org/save';
     static orgDetail = '/org/findById';
     static orgDel = '/org/delete';
     //应急组织体系-应急指挥部管理
     static jyzhbgl = '/jyzhb/list';
     static jyzhbAdd = '/jyzhb/save';
     static jyzhbDetail = '/jyzhb/findById';
     static jyzhbDel = '/jyzhb/delete';
     //应急救援队伍
     static jydw = '/jydw/list';
     static jydwAdd = '/jydw/save';
     static jydwDetail = '/jydw/findById';
     static jydwDel = '/jydw/delete';
     //应急专家信息
     static zjxx = '/zj/list';
     static zjxxAdd = '/zj/save';
     static zjxxDetail = '/zj/findById';
     static zjxxDel = '/zj/delete';
     //应急通讯录
     static qytxl = '/qytxl/list';
     static qytxlAdd = '/qytxl/save';
     static qytxlDetail = '/qytxl/findById';
     static qytxlDel = '/qytxl/delete';
 
      //应急预案-预案编制
      static yabz = '/yabz/list';
      static yabzAdd = '/yabz/save';
      static yabzDetail = '/yabz/findById';
      static yabzDel = '/yabz/delete';
      //应急预案-预案审查修订
      static jyzhbgl = '/jyzhb/list';
      static jyzhbAdd = '/jyzhb/save';
      static jyzhbDetail = '/jyzhb/findById';
      static jyzhbDel = '/jyzhb/delete';
      //应急预案-预案审查修订
      static jyzhbgl = '/jyzhb/list';
      static jyzhbAdd = '/jyzhb/save';
      static jyzhbDetail = '/jyzhb/findById';
      static jyzhbDel = '/jyzhb/delete';
 
     //应急演练-演练计划
     static yljh = '/yljh/list';
     static yljhAdd = '/yljh/save';
     static yljhDetail = '/yljh/findById';
     static yljhDel = '/yljh/delete';
     //应急演练-演练过程
     static ylgc = '/ylgc/list';
     static ylgcAdd = '/ylgc/save';
     static ylgcDetail = '/ylgc/findById';
     static ylgcDel = '/ylgc/delete';
     //应急演练-演练总结
     static ylzj = '/ylzj/list';
     static ylzjAdd = '/ylzj/save';
     static ylzjDetail = '/ylzj/findById';
     static ylzjDel = '/ylzj/delete';
 
     //应急事件处理-应急事件受理
     static sjsl = '/sjsl/list';
     static sjslAdd = '/sjsl/save';
     static sjslDetail = '/sjsl/findById';
     static sjslDel = '/sjsl/delete';
     //应急事件处理-应急事件立案
     static sjla = '/sjla/list';
     static sjlaAdd = '/sjla/save';
     static sjlaDetail = '/sjla/findById';
     static sjlaDel = '/sjla/delete';
     //应急事件处理-应急事件总结
     static sjja = '/sjja/list';
     static sjjaAdd = '/sjja/save';
     static sjjaDetail = '/sjja/findById';
     static sjjaDel = '/sjja/delete';
 
     //风险源信息
     static fxyxgl = '/Fxy/list';
     static fxyAdd = '/Fxy/save';
     static fxyDetail = '/Fxy/findById';
     static fxyDel = '/Fxy/delete';
}