import React from 'react';
import {  Button , Table ,Form , Breadcrumb , Modal , message ,Input ,Layout ,Select ,DatePicker} from  'antd';
import axios from './../../../../axios'
import Utils from './../../../../utils/utils'
import ETable from './../../../../components/ETable/index'
import moment from 'moment'
import { connect } from 'react-redux'

const Content = Layout;
const { TextArea ,Search} = Input;
const FormItem = Form.Item;
const Option = Select.Option;
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
        const columns = [
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
                    <Breadcrumb.Item>应急资源管理</Breadcrumb.Item>
                    <Breadcrumb.Item>物资储备管理</Breadcrumb.Item>
                    <Breadcrumb.Item>物资目录</Breadcrumb.Item>
                </Breadcrumb>
                <Content className="content-wrap">
                    <div>
                    <span className="table_input ft">
                    <Select defaultValue="sjbh" style={{ width: 120 }} onChange={this.handleChange}>
                        <Option value="sjbh">物资类别</Option>
                        <Option value="infoTitle">物资名称</Option>
                        <Option value="Yiminghe">测算标准</Option>
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
class OpenAddForm extends React.Component{
    render(){
        const formItemLayout = {
            labelCol:{
                span:6
            },
            wrapperCol:{
                span:18
            }
        }
        const { getFieldDecorator }  =this.props.form;
        return (
            <Form layout="horizontal">
               
                <FormItem label="应急事件编号" {...formItemLayout}>
                    {
                        getFieldDecorator('yjsjbh',{
                            initialValue:'',
                            rules:[
                                {
                                    required: true,
                                    message:'请选择应急事件编号'
                                }
                            ]
                        })(
                            <Select defaultValue=""  style={{ width: 200 }} >
                                <Option value="" >请选择应急事件编号</Option>
                                <Option value="1">编号1</Option>
                                <Option value="2">编号2</Option>
                            </Select>
                        )
                    }
                </FormItem>
                <FormItem label="信息标题" {...formItemLayout}>
                    {
                        getFieldDecorator('xxbt',{
                            initialValue:'',
                            rules:[
                                {
                                    required: true,
                                    message:'信息标题不能为空！'
                                }
                            ]
                        })
                         (<Input placeholder="请输入信息标题" />
                         )
                    }
                </FormItem>
                <FormItem label="事件" {...formItemLayout}>
                   { getFieldDecorator('sj',{
                            initialValue:'',
                            rules:[
                                {
                                    required: true,
                                    message:'信息标题不能为空！'
                                }
                            ]
                        })(
                        <Input placeholder="请输入事件" />
                        )
                    }

                </FormItem>
                <FormItem label="立案总结" {...formItemLayout}>
                    {
                        getFieldDecorator('zj',{
                            initialValue:'',
                            rules:[]
                        })(
                        <TextArea
                            autosize={{minRows:3}}
                            placeholder="请输入立案总结" 
                             />
                        )
                    }
                </FormItem>
                <FormItem label="立案时间" {...formItemLayout}>
                    {
                        getFieldDecorator('lasj',{
                            initialValue:moment('2018-09-09'),
                            rules:[]
                        })(
                        <DatePicker
                            showTime
                            format="YYYY-MM-DD"
                        />
                        )
                    }
                </FormItem>
            </Form>
        );
    }
}
OpenAddForm = Form.create({})(OpenAddForm);