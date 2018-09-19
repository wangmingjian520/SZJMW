export default class ApiAndInterfaceUrl {
    static GET = "GET";
    static POST = "POST";
    static bdApi = "http://localhost:8050/yj";
    //菜单接口
    static menuUrl = '/platform/listResource';
    //物资目录管理
    static wzmlgl = '/wzml/list';
    static wzmlAdd = '/wzml/save';
    static wzmlEdit = '/wzml/findById';
    static wzmlDel = '/wzml/delete';
    //物资储备库点管理
    static wzcbkdgl = '/wzkd/list';
    static wzcbAdd = '/wzcb/save';
    static wzcbEdit = '/wzcb/findById';
    static wzcbDel = '/wzcb/delete';

    static wzcbxxgl = '/wzcb/list';

    //应急事件处理-应急事件立案
    static yjsjla = '/yjsjla/tableList';
}