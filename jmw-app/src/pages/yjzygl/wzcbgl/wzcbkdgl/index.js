import React from 'react';
import {  Button , Form ,  Breadcrumb , Modal , message ,Input , InputNumber , Layout ,Select ,DatePicker ,Row, Col} from  'antd';
import axios from './../../../../axios'
import Utils from './../../../../utils/utils'
import ETable from './../../../../components/ETable/index'
import moment from 'moment'
import FaceUrl from '../../../../utils/apiAndInterfaceUrl'
import Dictionary from '../../../../utils/dictionary'

const Content = Layout;
const { TextArea ,Search} = Input;
const FormItem = Form.Item;
const Option = Select.Option;

export default class Wzcbjgl extends React.Component{
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
        axios.requestList(_this,FaceUrl.wzkdkdgl,FaceUrl.POST,FaceUrl.bdApi,this.params);
    }

    //查询
    handleSearchTable = (value)=>{
        let _this =this;
        this.params.query = {"searchInfo":value}
        axios.requestList(_this,FaceUrl.wzkdkdgl,FaceUrl.POST,FaceUrl.bdApi,this.params);
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

    //提交
    handleSubmit =()=>{
        let type = this.state.type;
        const form = this.modalForm.props.form;
        form.validateFields((err, values) => {
        if (err) {
            return;
        }
            let message = "";
            if(type=="add"){
                message="添加成功";
            }if(type=="edit"){
                message="修改成功";
            }
            //提交or修改
            axios.ajax({
                url:FaceUrl.wzkdAdd,
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
                        url:FaceUrl.wzkdDel,
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
                 title:'库点名称',
                 dataIndex:'cbkName',
                 key:'cbkName',
                 align:'center',
                 render:(cbkName,record)=>{
                    return <a  href="javascript:;" onClick={()=>{this.handleDetail(record)}}>{cbkName}</a>;
               }
             },
             {
                title:'编号',
                dataIndex:'cbkCode',
                key:'cbkCode',
                align:'center'
            },
             {
                 title:'库点分类',
                 dataIndex:'cbkType',
                 key:'cbkType',
                 align:'center',
                 render(cbkType){
                    let config = Dictionary.cbkType
                    return config[cbkType];
                }
             },
             {
                title:'级别',
                dataIndex:'cbkGrade',
                key:'cbkGrade',
                align:'center'
            },
            {
                title:'储备物资',
                dataIndex:'cbwz',
                key:'cbwz',
                align:'center'
            },
            {
                title:'面积',
                dataIndex:'area',
                key:'area',
                align:'center'
            },
            {
                title:'负责人',
                dataIndex:'fzrName',
                key:'fzrName',
                align:'center'
            },{
                title:'联系电话',
                dataIndex:'fzrMob',
                key:'fzrMob',
                align:'center',
                
             },{
                title:'投入使用时间',
                dataIndex:'syDate',
                key:'syDate',
                align:'center',
                render(syDate){
                   return moment(syDate).format('YYYY-MM-DD')
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
                    <Breadcrumb.Item>应急资源管理</Breadcrumb.Item>
                    <Breadcrumb.Item>物资储备管理</Breadcrumb.Item>
                    <Breadcrumb.Item>物资储备库点管理</Breadcrumb.Item>
                </Breadcrumb>
                <Content className="content-wrap">
                    <div >
                    <span className="table_input ft">
                        <Search size="large" style={{width: 325}}
                        name="searchInfo"
                        placeholder="请输入名称/编号/负责人"
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
                    width='700px'
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
                    onOk={this.handleSubmit}
                    {...footer}
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
        let type = this.props.type;
        let tableInfo =this.props.tableInfo || {};
        const formItemLayout = {
            // labelCol:{
            //     span:8
            // },
            // wrapperCol:{
            //     span:16
            // }
        }
        const { getFieldDecorator }  =this.props.form;
        return (
            <Form layout="inline" >
                    {
                        getFieldDecorator('kid',{
                            initialValue:tableInfo.kid,
                        })
                         (<Input type="hidden" />
                         )
                    }
                <Row>
                    <Col span={12}>
                        <div className="gutter-box" align="left">
                            <FormItem label="库点名称" {...formItemLayout}>
                                {   
                                    //tableInfo && type=='detail'? tableInfo.cbkName: 
                                    getFieldDecorator('cbkName',{
                                        initialValue:tableInfo.cbkName,
                                        rules:[
                                            {
                                                required: true,
                                                message:'库点名称不能为空！'
                                            }
                                        ]
                                    })
                                    (<Input placeholder="请输库点名称" style={{ width: 200 }}/>
                                    )
                                }
                            </FormItem>
                        </div>
                    </Col>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="编号" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.cbkCode: 
                                getFieldDecorator('cbkCode',{
                                    initialValue:tableInfo.cbkCode,
                                    rules:[
                                        {
                                            required: true,
                                            message:'编号不能为空！'
                                        }
                                    ]
                                })
                                (<Input placeholder="请输入编号" style={{ width: 200 }}/>
                                )
                            }
                        </FormItem>
                    </div>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="库点分类" {...formItemLayout}>
                    {   
                        //tableInfo && type=='detail'? tableInfo.cbkType: 
                        getFieldDecorator('cbkType',{
                            initialValue:tableInfo.cbkType ? tableInfo.cbkType : '1',
                            rules:[
                                {
                                    required: true,
                                    message:'请选择库点分类'
                                }
                            ]
                        })(
                            <Select style={{ width: 200 }} >
                                
                                <Option value="1">电力工程抢险</Option>
                                <Option value="2">通信工程抢险</Option>
                                <Option value="3">动物疫情处置</Option>
                                <Option value="4">基本生活物资保障</Option>
                                <Option value="5">网络安全保障</Option>
                                <Option value="6">成品油</Option>
                            </Select>
                        )
                    }
                </FormItem>
                    </div>
                    </Col>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="级别" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.cbkGrade:
                                getFieldDecorator('cbkGrade',{
                                    initialValue:tableInfo.cbkGrade,
                                    rules:[
                                        {
                                            required: true,
                                            message:'级别不能为空！'
                                        }
                                    ]
                                })
                                (<Input placeholder="请输入级别名称" style={{ width: 200 }}/>
                                )
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                </Row>
                <Row>
                    <Col>
                    <div className="gutter-box">
                    <FormItem label="储备物资"  >
                            {   
                                //tableInfo && type=='detail'? tableInfo.cbwz:
                                getFieldDecorator('cbwz',{
                                    initialValue:tableInfo.cbwz,
                                })
                                (<TextArea style={{ width: 526 }}
                                    autosize={{minRows:3}}
                                    placeholder="请输入储备物资" 
                                    />
                                )
                            }
                        </FormItem>
                    </div>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="面积" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.area:
                                getFieldDecorator('area',{
                                    initialValue:tableInfo.area,
                                })
                                (<InputNumber style={{ width: 200 }}/>)    
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="行政区划" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.areaCode:
                                getFieldDecorator('areaCode',{
                                    initialValue:tableInfo.areaCode,
                                })
                                (<Input placeholder="请输入行政区划" style={{ width: 200 }}/>
                                )
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                </Row>
                <Row >
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="库点地址" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.cbkAdd:
                                getFieldDecorator('cbkAdd',{
                                    initialValue:tableInfo.cbkAdd,
                                })
                                (<Input placeholder="请输入库点地址" style={{ width: 200 }}/>
                                )
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="库容" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.kr:
                                getFieldDecorator('kr',{
                                    initialValue:tableInfo.kr,
                                })
                                (<InputNumber style={{ width: 200 }}/>    
                                )
                            }
                        </FormItem>
                    </div>
                       
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="负责人" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.fzrName:
                                getFieldDecorator('fzrName',{
                                    initialValue:tableInfo.fzrName,
                                })
                                (<Input placeholder="请输入负责人" style={{ width: 200 }}/>
                                )
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="办公电话" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.fzrOffTel:
                                getFieldDecorator('fzrOffTel',{
                                    initialValue:tableInfo.fzrOffTel,
                                })
                                (<Input placeholder="请输入办公电话" style={{ width: 200 }}/>
                                )
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                </Row>
                <Row >
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="联系电话" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.fzrMob:
                                getFieldDecorator('fzrMob',{
                                    initialValue:tableInfo.fzrMob,
                                })
                                (<Input placeholder="请输入联系电话" style={{ width: 200 }}/>
                                )
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="联系人" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.linkName:
                                getFieldDecorator('linkName',{
                                    initialValue:tableInfo.linkName,
                                })
                                (<Input placeholder="请输入联系人" style={{ width: 200 }}/>
                                )
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                </Row>
                <Row >
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="办公电话" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.linkOffTel:
                                getFieldDecorator('linkOffTel',{
                                    initialValue:tableInfo.linkOffTel,
                                })
                                (<Input placeholder="请输入办公电话" style={{ width: 200 }}/>
                                )
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="联系电话" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.linkMob:
                                getFieldDecorator('linkMob',{
                                    initialValue:tableInfo.linkMob,
                                })
                                (<Input placeholder="请输入联系电话" style={{ width: 200 }}/>
                                )
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                </Row>
                <Row >
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="经度" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.longitude:
                                getFieldDecorator('longitude',{
                                    initialValue:tableInfo.longitude,
                                })
                                (<Input placeholder="请输入经度" style={{ width: 200 }}/>
                                )
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="投入使用时间" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.syDate:
                                getFieldDecorator('syDate',{
                                    initialValue:moment(tableInfo.syDate),
                                })
                                (<DatePicker  style={{ width: 200 }}/>
                                )
                            }
                        </FormItem>
                    
                    </div>
                        
                    </Col>
                </Row>
                <Row >
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="纬度" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.latitude:
                                getFieldDecorator('latitude',{
                                    initialValue:tableInfo.latitude,
                                })
                                (<Input placeholder="请输入纬度" style={{ width: 200 }}/>
                                )
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="设计使用年限" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.synx:
                                getFieldDecorator('synx',{
                                    initialValue:tableInfo.synx,
                                })
                                ( <InputNumber style={{ width: 200 }}/>    
                                )
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                </Row>
                <Row >
                    <Col span={24}>
                    <div className="gutter-box">
                    <FormItem label="周边交通状况" >
                            {   
                                //tableInfo && type=='detail'? tableInfo.zbjt:
                                getFieldDecorator('zbjt',{
                                    initialValue:tableInfo.zbjt,
                                    rules:[]
                                })(
                                <TextArea style={{ width: 526 }}
                                autosize={{minRows:3}}
                                placeholder="请输入周边交通状况" 
                                    />
                                )
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                </Row>
            </Form>
        );
    }
}
OpenFormTable = Form.create({})(OpenFormTable);
