import React from 'react';
import {  Button , Form ,  Breadcrumb , Modal , message ,Input , InputNumber , Layout ,Select ,DatePicker} from  'antd';
import axios from './../../../../../axios'
import Utils from './../../../../../utils/utils'
import ETable from './../../../../../components/ETable/index'
import moment from 'moment'
import FaceUrl from '../../../../../utils/apiAndInterfaceUrl'

const Content = Layout;
const { Search } = Input;
const FormItem = Form.Item;
const Option = Select.Option;
export default class Fwjggl extends React.Component{
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
        axios.requestList(_this,FaceUrl.fwjggl,FaceUrl.POST,FaceUrl.bdApi,this.params);
    }

    //查询
    handleSearchTable = (value)=>{
        let _this =this;
        this.params.query = {"searchInfo":value}
        axios.requestList(_this,FaceUrl.fwjggl,FaceUrl.POST,FaceUrl.bdApi,this.params);
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
                url:FaceUrl.fwjgAdd,
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
                        url:FaceUrl.fwjgDel,
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
                 title:'单位名称',
                 dataIndex:'dwName',
                 key:'dwName',
                 align:'center',
                 render:(dwName,record)=>{
                     return <a  href="javascript:;" onClick={()=>{this.handleDetail(record)}}>{dwName}</a>;
                }
             },
             {
                title:'物资目录分类',
                dataIndex:'dirType',
                key:'dirType',
                align:'center',
            },
             {
                 title:'资质有限期',
                 dataIndex:'limtDate',
                 key:'limtDate',
                 align:'center',
                 render(limtDate){
                    return moment(limtDate).format('YYYY-MM-DD')
                 }
             },
             {
                 title:'年度审核',
                 dataIndex:'shflag',
                 key:'shflag',
                 align:'center',
                 render(shflag){
                    return shflag=='1' ? '已审核':'未审核'
                 }
             },
             {
                 title:'状态',
                 dataIndex:'stat',
                 key:'stat',
                 align:'center',
                 render(stat){
                    return stat=='1' ? '管理中':'退出管理'
                 }
             },
             {
                title:'资质名称',
                dataIndex:'wzName',
                key:'wzName',
                align:'center'
            },
            {
                title:'资质认证',
                dataIndex:'zzrz',
                key:'zzrz',
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
                    <Breadcrumb.Item>应急资源管理</Breadcrumb.Item>
                    <Breadcrumb.Item>物资储备管理</Breadcrumb.Item>
                    <Breadcrumb.Item>服务机构管理</Breadcrumb.Item>
                    
                </Breadcrumb>
                <Content className="content-wrap">
                    <div >
                    <span className="table_input ft">
                        <Search size="large" style={{width: 325}}
                        name="searchInfo"
                        placeholder="请输入单位名称/有限期/资质名称"
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
                <FormItem label="单位名称" {...formItemLayout}>
                    {   
                        tableInfo && type=='detail'? tableInfo.dwName: 
                        getFieldDecorator('dwName',{
                            initialValue:tableInfo.dwName,
                            rules:[
                                {
                                    required: true,
                                    message:'单位名称不能为空！'
                                }
                            ]
                        })
                         (<Input placeholder="请输入单位名称" />
                         )
                    }
                </FormItem>
                <FormItem label="物资目录分类" {...formItemLayout}>
                    {   
                        tableInfo && type=='detail'? tableInfo.dirType: 
                        getFieldDecorator('dirType',{
                            initialValue:tableInfo.dirType, 
                            rules:[
                                {
                                    required: true,
                                    message:'请选择物资目录分类'
                                }
                            ]
                        })(
                            <Input placeholder="请输入物资目录分类" />
                        )
                    }
                </FormItem>
                <FormItem label="资质有限期" {...formItemLayout}>
                   { 
                       tableInfo && type=='detail'? tableInfo.limtDate: 
                       getFieldDecorator('limtDate',{
                        initialValue:moment(tableInfo.limtDate),
                    })
                        (<DatePicker  />
                        )
                    }

                </FormItem>
                <FormItem label="年度审核" {...formItemLayout}>
                    {   
                        tableInfo && type=='detail'? tableInfo.shflag: 
                        getFieldDecorator('shflag',{
                            initialValue:tableInfo.shflag? tableInfo.shflag : '1',
                            rules:[]
                        })(
                            <Select style={{ width: 280 }} >
                                <Option value="1">已审核</Option>
                                <Option value="0">未审核</Option>
                            </Select>
                        )
                    }
                </FormItem>
                <FormItem label="状态" {...formItemLayout}>
                    {   
                        tableInfo && type=='detail'? tableInfo.stat: 
                        getFieldDecorator('stat',{
                            initialValue:tableInfo.stat? tableInfo.stat : '1',
                            rules:[]
                        })(
                            <Select style={{ width: 280 }} >
                                <Option value="1">管理中</Option>
                                <Option value="0">退出管理</Option>
                            </Select>
                        )
                    }
                </FormItem>
                <FormItem label="物资名称" {...formItemLayout}>
                    {   
                        tableInfo && type=='detail'? tableInfo.wzName: 
                        getFieldDecorator('wzName',{
                            initialValue:tableInfo.wzName,
                            rules:[]
                        })(
                        <Input placeholder="请输入物资名称" />
                        )
                    }
                </FormItem>
                <FormItem label="资质认证" {...formItemLayout}>
                    {   
                        tableInfo && type=='detail'? tableInfo.zzrz: 
                        getFieldDecorator('zzrz',{
                            initialValue:tableInfo.zzrz,
                            rules:[]
                        })(
                        <Input placeholder="请输入资质认证" />
                        )
                    }
                </FormItem>
            </Form>
        );
    }
}
OpenFormTable = Form.create({})(OpenFormTable);