import JsonP from 'jsonp'
import axios from 'axios'
import Utils from './../utils/utils'
import FaceUrl from './../utils/apiAndInterfaceUrl'
// import Propties from './../data/propties.json'
import { Modal , message} from 'antd'

// 配置 CORS 跨域
// 表示跨域请求时是否需要使用凭证
axios.defaults.withCredentials = true;

axios.defaults.crossDomain = true;

// 设置超时
axios.defaults.timeout = 10000;

axios.interceptors.request.use(config => {
    config.data = JSON.stringify(config.data);
    if (!config.headers['X-Requested-With']) {  
        config.headers['X-Requested-With'] = 'XMLHttpRequest';  
    } 
    config.headers["P3P"] = "CP=\"IDC DSP COR ADM DEVi TAIi PSA PSD IVAi IVDi CONi HIS OUR IND CNT\""
    return config;
}, error => {
    //发送请求错误操作
    console.log('请求失败')
    return Promise.reject(error);
})


axios.interceptors.response.use(response => {
 
    //对响应数据做操作
    if(response.data && parseInt(response.data.code, 10) <= '2000000') {
        if( response.data.code == '0' && response.data.errorStatus=='10'){
            //alert('跳转'+response.config.url);
            window.location.href = FaceUrl.redirectUrl;
            
        }else{
            //console.log('请求成功'+response.config.url);
            return response
        }
       
    }else {
        //console.log('请求失败', response.data.code);
        return Promise.reject(response);
    }
}, error => {
    if (error.response) {
        switch (error.response.status) {
            case 401: 401
            window.parent.location.href = FaceUrl.cas_host+FaceUrl.api_host;
        }
    }
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
        return new Promise((resolve,reject)=>{
            
            axios({
                url:options.url,
                method:options.method,
                baseURL:baseApi,
                timeout:5000,
                data:options.data ? options.data : '',
                await : false,
                //params: options.data.params?options.data.params : '',
                headers: {'Content-Type': 'application/json;charset=UTF-8'},
            }).then((response)=>{
                if (options.data && options.data.isShowLoading !== false) {
                    loading = document.getElementById('ajaxLoading');
                    loading.style.display = 'none';
                }
                if (response.status == '200'){
                    let res = response.data;
                    resolve(res);
                   
                    //     //如果用户登录信息失效，跳转SSO登录
                    //    if(res.code == '1' && res.errorStatus != '10'){
                    //         Modal.info({
                    //             title:"提示",
                    //             content:res.message
                    //         })
                        
                    // }
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