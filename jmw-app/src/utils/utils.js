import React from 'react';
import {Select} from 'antd';

const Option = Select.Option;
export default {

    pagination(data,callback){
        return {
            onChange:(current)=>{
                callback(current)
            },
            current:data.data.current_page,
            pageSise:data.data.page_size,
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
    }
}