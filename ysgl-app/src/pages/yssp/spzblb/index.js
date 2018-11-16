import React from 'react';
import {  Button , Form ,  Breadcrumb , Modal , message ,Input , InputNumber , Layout ,Select ,DatePicker ,Row, Col} from  'antd';
import axios from './../../../axios'
import Utils from './../../../utils/utils'
import ETable from './../../../components/ETable/index'
import moment from 'moment'
import FaceUrl from '../../../utils/apiAndInterfaceUrl'
import Dictionary from '../../../utils/dictionary'
import { connect } from 'react-redux'

const Content = Layout;
const { TextArea ,Search} = Input;
const FormItem = Form.Item;
const Option = Select.Option;
export default  class Spzblb extends React.Component{
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
        axios.requestList(_this,FaceUrl.xmjbxx,FaceUrl.POST,FaceUrl.bdApi,this.params);
    }

    //查询
    handleSearchTable = (value)=>{
        let _this =this;
        this.params.query = {"searchInfo":value}
        axios.requestList(_this,FaceUrl.xmjbxx,FaceUrl.POST,FaceUrl.bdApi,this.params);
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
        // axios.ajax({
        //     url:FaceUrl.xmxxDetail+value.kid,
        //     method:FaceUrl.GET,
        //     baseApi:FaceUrl.bdApi
        // }).then((res)=>{
        //     console.log(res)
        //     if(res.code == '1') {
        //         let tableInfo = res.data;
        //         if(tableInfo.status==='1'){
        //             window.open(`/#/ysbztz/detail/${value.kid}`,'_self')
        //         }else{
        //             window.open(`/#/proc/detail/${value.kid}`,'_self')
        //         }
        //     } 
        // })
        window.open(`#/proc/detail/${value.kid}`,'_self')
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
                url:FaceUrl.xmxxAdd,
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
                        url:FaceUrl.xmxxDel,
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
                 title:'项目名称',
                 dataIndex:'xmname',
                 key:'xmname',
                 align:'center',
                 render:(xmname,record)=>{
                     return <a  href="javascript:;" onClick={()=>{this.handleDetail(record)}}>{xmname}</a>;
                }
             },
             {
                title:'项目属性名称',
                dataIndex:'xmsxname',
                key:'xmsxname',
                align:'center',
            },
             {
                 title:'资金保障类型名称',
                 dataIndex:'zjbztypename',
                 key:'zjbztypename',
                 align:'center',
            },
             {
                 title:'项目类别名称 ',
                 dataIndex:'xmtypename',
                 key:'xmtypename',
                 align:'center',
                
            },
            {
                title:'项目负责人',
                dataIndex:'xmfzrname',
                key:'xmfzrname',
                align:'center',
            },
            {
                title:'负责人联系方式',
                dataIndex:'link',
                key:'link',
                align:'center',
           },
           {
            title:'状态',
            dataIndex:'status',
            key:'status',
            align:'center',
            render(status){
                return  Dictionary.spStatus[status]
             }
            }
           ,{
               title:'起始年月',
               dataIndex:'begdate',
               key:'begdate',
               align:'center',
               render(begdate){
                return moment(begdate).format('YYYY-MM-DD')
             }
           },
           {
            title:'结束年月',
            dataIndex:'enddate',
            key:'enddate',
            align:'center',
            render(enddate){
                return moment(enddate).format('YYYY-MM-DD')
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
                    <Breadcrumb.Item>预算审批</Breadcrumb.Item>
                    <Breadcrumb.Item>在办列表</Breadcrumb.Item>
                </Breadcrumb>
                <Content className="content-wrap">
                    <div >
                    <span className="table_input ft">
                        <Search size="large" style={{width: 325}}
                        name="searchInfo"
                        placeholder="请输入项目名称/属性名称/负责人"
                        onSearch={value => this.handleSearchTable(value)}
                        enterButton
                        />  
                    </span>
                    <span className="table_button ht" >
                        {/* <Button icon="plus" ghost type="primary" onClick={()=>{this.handleOperate('add')}}>添加</Button>
                        <Button icon="form" ghost type="primary" onClick={()=>{this.handleOperate('edit')}}>修改</Button> */}
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
                
            </div>
            
        );
    }
}
 
  
 