import React from 'react';
import { Button , Form , Breadcrumb , Modal , message ,Input  , Layout , Select , DatePicker } from  'antd';
import axios from '../../../../axios'
import Utils from '../../../../utils/utils'
import ETable from '../../../../components/ETable'
import moment from 'moment'
import FaceUrl from '../../../../utils/apiAndInterfaceUrl'
import Dictionary from '../../../../utils/dictionary'

const Content = Layout;
const { TextArea,Search } = Input;
const FormItem = Form.Item;
const Option = Select.Option;
export default class Yjzhbgl extends React.Component{
    state={
        dataSource:[],
        footer:'',
    }

    params={
        currentPage:1,
        pageSize:10,
        query:{},
    }

    componentDidMount(){
      this.requestList()
    }

    requestList = ()=>{
        let _this =this;
        axios.requestList(_this,FaceUrl.jyzhbgl,FaceUrl.POST,FaceUrl.bdApi,this.params);
    }

    //查询
    handleSearchTable = (value)=>{
        let _this =this;
        this.params.query = {"searchInfo":value}
        axios.requestList(_this,FaceUrl.jyzhbgl,FaceUrl.POST,FaceUrl.bdApi,this.params);
    }

    //打开添加编辑
    handleOperate =(type)=>{
        let item = this.state.selectedItem
        if(type==='add'){
            this.setState({
                type:type,
                isVisible:true,
                title:'添加'
           })
        }else if(type==='edit'){
            if(item&&item.length==1){
                this.setState({
                    type:type,
                    isVisible:true,
                    title:'修改',
                    tableInfo:item[0]
               })  
            }else{
                message.error('请选择一条需要修改的项！');
                
            }
        }
    }

    //打开详情
    handleDetail = (value)=>{
        this.setState({
            type:"detail",
            isVisible:true,
            title:'查看详情',
            tableInfo:value,
       })  
    }
    //关闭详情
    handleCancel = () => {
        this.setState({ 
            isVisible: false,
            tableInfo:{} 
        });
        this.requestList(); 
    }

    //提交
    handleSubmit =()=>{
        let type = this.state.type;
        const form = this.modalForm.props.form;
        form.validateFields((err, values) => {
        if (err) {
            return;
        }
        //console.log('form: ', values);
            let message = "";
            if(type=="add"){
                message="添加成功";
            }if(type=="edit"){
                message="修改成功";
            }
            //提交or修改
            axios.ajax({
                url:FaceUrl.jyzhbAdd,
                method:FaceUrl.POST,
                baseApi:FaceUrl.bdApi,
                data:{
                    ...values,
                    isShowLoading:true
                }
            }).then((res)=>{
                if(res.code == '1') {
                    form.resetFields();
                    this.setState({ 
                        isVisible: false,
                        tableInfo:{}  
                    });
                    this.requestList();
                    message.success(message);
                }
            })
        });
    }

    //删除操作
    handleDelete = ()=>{
        let rows = this.state.selectedItem;
        let ids = [];
        if(rows&&rows.length){
            rows.map((item)=>{
                ids.push(item.kid)
            })
            Modal.confirm({
                title:'提示',
                content:`您确定要删除这${ids.length}项吗？`,
                onOk:()=>{
                    axios.ajax({
                        url:FaceUrl.jyzhbDel,
                        method:FaceUrl.POST,
                        baseApi:FaceUrl.bdApi,
                        data:ids
                    }).then((res)=>{
                        if(res.code == '1') {
                            this.requestList();
                            message.success('删除成功！');
                        }
                    })
                   
                }
            })
        }else{
            message.error('请选择需要删除的项！');
        }
    }

    
    render(){
        const columns = [
            {
                 title:'指挥部名称',
                 dataIndex:'zhbName',
                 key:'zhbName',
                 align:'center',
                 render:(zhbName,record)=>{
                    let config = Dictionary.yjzhbType
                     return <a  href="javascript:;" onClick={()=>{this.handleDetail(record)}}>{config[zhbName]}</a>;
                }
             },
             {
                title:'指挥部代码',
                dataIndex:'zhbCode',
                key:'zhbCode',
                align:'center',
            },
             {
                 title:'负责人',
                 dataIndex:'zrrName',
                 key:'zrrName',
                 align:'center',
            },
             {
                 title:'联系电话',
                 dataIndex:'zrrTel',
                 key:'zrrTel',
                 align:'center',
            },
            {
                title:'应急负责人',
                dataIndex:'yjName',
                key:'yjName',
                align:'center',
            },
            {
                title:'联系电话',
                dataIndex:'yjTel',
                key:'yjTel',
                align:'center',
            }
         ]
        let footer = {}
        if(this.state.type=='detail'){
            footer={
               footer: <Button key="关闭" onClick={this.handleCancel.bind(this)}>关闭</Button>,
            }
            
        }

        //多选框
        const rowSelection = {
            type: 'checkbox',
        }

        return (
            <div>
                <Breadcrumb separator=">" style={{ margin: '16px 20px' }}>
                    <Breadcrumb.Item>首页</Breadcrumb.Item>
                    <Breadcrumb.Item>应急资源管理</Breadcrumb.Item>
                    <Breadcrumb.Item>应急组织体系</Breadcrumb.Item>
                    <Breadcrumb.Item>应急指挥部管理</Breadcrumb.Item>
                </Breadcrumb>
                <Content className="content-wrap">
                    <div >
                    <span className="table_input ft">
                        <Search size="large" style={{width: 325}}
                        name="searchInfo"
                        placeholder="请输入指挥部代码/负责人"
                        onSearch={value => this.handleSearchTable(value)}
                        enterButton
                        />  
                    </span>
                    <span className="table_button ht" >
                        <Button icon="plus" ghost type="primary" onClick={()=>{this.handleOperate('add')}}>添加</Button>
                        <Button icon="form" ghost type="primary" onClick={()=>{this.handleOperate('edit')}}>修改</Button>
                        <Button icon="delete" ghost type="primary" onClick={this.handleDelete}>删除</Button>    
                    </span>   
                    </div>        
                    <ETable
                        columns={columns}
                        updateSelectedItem={Utils.updateSelectedItem.bind(this)}
                        dataSource={this.state.list}
                        selectedRowKeys={this.state.selectedRowKeys}
                        selectedIds={this.state.selectedIds}
                        selectedItem={this.state.selectedItem}
                        rowSelection={rowSelection}
                        pagination={this.state.pagination}
                    />

                </Content>
                <Modal
                    title={this.state.title}
                    visible={this.state.isVisible}
                    onCancel={()=>{
                        this.modalForm.props.form.resetFields();
                        this.setState({
                            isVisible:false,
                            tableInfo:[],
                            type:''
                        })
                    }}
                    {...footer}
                    onOk={this.handleSubmit}
                >
                <OpenFormTable type={this.state.type} tableInfo={this.state.tableInfo}
                 wrappedComponentRef={(inst)=>{this.modalForm = inst;}}/>
                </Modal>
            </div>
            
        );
    }
}
class OpenFormTable extends React.Component{
    render(){
        let type = this.props.type ;
        let tableInfo =this.props.tableInfo || {};
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
                    {   
                        getFieldDecorator('kid',{
                            initialValue:tableInfo.kid,
                        })
                         (<Input type="hidden" />
                         )
                    }
                <FormItem label="应急指挥部" {...formItemLayout}>
                    {   
                        tableInfo && type=='detail'? tableInfo.zhbName: 
                        getFieldDecorator('zhbName',{
                            initialValue:tableInfo.zhbName ? tableInfo.zhbName : '1',
                            rules:[
                                {
                                    required: true,
                                    message:'请选择应急指挥部'
                                }
                            ]
                        })(
                            <Select style={{ width: 200 }} >
                                <Option value="1">市电力事故应急指挥部</Option>
                                <Option value="2">市通讯保障应急指挥部</Option>
                                <Option value="3">市重大动物疫情应急指挥部</Option>
                                <Option value="4">市网络与信息安全突发事件应急指挥部</Option>
                                <Option value="5">市生活必需品突发事件应急指挥部</Option>
                                <Option value="6">市成品油市场供应应急指挥部</Option>
                            </Select>
                        )
                    }
                </FormItem>
                <FormItem label="指挥部代码" {...formItemLayout}>
                    {   
                        tableInfo && type=='detail'? tableInfo.zhbCode: 
                        getFieldDecorator('zhbCode',{
                            initialValue:tableInfo.zhbCode,
                            rules:[
                                {
                                    required: true,
                                    message:'指挥部代码不能为空！'
                                }
                            ]
                        })
                         (<Input placeholder="请输入指挥部代码" />
                         )
                    }
                </FormItem>
                <FormItem label="负责人" {...formItemLayout}>
                    {   
                        tableInfo && type=='detail'? tableInfo.zrrName: 
                        getFieldDecorator('zrrName',{
                            initialValue:tableInfo.zrrName, 
                            rules:[
                                {
                                    required: true,
                                    message:'请输入负责人'
                                }
                            ]
                        })(
                            <Input placeholder="请输入负责人" />
                        )
                    }
                </FormItem>
                <FormItem label="联系电话" {...formItemLayout}>
                   { 
                       tableInfo && type=='detail'? tableInfo.zrrTel: 
                       getFieldDecorator('zrrTel',{
                        initialValue:tableInfo.zrrTel,
                    })
                        (<Input placeholder="请输入联系电话" />
                        )
                    }

                </FormItem>
                <FormItem label="应急负责人" {...formItemLayout}>
                    {   
                        tableInfo && type=='detail'? tableInfo.yjName: 
                        getFieldDecorator('yjName',{
                            initialValue:tableInfo.yjName,
                            rules:[]
                        })( 
                            <Input placeholder="请输入应急负责人" />
                        )
                    }
                </FormItem>
                <FormItem label="联系电话" {...formItemLayout}>
                    {   
                        tableInfo && type=='detail'? tableInfo.yjTel: 
                        getFieldDecorator('yjTel',{
                            initialValue:tableInfo.yjTel,
                    })
                        (<Input placeholder="请输入联系电话" />
                        )
                    }
                </FormItem>
            </Form>
        );
    }
}
OpenFormTable = Form.create({})(OpenFormTable);