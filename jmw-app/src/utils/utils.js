import React from 'react';
import {Select} from 'antd';

const Option = Select.Option;
export default {
    /**
     * 格式化日期
     * @param {*日期} time 
     */
    formateDate(time){
        if(!time)return '';
        let date = new Date(time);
        return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
    },
    /**
     * 格式化翻页控件
     * @param {*收到的数据} data 
     * @param {*返回的数据} callback 
     */
    pagination(data,callback){
        return {
            onChange:(current)=>{
                callback(current)
            },
            current:data.data.currentPage,
            pageSise:data.data.pageSize,
            total:data.data.total,
            showTotal:()=>{
                return `共${data.data.total}条`
            },
            showQuickJumper:true

        }
    },
    getOptionList(data){
        if(!data){
            return [];
        }
        let options = [];
        data.map((item)=>{
            options:PushManager(<Option value={item.id} key={item.id}>{item.name}</Option>)
        })
    },
    /**
     * ETable 行点击通用函数
     * @param {*选中行的索引} selectedRowKeys
     * @param {*选中行对象} selectedItem
     */
    updateSelectedItem(selectedRowKeys, selectedRows, selectedIds) {
        if (selectedIds) {
            this.setState({
                selectedRowKeys,
                selectedIds: selectedIds,
                selectedItem: selectedRows
            })
        } else {
            this.setState({
                selectedRowKeys,
                selectedItem: selectedRows
            })
        }
    },
}
