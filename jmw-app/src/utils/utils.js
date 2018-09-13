import React from 'react';
import {Select} from 'antd';

const Option = Select.Option;
export default {

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
