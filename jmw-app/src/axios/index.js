import JsonP from 'jsonp'
import axios from 'axios'
import Utils from './../utils/utils'
import { Modal } from 'antd'
export default class Axios {
    static requestList(_this,url,params){
        var data = {
            params:params
        }
        this.ajax({
            url:url,
            data:data
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
                    pagination:Utils.pagination(data,(current)=>{
                        _this.params.page = current;
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
                if (response.status == 'success') {
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
        let baseApi = 'https://www.easy-mock.com/mock/5b922ca67d8f0d08304e7468/jmwapi';
        return new Promise((resolve,reject)=>{
            axios({
                url:options.url,
                method:'get',
                baseURL:baseApi,
                timeout:5000,
                params: (options.data && options.data.params) || ''
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
            })
        });
    }
}