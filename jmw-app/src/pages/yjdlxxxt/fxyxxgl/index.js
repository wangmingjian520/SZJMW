import React from 'react';
import {  Button , Form ,  Breadcrumb , Modal , message ,Input , InputNumber , Layout ,Select ,DatePicker} from  'antd';
import axios from '../../../axios'
import Utils from '../../../utils/utils'
import ETable from '../../../components/ETable'
import moment from 'moment'
import FaceUrl from '../../../utils/apiAndInterfaceUrl'
import Dictionary from '../../../utils/dictionary'

const Content = Layout;
const { TextArea ,Search} = Input;
const FormItem = Form.Item;
const Option = Select.Option;
export default class Fxyxxgl extends React.Component{
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
        axios.requestList(_this,FaceUrl.fxyxgl,FaceUrl.POST,FaceUrl.bdApi,this.params);
    }

    //查询
    handleSearchTable = (value)=>{
        let _this =this;
        this.params.query = {"searchInfo":value}
        axios.requestList(_this,FaceUrl.fxyxgl,FaceUrl.POST,FaceUrl.bdApi,this.params);
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
                url:FaceUrl.fxyAdd,
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
                        url:FaceUrl.fxyDel,
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
                 title:'风险源名称',
                 dataIndex:'fxyName',
                 key:'fxyName',
                 align:'center',
                 render:(fxyName,record)=>{
                     return <a  href="javascript:;" onClick={()=>{this.handleDetail(record)}}>{fxyName}</a>;
                }
             },
             {
                title:'风险类别',
                dataIndex:'fxType',
                key:'fxType',
                align:'center',
               
             },
             {
                 title:'单位',
                 dataIndex:'dw',
                 key:'dw',
                 align:'center',
            },
            {
                title:'人数',
                dataIndex:'rsNum',
                key:'rsNum',
                align:'center',
           },
             {
                 title:'责任单位',
                 dataIndex:'zrdw',
                 key:'zrdw',
                 align:'center'
             },
             {
                 title:'责任人',
                 dataIndex:'zrr',
                 key:'zrr',
                 align:'center'
             },
             {
                title:'管控措施',
                dataIndex:'gkcs',
                key:'gkcs',
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
                    <Breadcrumb.Item>应急地理信息系统</Breadcrumb.Item>
                    <Breadcrumb.Item>风险源信息管理</Breadcrumb.Item>
                </Breadcrumb>
                <Content className="content-wrap">
                    <div >
                    <span className="table_input ft">
                        <Search size="large" style={{width: 325}}
                        name="searchInfo"
                        placeholder="请输入风险源名称/单位/责任人"
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
                <FormItem label="风险源名称" {...formItemLayout}>
                    {   
                        tableInfo && type=='detail'? tableInfo.fxyName: 
                        getFieldDecorator('fxyName',{
                            initialValue:tableInfo.fxyName,
                            rules:[
                                {
                                    required: true,
                                    message:'风险源名称不能为空！'
                                }
                            ]
                        })
                         (<Input placeholder="请输入风险源名称" maxlength="100"/>
                         )
                    }
                </FormItem>
                <FormItem label="风险类别" {...formItemLayout}>
                    {   
                        tableInfo && type=='detail'? tableInfo.fxType: 
                        getFieldDecorator('fxType',{
                            initialValue:tableInfo.fxType,
                            rules:[
                                {
                                    required: true,
                                    message:'请输入风险类别'
                                }
                            ]
                        })(
                            <Input placeholder="请输入风险类别" maxlength="20"/>
                        )
                    }
                </FormItem>
                <FormItem label="单位" {...formItemLayout}>
                   { 
                       tableInfo && type=='detail'? tableInfo.dw: 
                       getFieldDecorator('dw',{
                        initialValue:tableInfo.dw,
                    })
                        (<Input placeholder="请输入单位" maxlength="200"/>
                        )
                    }

                </FormItem>
                <FormItem label="人数" {...formItemLayout}>
                   { 
                       tableInfo && type=='detail'? tableInfo.rsNum: 
                       getFieldDecorator('rsNum',{
                            initialValue:tableInfo.rsNum,
                            
                        })(
                        <InputNumber placeholder="请输入人数" style={{ width: 200 }}/>
                        )
                    }

                </FormItem>
                <FormItem label="经度" {...formItemLayout}>
                   { 
                       tableInfo && type=='detail'? tableInfo.longitude: 
                       getFieldDecorator('longitude',{
                            initialValue:tableInfo.longitude,
                            
                        })(
                        <InputNumber placeholder="请输入经度" style={{ width: 200 }}/>
                        )
                    }

                </FormItem>
                <FormItem label="纬度" {...formItemLayout}>
                   { 
                       tableInfo && type=='detail'? tableInfo.latitude: 
                       getFieldDecorator('latitude',{
                            initialValue:tableInfo.latitude,
                            
                        })(
                        <InputNumber placeholder="请输入纬度" style={{ width: 200 }}/>
                        )
                    }

                </FormItem>
                <FormItem label="责任单位" {...formItemLayout}>
                    {   
                        tableInfo && type=='detail'? tableInfo.zrdw: 
                        getFieldDecorator('zrdw',{
                            initialValue:tableInfo.zrdw,
                            rules:[]
                        })(
                            <Input placeholder="请输入责任单位" maxlength="200"/>
                        )
                    }
                </FormItem>
                 <FormItem label="责任人" {...formItemLayout}>
                    {   
                        tableInfo && type=='detail'? tableInfo.zrr: 
                        getFieldDecorator('zrr',{
                            initialValue:tableInfo.zrr,
                            rules:[]
                        })(
                            <Input placeholder="请输入责任人" maxlength="20"/>
                        )
                    }
                </FormItem>
                <FormItem label="管控措施" {...formItemLayout}>
                            {   
                                tableInfo && type=='detail'? tableInfo.gkcs:
                                getFieldDecorator('gkcs',{
                                    initialValue:tableInfo.gkcs,
                                    rules:[]
                                })(
                                <TextArea
                                autosize={{minRows:2}}
                                placeholder="请输入管控措施" 
                                    />
                                )
                            }
                </FormItem>
            </Form>
        );
    }
}
OpenFormTable = Form.create({})(OpenFormTable);