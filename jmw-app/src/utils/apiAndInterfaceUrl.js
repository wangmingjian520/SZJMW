export default class ApiAndInterfaceUrl {
    static GET = "GET";
    static POST = "POST";
    static bdApi = "http://192.168.50.29:8050/yj";
    //菜单接口
    static menuUrl = '/platform/listResource';
    //物资目录管理
    static wzmlgl = '/wzml/list';
    static wzmlAdd = '/wzml/save';
    static wzmlDefail = '/wzml/findById';
    static wzmlDel = '/wzml/delete';
    //物资储备库点管理
    static wzkdkdgl = '/wzkd/list';
    static wzkdAdd = '/wzkd/save';
    static wzkdDefail = '/wzkd/findById';
    static wzkdDel = '/wzkd/delete';
     //服务机构管理
     static fwjggl = '/fwjg/list';
     static fwjgAdd = '/fwjg/save';
     static fwjgDefail = '/fwjg/findById';
     static fwjgDel = '/fwjg/delete';
    //服务机构合同管理
    static fwjghtgl = '/fwjght/list';
    static fwjghtAdd = '/fwjght/save';
    static fwjghtDefail = '/fwjght/findById';
    static fwjghtDel = '/fwjght/delete';
    //物资储备信息管理控制器
    static wzcbxxgl = '/wzcb/list';
    static wzcbAdd = '/wzcb/save';
    static wzcbDefail = '/wzcb/findById';
    static wzcbDel = '/wzcb/delete';

    //应急事件处理-应急事件立案
    static yjsjla = '/yjsjla/tableList';
}