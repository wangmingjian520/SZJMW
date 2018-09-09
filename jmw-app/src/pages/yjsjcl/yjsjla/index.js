import React from 'react';
import {  Button , Table ,Form , Breadcrumb , Modal , message ,Input ,Layout ,Select ,DatePicker} from  'antd';
import axios from '../../../axios'
import Utils from '../../../utils/utils'
import moment from 'moment'
const Content = Layout;
const { TextArea ,Search} = Input;
// const Search = Input.Search;
const FormItem = Form.Item;
const Option = Select.Option;
export default class yjsjla extends React.Component{
    
    state={
        dataSource:[],
        isShowOpenAdd:false,
        isShowOpenEdit:false
    }

    params={
        page:1
    }
    componentDidMount(){
      this.requestList()
    }

    requestList = ()=>{
        // 原生用法
        // let baseApi = 'https://www.easy-mock.com/mock/5b922ca67d8f0d08304e7468/jmwapi';
        // axios.get(baseApi+'/yjsjla/tableList')
        //     .then(function (res) {
        //         console.log(JSON.stringify(res.data.result));
        //         this.setState({
        //             dateSource:res.data.result.list
        //         })
        //     })
        //     .catch(function (error) {
        //         console.log(error);
        //     })
        let _this =this;
        axios.ajax({
            url:'/yjsjla/tableList',
            data:{
                params: this.params,
                isShowLoading:true
            }
        }).then((res)=>{
            if(res.code == 0) {
                res.result.list.map((item,index)=>{
                    item.key = index;
                })
                this.setState({
                    dataSource:res.result.list,
                    selectedRowKeys:[],
                    selectedRows:null,
                    pagination:Utils.pagination(res,(current)=>{
                        _this.params.page = current;
                        this.requestList();
                    })
                })
            }
        })

    }
    
    onRowClick = (record,index)=>{
        let selectKey = [index];
        this.setState({
            selectedRowKeys : selectKey,
            selctedItem:record
        })

    }

    //查询
    handleSearchTable = (value)=>{
        let _this =this;
        axios.ajax({
            url:'/yjsjla/tableList',
            data:{
                params:{
                    searchInfo: value
                },
                isShowLoading:true
            }
        }).then((res)=>{
            if(res.code == 0) {
                res.result.list.map((item,index)=>{
                    item.key = index;
                })
                this.setState({
                    dataSource:res.result.list,
                    selectedRowKeys:[],
                    selectedRows:null,
                    pagination:Utils.pagination(res,(current)=>{
                        _this.params.page = current;
                        this.requestList();
                    })
                })
            }
        })
    }

    //打开新增
    handleOpenAdd =()=>{
        this.setState({
            isShowOpenAdd:true
        })
    }

    //提交
    handleSubmit =()=>{
        let _this =this;
        let addInfo = this.addForm.props.form.getFieldsValue();
        console.log(addInfo);
        if(addInfo){
            axios.ajax({
                url:'/yjsjla/tableAdd',
                data:{
                    params:{
                        addFromInfo:addInfo
                    },
                    isShowLoading:true
                }
            }).then((res)=>{
                if(res.code == 0) {
                    this.setState({
                        isShowOpenAdd:false
                    })
                    message.success(res.message);
                    this.requestList();
                }
            })
        }
    }

    //删除操作
    handleDelete = ()=>{
        let rows = this.state.selectedRows;
        let ids = [];
        if(rows){
            rows.map((item)=>{
                ids.push(item.id)
            })
            Modal.confirm({
                title:'提示',
                content:`您确定要删除 ${ids.join(',')}`,
                onOk:()=>{
                    message.success('删除成功');
                }
            })
        }else{
            message.error('请选择需要删除项！');
        }
    }

    render(){
        const columns = [
           {
               title:'序号',
               dataIndex:'id',
               align:'center'
            },
            {
                title:'应急事件编号',
                dataIndex:'yjsjbh',
                align:'center'
             },
            {
                title:'信息标题',
                dataIndex:'xxbt',
                align:'center'
            },
            {
                title:'事件',
                dataIndex:'sj',
                align:'center'
            },
            {
                title:'立案总结',
                dataIndex:'lazj',
                align:'center'
            },
            {
                title:'立案时间',
                dataIndex:'latime',
                align:'center'
            }
        ]
        const selectedRowKeys =this.state.selectedRowKeys
        //单选框
        // const rowSelection = {
        //     type: 'redio',
        //     selectedRowKeys
        // }
        //多选框
        const rowCheckSelection = {
            type: 'checkBox',
            selectedRowKeys,
            onChange:(selectedRowKeys,selectedRows)=>{
                let ids = [];
                selectedRows.map((item)=>{
                    ids.push(item.id)
                })
                this.setState({
                    selectedRowKeys,
                    selectedRows,
                    selectedIds:ids
                })
            }
        }
        
        return (
            <div>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>首页</Breadcrumb.Item>
                    <Breadcrumb.Item>应急管理</Breadcrumb.Item>
                    <Breadcrumb.Item>应急资源管理</Breadcrumb.Item>
                </Breadcrumb>
                <Content className="content-wrap">
                    <div>
                    <span className="table_input ft">
                        <Search style={{width: 200}}
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
                    
                    <Table
                        // bordered
                        columns={columns}
                        dataSource={this.state.dataSource}
                        pagination={this.state.pagination}
                       
                        rowSelection={rowCheckSelection}
                        onRow={(record,index)=>{
                            return {
                                onClick: () =>{
                                    this.onRowClick(record,index);
                                }
                            };
                        }}
                        
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
                            <Select defaultValue=""  style={{ width: 200 }}>
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