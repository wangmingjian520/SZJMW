import React from 'react'
import Utils from '../../utils/utils'
import {Table} from 'antd'
import  "./index.less"
export default class ETable extends React.Component {

    state = {}
    //处理行点击事件
    onRowClick = (record, index) => {
        let rowSelection = this.props.rowSelection;
        if(rowSelection.type === 'checkbox'){
            let selectedRowKeys = this.props.selectedRowKeys;
            let selectedIds = this.props.selectedIds;
            let selectedItem = this.props.selectedItem || [];
            if (selectedIds) {
                const i = selectedIds.indexOf(record.kid);
                if (i === -1) {//避免重复添加
                    selectedIds.push(record.kid)
                    selectedRowKeys.push(index);
                    selectedItem.push(record);
                }else{
                    selectedIds.splice(i,1);
                    selectedRowKeys.splice(i,1);
                    selectedItem.splice(i,1);
                }
            } else {
                selectedIds = [record.kid];
                selectedRowKeys = [index]
                selectedItem = [record];
            }
            this.props.updateSelectedItem(selectedRowKeys,selectedItem || {},selectedIds);
        }else{
            let selectKey = [index];
            const selectedRowKeys = this.props.selectedRowKeys;
            if (selectedRowKeys && selectedRowKeys[0] === index){
                return;
            }
            this.props.updateSelectedItem(selectKey,record || {});
        }
    };

    // 选择框变更
    onSelectChange = (selectedRowKeys, selectedRows) => {
        let rowSelection = this.props.rowSelection;
        const selectedIds = [];
        if(rowSelection.type === 'checkbox'){
            selectedRows.map((item)=>{
                selectedIds.push(item.kid);
            });
            this.setState({
                selectedRowKeys,
                selectedIds:selectedIds,
                selectedItem: selectedRows
            });
        }
        this.props.updateSelectedItem(selectedRowKeys,selectedRows,selectedIds);
    };

    onSelectAll = (selected, selectedRows, changeRows) => {
        
    //    this.props.updateSelectedItem(selectKey,selectedRows[0] || {},selectedIds);
    }

    getOptions = () => {
        //let p = this.props;
        let row_selection = this.props.rowSelection;
        const { selectedRowKeys } = this.props;
        const rowSelection = {
            type: 'radio',
            selectedRowKeys,
            onChange: this.onSelectChange,
            onSelect:(record, selected, selectedRows)=>{
                console.log('...')
            },
            onSelectAll:this.onSelectAll
        };
        
        // 当属性为false或者null时，说明没有单选或者复选列
        if(row_selection===false || row_selection === null){
            row_selection = false;
        }else if(row_selection.type === 'checkbox'){
            //设置类型为复选框
            rowSelection.type = 'checkbox';
        }else{
            //默认为单选
            row_selection = 'radio';
        }
        return <Table 
                className="card-wrap page-table"
                //bordered 
                {...this.props}
                rowSelection={row_selection?rowSelection:null}
                onRow={(record,index) => ({
                    onClick: ()=>{
                        if(!row_selection){
                            return;
                        }
                        this.onRowClick(record,index)
                    }
                  })}
            />
    };
    render = () => {
        return (
            <div>
                {this.getOptions()}
            </div>
        )
    }
}