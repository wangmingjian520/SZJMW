import React from 'react';
import {Select} from 'antd';

const Option = Select.Option;
export default {

    pagination(data,callback){
        return {
            onChange:(current)=>{
                callback(current)
            },
            current:data.result.page,
            pageSise:data.result.page_size,
            total:data.result.total_count,
            showTotal:()=>{
                return `共${data.result.total_count}条`
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
    }
}