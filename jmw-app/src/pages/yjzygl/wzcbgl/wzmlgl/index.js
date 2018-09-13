import React from 'react';
import {  Button , Table ,Form , Breadcrumb , Modal , message ,Input ,Layout ,Select ,DatePicker} from  'antd';
import axios from '../../../axios'
import Utils from '../../utils/utils'
import ETable from '../../components/ETable/index'
import Moment from 'moment'
import { connect } from 'react-redux'
export default class Wzmlgl extends React.Component{
    state = {

    }

    params={
        currentPage:1,
        pageSize:10
    }

    requestList = ()=>{
        let _this =this;
        axios.requestList(_this,'/yjsjla/tableList',this.params);
    }

    render(){
        const colums = [
           {
               title:'物资类别',
               dateIndex:'id'
            },
            {
                title:'物资名称',
                dateIndex:'username'
             },
            {
                title:'测算标准',
                dateIndex:'username'
            },
            {
                title:'数量',
                dateIndex:'username'
            },
            {
                title:'规格品质要求',
                dateIndex:'username'
            }
        ]
        return (
            <div>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>首页</Breadcrumb.Item>
                    <Breadcrumb.Item>应急事件处理</Breadcrumb.Item>
                    <Breadcrumb.Item>应急事件立案</Breadcrumb.Item>
                </Breadcrumb>
                <Content className="content-wrap">
                    <div>
                    <span className="table_input ft">
                    <Select defaultValue="sjbh" style={{ width: 120 }} onChange={this.handleChange}>
                        <Option value="sjbh">应急事件编号</Option>
                        <Option value="infoTitle">信息标题</Option>
                        <Option value="Yiminghe">事件</Option>
                    </Select>
                        <Search style={{width: 300}}
                        placeholder="请输入标题内容"
                        onSearch={value => this.handleSearchTable(value)}
                        enterButton
                        />  
                    </span>
                    <span className="table_button ht">
                        <Button icon="plus" onClick={this.handleOpenAdd}>添加</Button>
                        <Button icon="form">修改</Button>
                        <Button icon="delete" onClick={this.handleDelete}>删除</Button>    
                    </span>   
                    </div>
                    
                    <ETable
                        columns={columns}
                        updateSelectedItem={Utils.updateSelectedItem.bind(this)}
                        selectedRowKeys={this.state.selectedRowKeys}
                        dataSource={this.state.list}
                        pagination={this.state.pagination}

                    />
                
                </Content>
                <Modal
                    title="添加"
                    visible={this.state.isShowOpenAdd}
                    onCancel={()=>{
                        this.addForm.props.form.resetFields();
                        this.setState({
                            isShowOpenAdd:false
                        })
                    }}
                    onOk={this.handleSubmit}
                >
                <OpenAddForm wrappedComponentRef={(inst)=>{this.addForm = inst;}}/>
                </Modal>
            </div>
            
        );
    }
}