import React from 'react';
import { Button , Form , Breadcrumb , Modal , message ,Input , InputNumber , Layout , Select , DatePicker } from  'antd';
import axios from '../../../axios'
import Utils from '../../../utils/utils'
import ETable from '../../../components/ETable'
import moment from 'moment'
import FaceUrl from '../../../utils/apiAndInterfaceUrl'
import Dictionary from '../../../utils/dictionary'

const Content = Layout;
const { TextArea,Search } = Input;
const FormItem = Form.Item;
const Option = Select.Option;
export default class Sbssgl extends React.Component{
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
        axios.requestList(_this,FaceUrl.sbssgl,FaceUrl.POST,FaceUrl.bdApi,this.params);
    }

    //查询
    handleSearchTable = (value)=>{
        let _this =this;
        this.params.query = {"searchInfo":value}
        axios.requestList(_this,FaceUrl.sbssgl,FaceUrl.POST,FaceUrl.bdApi,this.params);
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
                url:FaceUrl.sbssAdd,
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
                        url:FaceUrl.sbssDel,
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
                 title:'设备名称',
                 dataIndex:'wzName',
                 key:'wzName',
                 align:'center',
                 render:(wzName,record)=>{
                     return <a  href="javascript:;" onClick={()=>{this.handleDetail(record)}}>{wzName}</a>;
                }
             },
             {
                title:'设备分类',
                dataIndex:'wzType',
                key:'wzType',
                align:'center',
                render(wzType){
                    let config = Dictionary.sbflType
                    return config[wzType];
                }
            },
             {
                 title:'规格参数',
                 dataIndex:'ggParam',
                 key:'ggParam',
                 align:'center',
            },
            {
                title:'设备数量',
                dataIndex:'wzNum',
                key:'wzNum',
                align:'center',
           },
           {
                title:'使用期限',
                dataIndex:'syqx',
                key:'syqx',
                align:'center',
            },
             {
                 title:'购置时间',
                 dataIndex:'gzDate',
                 key:'gzDate',
                 align:'center',
                 render(gzDate){
                    return moment(gzDate).format('YYYY-MM-DD')
                 }
            },
            {
                title:'使用机构',
                dataIndex:'syjg',
                key:'syjg',
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
                    <Breadcrumb.Item>设备设施管理</Breadcrumb.Item>
                </Breadcrumb>
                <Content className="content-wrap">
                    <div >
                    <span className="table_input ft">
                        <Search size="large" style={{width: 325}}
                        name="searchInfo"
                        placeholder="请输入设备名称/分类/使用机构"
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
    getState = (state)=>{
    
        return Dictionary.sbflType[state]
    }
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
                <FormItem label="设备名称" {...formItemLayout}>
                    {   
                        tableInfo && type=='detail'? tableInfo.wzName: 
                        getFieldDecorator('wzName',{
                            initialValue:tableInfo.wzName,
                            rules:[
                                {
                                    required: true,
                                    message:'设备名称不能为空！'
                                }
                            ]
                        })
                         (<Input placeholder="请输入设备名称" />
                         )
                    }
                </FormItem>
                <FormItem label="设备分类" {...formItemLayout}>
                    {   
                            tableInfo && type=='detail'? this.getState(tableInfo.wzType): 
                            getFieldDecorator('wzType',{
                                initialValue:tableInfo.wzType ? tableInfo.wzType : 'A',
                                rules:[
                                    {
                                        required: true,
                                        message:'请选择设备分类'
                                    }
                                ]
                            })(
                                <Select style={{ width: 280 }} >
                                    <Option value="A">重点设备（A类设备）</Option>
                                    <Option value="B">主要设备（B类设备）</Option>
                                    <Option value="C">一般设备（B类设备）</Option>
                                </Select>
                            )
                    }
                </FormItem>
                <FormItem label="设备数量" {...formItemLayout}>
                    {   
                        tableInfo && type=='detail'? tableInfo.wzNum: 
                        getFieldDecorator('wzNum',{
                            initialValue:tableInfo.wzNum, 
                            rules:[
                                {
                                    required: true,
                                    message:'请输入设备数量'
                                }
                            ]
                        })(
                            <InputNumber />    
                        )
                    }
                </FormItem>
                <FormItem label="规格参数" {...formItemLayout}>
                    {   
                        tableInfo && type=='detail'? tableInfo.ggParam: 
                        getFieldDecorator('ggParam',{
                            initialValue:tableInfo.ggParam, 
                            rules:[
                                {
                                    required: true,
                                    message:'请输入规格参数'
                                }
                            ]
                        })(
                            <Input placeholder="请输入规格参数" />
                        )
                    }
                </FormItem>
                <FormItem label="使用期限" {...formItemLayout}>
                   { 
                       tableInfo && type=='detail'? tableInfo.syqx: 
                       getFieldDecorator('syqx',{
                        initialValue:tableInfo.syqx,
                    })
                        (
                        <InputNumber />    
                        )
                    }

                </FormItem>
                <FormItem label="使用机构" {...formItemLayout}>
                    {   
                        tableInfo && type=='detail'? tableInfo.syjg: 
                        getFieldDecorator('syjg',{
                            initialValue:tableInfo.syjg,
                            rules:[]
                        })( 
                            <Input placeholder="请输入使用机构" />
                        )
                    }
                </FormItem>
                <FormItem label="责任人" {...formItemLayout}>
                    {   
                        tableInfo && type=='detail'? tableInfo.zrr: 
                        getFieldDecorator('zrr',{
                            initialValue:tableInfo.zrr,
                    })
                        (<Input placeholder="请输入责任人" />
                        )
                    }
                </FormItem>
                <FormItem label="购置时间" {...formItemLayout}>
                    {   
                        tableInfo && type=='detail'? tableInfo.gzDate: 
                        getFieldDecorator('gzDate',{
                            initialValue:moment(tableInfo.gzDate),
                            rules:[]
                        })( <DatePicker  />
                            
                        )
                    }
                </FormItem>
                <FormItem label="报废" {...formItemLayout}>
                    {   
                        tableInfo && type=='detail'? tableInfo.bf: 
                        getFieldDecorator('bf',{
                            initialValue:tableInfo.bf,
                    })
                        (<Input placeholder="请输入报废" />
                        )
                    }
                </FormItem>
                <FormItem label="改造" {...formItemLayout}>
                    {   
                        tableInfo && type=='detail'? tableInfo.gz: 
                        getFieldDecorator('gz',{
                            initialValue:tableInfo.gz,
                    })
                        (<Input placeholder="请输入改造" />
                        )
                    }
                </FormItem>
                <FormItem label="修理" {...formItemLayout}>
                    {   
                        tableInfo && type=='detail'? tableInfo.xl: 
                        getFieldDecorator('xl',{
                            initialValue:tableInfo.xl,
                    })
                        (<Input placeholder="请输入修理" />
                        )
                    }
                </FormItem>
                <FormItem label="设备属性" {...formItemLayout}>
                    {   
                            tableInfo && type=='detail'? (tableInfo.sbFlag=='0'?'现有':'可调用'): 
                            getFieldDecorator('sbFlag',{
                                initialValue:tableInfo.sbFlag ? tableInfo.sbFlag : '0',
                                rules:[
                                    
                                ]
                            })(
                                <Select style={{ width: 280 }} >
                                    <Option value="0">现有</Option>
                                    <Option value="1">可调用</Option>
                                </Select>
                            )
                    }
                </FormItem>
            </Form>
        );
    }
}
OpenFormTable = Form.create({})(OpenFormTable);