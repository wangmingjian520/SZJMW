import React from 'react';
import {  Button , Form ,  Breadcrumb , Modal , message ,Input , Table ,InputNumber , Layout ,Select ,DatePicker ,Row, Col} from  'antd';
import axios from './../../../axios'
import Utils from './../../../utils/utils'
import ETable from './../../../components/ETable/index'
import moment from 'moment'
import FaceUrl from '../../../utils/apiAndInterfaceUrl'
import Dictionary from '../../../utils/dictionary'
import { connect } from 'react-redux'
import PropTypes from "prop-types";

const Content = Layout;
const { TextArea ,Search} = Input;
const FormItem = Form.Item;
const Option = Select.Option;
export default  class Spdblb extends React.Component{
    static contextTypes = {
        router: PropTypes.object
    }
    constructor(props, context) {
         super(props, context);
         this.columns = [
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
                 title:'流程名',
                 dataIndex:'procName',
                 key:'procName',
                 align:'center',
            } 
            ,{
                title:'当前环节 ',
                dataIndex:'taskName',
                key:'taskName',
                align:'center',
            },
            {
                title:'当前执行人 ',
                dataIndex:'currentPersonName',
                key:'currentPersonName',
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
            {
                title:'操作',
                dataIndex:'operation',
                key:'operation',
                align:'center',
                render:(value,record)=>{ 
                   // return <a  href="javascript:;" onClick={()=>{this.handleDetail(record)}}>{xmname}</a>;
                    return <a href="javascript:;" onClick={()=>{this.historyproc(record)}}>历程</a>;
                 
                },
            }
            
         ],
         this.historyColumns=[
            {
                title:'序号',
                dataIndex:'no',
                key:'no',
                width:100,
                align:'center', 
            },
            {
                title:'执行人',
                dataIndex:'executorName',
                key:'executorName',
                width:150,
                align:'center', 
            },
            {
                title:'任务名称',
                dataIndex:'taskName',
                key:'taskName',
                width:150,
                align:'center', 
            },
            {
                title:'执行动作名',
                dataIndex:'actionName',
                key:'actionName',
                width:150,
                align:'center', 
            },
            {
                title:'意见',
                dataIndex:'remark',
                key:'remark',
                width:350,
                align:'center', 
            },
            {
                title:'开始时间',
                dataIndex:'startTime',
                key:'startTime',
                width:150,
                align:'center', 
                render(startTime){
                    return moment(startTime).format('YYYY-MM-DD HH:mm:ss')
                 }
            },
            {
                title:'结束时间',
                dataIndex:'finishTime',
                key:'finishTime',
                width:150,
                align:'center', 
                render(finishTime){
                    return <span>{finishTime? moment(finishTime).format('YYYY-MM-DD HH:mm:ss'):''}</span>
                 }
            },
         ]
    }
   
    state={
        dataSource:[],
        historySource:[],
        footer:'',
        visible:false
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
        axios.requestList(_this,FaceUrl.xmxxsplist+'/2',FaceUrl.POST,FaceUrl.bdApi,this.params);
    }

    //查询
    handleSearchTable = (value)=>{
        let _this =this;
        this.params.query = {"searchInfo":value}
        axios.requestList(_this,FaceUrl.xmxxsplist+'/2',FaceUrl.POST,FaceUrl.bdApi,this.params);
    }

     
    //历程
    historyproc = (record)=>{
        console.log(12)
        console.log(record)
        axios.ajax({
            url:FaceUrl.historyProc+record.procRecId,
            method:FaceUrl.GET,
            baseApi:FaceUrl.bdApi, 
        }).then((res)=>{
            if(res.code == '1') {
                let data =res.data;
                let list=[];
                if(data.tasks){
                    list =data.tasks.map((item,index)=>{
                    item.key = index;
                    item.no=index+1;
                    return item
                    })
                }
                this.setState({historySource:list}) ;
                console.log(123456)
                console.log(data)
            }
        })
        this.setState({visible:true}) ;
    }
    //打开详情
    handleDetail = (value)=>{
        this.context.router.history.push(`/proc/detail/${value.kid}`);
    }
      
    //取消
    handleCancel = ()=>{
        this.setState({
            visible:false
        })
        this.requestList(); 
    }
    
    render(){
        
        let footer = {
            footer: <Button key="关闭" onClick={this.handleCancel.bind(this)}>关闭</Button>,
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
                        placeholder="请输入项目名称/负责人"
                        onSearch={value => this.handleSearchTable(value)}
                        enterButton
                        />  
                    </span>
                    <span className="table_button ht" >
                   
                    </span>   
                    </div>        
                    {/*   */}
                     <Table   
                            columns={this.columns}
                            dataSource={this.state.list} 
                            pagination={this.state.pagination} 
                          />
                  <Modal
                        {...footer}
                        visible={this.state.visible}
                        title="历程列表" 
                        onCancel={this.handleCancel} 
                        width={1400}
                         > 
                        <Table   
                                columns={this.historyColumns}
                                dataSource={this.state.historySource}
                                bordered
                                size="size"
                                pagination={false} 
                                />
                   </Modal>
                </Content>
                
            </div>
            
        );
    }
}
 
  
 