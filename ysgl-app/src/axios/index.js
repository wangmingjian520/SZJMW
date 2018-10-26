import JsonP from 'jsonp'
import axios from 'axios'
import Utils from './../utils/utils'
import Dictionary from './../utils/dictionary'
import FaceUrl from './../utils/apiAndInterfaceUrl'
import { Modal , message} from 'antd'

// 配置 CORS 跨域
// 表示跨域请求时是否需要使用凭证
axios.defaults.withCredentials = true;

axios.defaults.crossDomain = false;

// 设置超时
axios.defaults.timeout = 10000;

axios.interceptors.request.use(config => {
    //发送请求操作，统一再请求里加上userId 
    let userid = sessionStorage.getItem('userId')
    config.headers['userId'] = userid ? userid : '';
    return config;
}, error => {
    //发送请求错误操作
    console.log('请求失败')
    return Promise.reject(error);
})
axios.interceptors.response.use(response => {
 
    //对响应数据做操作
    if(parseInt(response.data.code, 10) <= '2000000') {
        //console.log('请求成功');
        return response
    }
    if(response.data.code === '2000401' || response.data.code === 2000401) {
        console.log('已过期重新登陆', response.data.code);
        window.parent.location.href = FaceUrl.cas_host+FaceUrl.api_host;
        return Promise.reject(response);
    }
    else {
        console.log('请求失败', response.data.code);
        alert(response.data.message);
        return Promise.reject(response);
    }
}, error => {
    //对响应数据错误做操作
    console.log('请求error', error.message);
    return Promise.reject(error);
})

export default class Axios {
    static requestList(_this,url,method,bdApi,params){
        this.ajax({
            url:url,
            method:method,
            data:params,
            baseApi:bdApi
        }).then((data)=>{
            if(data && data.data){
                let list = data.data.content.map((item,index)=>{
                item.key = index;
                return item
                })
                _this.setState({
                    list,
                    selectedRowKeys:[],
                    selectedRows:null,
                    selectedItem:[],
                    selectedIds:null,
                    pagination:Utils.pagination(data,(current)=>{
                        _this.params.currentPage = current;
                        _this.requestList();
                    })
                }
            )}
        })
    }

    static jsonp(options) {
        return new Promise((resolve, reject) => {
            JsonP(options.url, {
                param: 'callback'
            }, function (err, response) {
                if (response.status === 'success') {
                    resolve(response);
                } else {
                    reject(response.messsage);
                }
            })
        })
    }

    static ajax(options){

        let loading;
        if (options.data && options.data.isShowLoading !== false){
            loading = document.getElementById('ajaxLoading');
            loading.style.display = 'block';
        }
        let baseApi = '';
        if(options.baseApi){
            baseApi = options.baseApi;
        }
        //let userId ='';
        //往header里存放用户ID
        // if(options.data && options.data.userId){
        //     userId = options.data.userId;
        //    }
        // axios.defaults.headers.common['userId'] = userId
        return new Promise((resolve,reject)=>{
            
            axios({
                url:options.url,
                method:options.method,
                baseURL:baseApi,
                timeout:5000,
                data:options.data ? options.data : '',
                //params: options.data.params?options.data.params : '',
                headers: {'Content-Type': 'application/json'},
            }).then((response)=>{
                if (options.data && options.data.isShowLoading !== false) {
                    loading = document.getElementById('ajaxLoading');
                    loading.style.display = 'none';
                }
                if (response.status == '200'){
                    let res = response.data;
                    if (res.code == '1'){
                        resolve(res);
                    }else{
                        Modal.info({
                            title:"提示",
                            content:res.msg
                        })
                    }
                }else{
                    reject(response.data);
                }
            }).catch(function (error) {
                loading = document.getElementById('ajaxLoading');
                loading.style.display = 'none';
                if(error.response&&error.response.data){
                    message.error(error.response.data.message);
                }
            })
        });
    }
}