import React from 'react';
import { Button , Form , Breadcrumb , Modal , message ,Input  , Layout , Select , DatePicker } from  'antd';
import axios from '../../../../../axios'
import Utils from '../../../../../utils/utils'
import ETable from '../../../../../components/ETable'
import moment from 'moment'
import FaceUrl from '../../../../../utils/apiAndInterfaceUrl'

const Content = Layout;
const { TextArea,Search } = Input;
const FormItem = Form.Item;
const Option = Select.Option;
export default class Jczggl extends React.Component{
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
        axios.requestList(_this,FaceUrl.zgqkgl,FaceUrl.POST,FaceUrl.bdApi,this.params);
    }

    //查询
    handleSearchTable = (value)=>{
        let _this =this;
        this.params.query = {"searchInfo":value}
        axios.requestList(_this,FaceUrl.zgqkgl,FaceUrl.POST,FaceUrl.bdApi,this.params);
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
                url:FaceUrl.zgqkAdd,
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
                        url:FaceUrl.zgqkDel,
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
                 title:'企业名称',
                 dataIndex:'entName',
                 key:'entName',
                 align:'center',
                 render:(entName,record)=>{
                     return <a  href="javascript:;" onClick={()=>{this.handleDetail(record)}}>{entName}</a>;
                }
             },
             {
                title:'被检查单位及库点',
                dataIndex:'bjcDw',
                key:'bjcDw',
                align:'center',
            },
            {
                title:'企业负责人',
                dataIndex:'qyfzr',
                key:'qyfzr',
                align:'center',
           },
             {
                 title:'联系人',
                 dataIndex:'linkName',
                 key:'linkName',
                 align:'center',
            },
            {
                title:'联系电话',
                dataIndex:'linkTel',
                key:'linkTel',
                align:'center',
            },
            {
                title:'填报日期',
                dataIndex:'tbDate',
                key:'tbDate',
                align:'center',
                render(tbDate){
                   return moment(tbDate).format('YYYY-MM-DD')
                }
           },
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
                    <Breadcrumb.Item>物资储备管理</Breadcrumb.Item>
                    <Breadcrumb.Item>物资储备检查</Breadcrumb.Item>
                    <Breadcrumb.Item>问题整改</Breadcrumb.Item>
                </Breadcrumb>
                <Content className="content-wrap">
                    <div >
                    <span className="table_input ft">
                        <Search size="large" style={{width: 325}}
                        name="searchInfo"
                        placeholder="请输入企业名称/负责人/联系人"
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
                <FormItem label="企业名称" {...formItemLayout}>
                    {   
                        tableInfo && type=='detail'? tableInfo.entName: 
                        getFieldDecorator('entName',{
                            initialValue:tableInfo.entName,
                            rules:[
                                {
                                    required: true,
                                    message:'企业名称不能为空！'
                                }
                            ]
                        })
                         (<Input placeholder="请输入企业名称" />
                         )
                    }
                </FormItem>
                <FormItem label="被检查单位及库点" {...formItemLayout}>
                    {   
                        tableInfo && type=='detail'? tableInfo.bjcDw: 
                        getFieldDecorator('bjcDw',{
                            initialValue:tableInfo.bjcDw, 
                            rules:[
                                {
                                    required: true,
                                    message:'请输入被检查单位及库点'
                                }
                            ]
                        })(
                            <Input placeholder="请输入被检查单位及库点" />
                        )
                    }
                </FormItem>
                <FormItem label="企业负责人 " {...formItemLayout}>
                   { 
                       tableInfo && type=='detail'? tableInfo.qyfzr: 
                       getFieldDecorator('qyfzr',{
                        initialValue:tableInfo.qyfzr,
                    })
                        (<Input placeholder="请输入企业负责人 " />
                        )
                    }

                </FormItem>
                <FormItem label="联系人" {...formItemLayout}>
                   { 
                       tableInfo && type=='detail'? tableInfo.linkName: 
                       getFieldDecorator('linkName',{
                        initialValue:tableInfo.linkName,
                    })
                        (<Input placeholder="请输入联系人" />
                        )
                    }

                </FormItem>
                
                <FormItem label="联系电话" {...formItemLayout}>
                    {   
                        tableInfo && type=='detail'? tableInfo.linkTel: 
                        getFieldDecorator('linkTel',{
                            initialValue:tableInfo.linkTel,
                    })
                        (<Input placeholder="请输入联系电话" />
                        )
                    }
                </FormItem>
                <FormItem label="填报日期" {...formItemLayout}>
                    {   
                        tableInfo && type=='detail'? tableInfo.tbDate: 
                        getFieldDecorator('tbDate',{
                            initialValue:moment(tableInfo.tbDate),
                            rules:[]
                        })( <DatePicker  />
                            
                        )
                    }
                </FormItem>
            </Form>
        );
    }
}
OpenFormTable = Form.create({})(OpenFormTable);