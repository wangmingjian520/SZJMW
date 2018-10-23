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
const Option = Select.Option;
export default class Bmysjjfl extends React.Component{
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
      this.requestList();
      this.handleZfysfl();
    }

    requestList = ()=>{
        let _this =this;
        axios.requestList(_this,FaceUrl.depysjjflgl,FaceUrl.POST,FaceUrl.bdApi,this.params);
    }

    //查询
    handleSearchTable = (value)=>{
        let _this =this;
        this.params.query = {"searchInfo":value}
        axios.requestList(_this,FaceUrl.depysjjflgl,FaceUrl.POST,FaceUrl.bdApi,this.params);
    }
    //请求政府预算分类科目
    handleZfysfl = ()=>{
        axios.ajax({
            url:FaceUrl.zfysjjflList,
            method:FaceUrl.POST,
            baseApi:FaceUrl.bdApi
        }).then((res)=>{
            if(res.code == '1') {
                this.setState({ 
                    zfysjjflList:res.data  
                });
            }
        })
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
                url:FaceUrl.depysjjflAdd,
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
                ids.push(item.jjkmCode)
            })
            Modal.confirm({
                title:'提示',
                content:`您确定要删除这${ids.length}项吗？`,
                onOk:()=>{
                    axios.ajax({
                        url:FaceUrl.depysjjflDel,
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
                 title:'预算经济分类编号',
                 dataIndex:'jjkmCode',
                 key:'jjkmCode',
                 align:'center',
                 render:(jjkmCode,record)=>{
                     return <a  href="javascript:;" onClick={()=>{this.handleDetail(record)}}>{jjkmCode}</a>;
                }
             },
             {
                title:'预算经济分类名称',
                dataIndex:'jjkmName',
                key:'jjkmName',
                align:'center'
             },
             {
                 title:'测算标准',
                 dataIndex:'csbz',
                 key:'csbz',
                 align:'center'
             },
             {
                 title:'对应政府预算经济分类科目编码',
                 dataIndex:'govCode',
                 key:'govCode',
                 align:'center'
             },
             {
                 title:'对应政府预算经济分类科目编码',
                 dataIndex:'govName',
                 key:'govName',
                 align:'center'
             },
             {
                title:'所属类目编码',
                dataIndex:'lmCode',
                key:'lmCode',
                align:'center'
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
                    <Breadcrumb.Item>预算经济分类</Breadcrumb.Item>
                    <Breadcrumb.Item>部门预算经济分类科目</Breadcrumb.Item>
                </Breadcrumb>
                <Content className="content-wrap">
                    <div >
                    <span className="table_input ft">
                        <Search size="large" style={{width: 325}}
                        name="searchInfo"
                        placeholder="请输入预算经济分类编号/名称"
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
                <OpenFormTable type={this.state.type} tableInfo={this.state.tableInfo} zfysjjflList={this.state.zfysjjflList} 
                 wrappedComponentRef={(inst)=>{this.modalForm = inst;}}/>
                </Modal>
            </div>
            
        );
    }
}
class OpenFormTable extends React.Component{
    state = {
        zfysjjflList:this.props.zfysjjflList,
        zfysjjflCode:this.props.zfysjjflList[0].jjkmCode
    } 
    componentDidMount(){
        let type = this.props.type ;
        let tableInfo =this.props.tableInfo || {};
        if(type == 'edit' && tableInfo){
            this.setState({
                zfysjjflCode:tableInfo.govCode
            });
        }
      }
    handlejjkmNameChange = (value) => {
        
         let  zfysjjflList = this.state.zfysjjflList ;
         let  zfysjjflCode ='';
        for(var i=0;i<zfysjjflList.length;i++){
            if (zfysjjflList[i].jjkmName.indexOf(value) !== -1) {
                zfysjjflCode=zfysjjflList[i].jjkmCode;
            }
        }
        this.setState({
            zfysjjflCode:zfysjjflCode
        });
      }
     
    render(){
         
        let type = this.props.type ;
        let tableInfo =this.props.tableInfo || {};
        let zfysjjflCode=this.state.zfysjjflCode;
         
        let  zfysjjflList = this.state.zfysjjflList ;
        const formItemLayout = {
            labelCol:{
                span:8
            },
            wrapperCol:{
                span:14
            }
        }
        const { getFieldDecorator }  =this.props.form;
        return (
            <Form layout="horizontal">
                    {   
                        getFieldDecorator('govCode',{
                            initialValue: zfysjjflCode,
                        })
                         (<Input type="hidden" />
                         )
                    }
                <FormItem label="预算经济分类编号" {...formItemLayout}>
                    {   
                        tableInfo && type=='detail'? tableInfo.jjkmCode: 
                        getFieldDecorator('jjkmCode',{
                            initialValue:tableInfo.jjkmCode,
                            rules:[
                                {
                                    required: true,
                                    message:'预算经济分类编号不能为空！'
                                }
                            ]
                        })
                         (   <Input placeholder="请输入预算经济分类编号" />
                         )
                    }
                </FormItem>
                <FormItem label="预算经济分类名称" {...formItemLayout}>
                    {   
                        tableInfo && type=='detail'? tableInfo.jjkmName: 
                        getFieldDecorator('jjkmName',{
                            initialValue:tableInfo.jjkmName,
                            rules:[
                                {
                                    required: true,
                                    message:'预算经济分类名称不能为空！'
                                }
                            ]
                        })
                         (<Input placeholder="请输入预算经济分类名称" />
                         )
                    }
                </FormItem>
                <FormItem label="排序号" {...formItemLayout}>
                    {   
                        tableInfo && type=='detail'? tableInfo.tabindex: 
                        getFieldDecorator('tabindex',{
                            initialValue:tableInfo.tabindex,
                            rules:[]
                        })(
                        <InputNumber />    
                        
                        )
                    }
                </FormItem>
                
                 
                <FormItem label="政府预算经济分类名称" {...formItemLayout}>
                    {   
                        tableInfo && type=='detail'? tableInfo.govName: 
                        getFieldDecorator('govName',{
                            initialValue:tableInfo.govName? tableInfo.govName:zfysjjflList[0].jjkmName,
                            rules:[]
                        })(
                            <Select  style={{ width: 236 }} onChange={this.handlejjkmNameChange}>
                            {zfysjjflList.map(item => <Option key={item.jjkmName}>{item.jjkmName}</Option>)}
                          </Select>
                        )
                    }
                </FormItem>
                <FormItem label="测算标准" {...formItemLayout}>
                   { 
                       tableInfo && type=='detail'? tableInfo.csbz: 
                       getFieldDecorator('csbz',{
                            initialValue:tableInfo.csbz,
                            rules:[]
                        })(
                            <TextArea
                            autosize={{minRows:3}}
                                />
                        )
                    }

                </FormItem>
            </Form>
        );
    }
}
OpenFormTable = Form.create({})(OpenFormTable);