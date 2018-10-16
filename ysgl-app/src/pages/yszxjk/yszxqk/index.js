import React from 'react';
import {  Button , Form ,  Breadcrumb , Modal , message ,Input , InputNumber , Layout ,Select ,DatePicker} from  'antd';
import axios from './../../../axios'
import Utils from './../../../utils/utils'
import ETable from './../../../components/ETable/index'
import moment from 'moment'
import FaceUrl from '../../../utils/apiAndInterfaceUrl'
import Dictionary from '../../../utils/dictionary'

const Content = Layout;
const { TextArea ,Search} = Input;
const FormItem = Form.Item;

export default class Yszxqk extends React.Component{
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
        axios.requestList(_this,FaceUrl.zxqkgl,FaceUrl.POST,FaceUrl.bdApi,this.params);
    }

    //查询
    handleSearchTable = (value)=>{
        let _this =this;
        this.params.query = {"searchInfo":value}
        axios.requestList(_this,FaceUrl.zxqkgl,FaceUrl.POST,FaceUrl.bdApi,this.params);
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
                url:FaceUrl.zxqkAdd,
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
                        url:FaceUrl.zxqkDel,
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
                title:'主管单位',
                dataIndex:'zgdw',
                key:'zgdw',
                align:'center',
                render:(zgdw,record)=>{
                   return <a  href="javascript:;" onClick={()=>{this.handleDetail(record)}}>{zgdw}</a>;
                   
               }
             },
             {
                title:'单位',
                dataIndex:'tbdw',
                key:'tbdw',
                align:'center'
            } ,
             {
                title:'项目名称',
                dataIndex:'xmname',
                key:'xmname',
                align:'center'
           } ,
             {
                 title:'年初预算(万元)',
                 dataIndex:'ncys',
                 key:'ncys',
                 align:'center'
             },
             {
                title:'追加预算(万元)',
                dataIndex:'zjys',
                key:'zjys',
                align:'center'
            },
            {
                title:'调整预算(万元)）',
                dataIndex:'tzys',
                key:'tzys',
                align:'center'
            },
            {
                title:'已执行预算数(万元)）',
                dataIndex:'yzxys',
                key:'yzxys',
                align:'center'
            },
            {
                title:'未执行预算数(万元)）',
                dataIndex:'wzxys',
                key:'wzxys',
                align:'center'
            },
             {
                 title:'填报人',
                 dataIndex:'tbr',
                 key:'tbr',
                 align:'center'
             },
             {
                title:'上报时间',
                dataIndex:'sbsj',
                key:'sbsj',
                align:'center',
                render(sbsj){
                    return moment(sbsj).format('YYYY-MM-DD')
                 }
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
                    <Breadcrumb.Item>预算执行与监控</Breadcrumb.Item>
                    <Breadcrumb.Item>预算执行情况</Breadcrumb.Item>
                </Breadcrumb>
                <Content className="content-wrap">
                    <div >
                    <span className="table_input ft">
                        <Search size="large" style={{width: 325}}
                        name="searchInfo"
                        placeholder="请输入项目名称/填报人/填报时间"
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
                 
                <FormItem label="主管单位" {...formItemLayout}>
                    {   
                        tableInfo && type=='detail'? tableInfo.zgdw: 
                        getFieldDecorator('zgdw',{
                            initialValue:tableInfo.zgdw ,
                            rules:[
                                {
                                    required: true,
                                    message:'请选择主管单位'
                                }
                            ]
                        })(
                            <Input placeholder="请输入主管单位" style={{ width: 280 }} />
                        )
                    }
                </FormItem>
                <FormItem label="单位" {...formItemLayout}>
                    {   
                        tableInfo && type=='detail'? tableInfo.tbdw: 
                        getFieldDecorator('tbdw',{
                            initialValue:tableInfo.tbdw ,
                            rules:[
                                {
                                    required: true,
                                    message:'请选择单位'
                                }
                            ]
                        })(
                            <Input placeholder="请输入单位" style={{ width: 280 }} />
                        )
                    }
                </FormItem>
                <FormItem label="项目名称" {...formItemLayout}>
                   { 
                       tableInfo && type=='detail'? tableInfo.xmname: 
                       getFieldDecorator('xmname',{
                            initialValue:tableInfo.xmname,
                            rules:[
                                {
                                    required: true,
                                    message:'项目名称不能为空！'
                                }
                            ]
                        })(
                        <Input placeholder="请输入项目名称" style={{ width: 280 }} />
                        )
                    }

                </FormItem>
                <FormItem label="年初预算(万元)" {...formItemLayout}>
                    {   
                        tableInfo && type=='detail'? tableInfo.ncys: 
                        getFieldDecorator('ncys',{
                            initialValue:tableInfo.ncys?tableInfo.ncys:'0',
                            rules:[]
                        })(
                        <InputNumber />    
                        
                        )
                    }
                </FormItem>
                <FormItem label="追加预算(万元)" {...formItemLayout}>
                    {   
                        tableInfo && type=='detail'? tableInfo.zjys: 
                        getFieldDecorator('zjys',{
                            initialValue:tableInfo.zjys?tableInfo.zjys:'0',
                            rules:[]
                        })(
                        <InputNumber />    
                        
                        )
                    }
                </FormItem>
                <FormItem label="调整预算(万元)" {...formItemLayout}>
                    {   
                        tableInfo && type=='detail'? tableInfo.tzys: 
                        getFieldDecorator('tzys',{
                            initialValue:tableInfo.tzys?tableInfo.tzys:'0',
                            rules:[]
                        })(
                        <InputNumber />    
                        
                        )
                    }
                </FormItem>
                <FormItem label="已执行预算数(万元)" {...formItemLayout}>
                    {   
                        tableInfo && type=='detail'? tableInfo.yzxys: 
                        getFieldDecorator('yzxys',{
                            initialValue:tableInfo.yzxys?tableInfo.yzxys:'0',
                            rules:[]
                        })(
                        <InputNumber />    
                        
                        )
                    }
                </FormItem>
                <FormItem label="未执行预算数(万元)" {...formItemLayout}>
                    {   
                        tableInfo && type=='detail'? tableInfo.wzxys: 
                        getFieldDecorator('wzxys',{
                            initialValue:tableInfo.wzxys?tableInfo.wzxys:'0',
                            rules:[]
                        })(
                        <InputNumber />    
                        
                        )
                    }
                </FormItem>
                <FormItem label="填报人" {...formItemLayout}>
                   { 
                       tableInfo && type=='detail'? tableInfo.tbr: 
                       getFieldDecorator('tbr',{
                            initialValue:tableInfo.tbr,
                            rules:[
                                {
                                    required: true,
                                    message:'填报人不能为空！'
                                }
                            ]
                        })(
                        <Input placeholder="请输入填报人" style={{ width: 280 }} />
                        )
                    }

                </FormItem>
                <FormItem label="上报时间" {...formItemLayout}>
                {   
                        tableInfo && type=='detail'? moment(tableInfo.sbsj).format('YYYY-MM-DD'): 
                        getFieldDecorator('sbsj',{
                         initialValue:moment(tableInfo.sbsj),
                     })
                         (<DatePicker  />
                         )
                    }
                </FormItem>
            </Form>
        );
    }
}
OpenFormTable = Form.create({})(OpenFormTable);