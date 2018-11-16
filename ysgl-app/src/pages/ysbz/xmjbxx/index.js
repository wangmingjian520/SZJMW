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
class Xmjbxx extends React.Component{
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
      //this.requestList()
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
        window.open(`#/ysbztz/detail/${value.kid}`,'_self')
 
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
                    <Breadcrumb.Item>预算编制</Breadcrumb.Item>
                    <Breadcrumb.Item>项目基本信息</Breadcrumb.Item>
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
                    width='760px'
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
 
    handleZcTypeCodeChange =(value)=>{
        this.props.form.setFieldsValue({
            zctypename: `${value === '001' ? '新增项目' : value === '002' ? '上年延续': '上年结转'}`,
          });
    }
    handleZcTypeName =(value)=>{
        this.props.form.setFieldsValue({
            zctypecode: `${value === '新增项目' ? '001' : value === '上年延续' ? '002': '003'}`,
          });
    }
    //项目属性编码与名称
    handleXmsxCodeChange =(value)=>{
        this.props.form.setFieldsValue({
            xmsxname: `${value === '001' ? '新增项目' : value === '002' ? '上年延续': '上年结转'}`,
          });
    }
    handleXmsxNameChange =(value)=>{
        this.props.form.setFieldsValue({
            xmsxcode: `${value === '新增项目' ? '001' : value === '上年延续' ? '002': '003'}`,
          });
    }
    //存续属性编码与名称
    handleCxsxCodeChange =(value)=>{
        this.props.form.setFieldsValue({
            cxsxname: `${value === '01' ? '经常性项目' : '一次性项目'}`,
          });
    }
    handleCxsxNameChange =(value)=>{
        this.props.form.setFieldsValue({
            cxsxcode: `${value === '经常性项目' ? '01' : '02'}`,
          });
    }
    //资金保障类型编码与名称
    handleZjbzTypeCodeChange =(value)=>{
        this.props.form.setFieldsValue({
            zjbztypename: `${value === '01' ? '刚性项目' : '弹性项目'}`,
          });
    }
    handleZjbzTypeNameChange =(value)=>{
        this.props.form.setFieldsValue({
            zjbztypecode: `${value === '刚性项目' ? '01' : '02'}`,
          });
    }

    //支出方向编码与名称  
    handleZcfxCodeChange =(value)=>{
        this.props.form.setFieldsValue({
            zcfxname: `${value === '01' ? '机构运行保障类项目' : value === '02'?'重点民生事业类项目':'一般事业发展性项目'}`,
          });
    }
    handleZcfxNameChange =(value)=>{
        this.props.form.setFieldsValue({
            zcfxcode: `${value === '机构运行保障类项目' ? '01' : value === '重点民生事业类项目'?'02':'03'}`,
          });
    }

    //项目类型编码与名称
    handleXmtypeCodeChange =(value)=>{
        this.props.form.setFieldsValue({
            xmtypename: `${value === '01' ? '制度及法定增长类' : value === '02'?'开办费类': value === '03'?'发改投资项目后续运维类':value==='04'?'水电物管类':'其他类'}`,
          });
    }
    handleXmtypeNameChange =(value)=>{
        this.props.form.setFieldsValue({
            xmtypecode: `${value === '制度及法定增长类' ? '01' : value === '开办费类'?'02':value==='发改投资项目后续运维类'?'03':value==='水电物管类'?'04':'05'}`,
          });
    }
    //项目依据类型编码与名称
     handleXmyjtypeCodeChange =(value)=>{
        this.props.form.setFieldsValue({
            xmyjtypename: `${value === '001' ? '单位履职需要的项目' : value === '002'?'市委市政府确定的项目': value === '003'?'中央安排的项目':'省级安排的项目'}`,
          });
    }
    handleXmyjtypeNameChange =(value)=>{
        this.props.form.setFieldsValue({
            xmyjtypecode: `${value === '单位履职需要的项目' ? '001' : value === '市委市政府确定的项目'?'002':value==='中央安排的项目'?'003':'004'}`,
          });
    }


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
                    <Col span={24}>
                        <div className="gutter-box" align="left">
                            <FormItem label="项目名称" {...formItemLayout}>
                                {   
                                    //tableInfo && type=='detail'? tableInfo.cbkName: 
                                    getFieldDecorator('xmname',{
                                        initialValue:tableInfo.xmname,
                                        rules:[
                                            {
                                                required: true,
                                                message:'项目名称不能为空！'
                                            }
                                        ]
                                    })
                                    (<Input placeholder="请输入项目名称"  maxlength="200" style={{ width: 556 }}/>
                                    )
                                }
                            </FormItem>
                        </div>
                    </Col>
                    
                </Row>
                <Row>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="单位编码" {...formItemLayout}>
                        {   
                            //tableInfo && type=='detail'? tableInfo.cbkType: 
                            getFieldDecorator('dwcode',{
                                initialValue:tableInfo.dwcode,
                                
                            })(
                                <Input placeholder="请输入单位编码"  maxlength="20" style={{ width: 200 }}/>
                            )
                        }
                    </FormItem>
                    </div>
                    </Col>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="单位名称" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.cbkGrade:
                                getFieldDecorator('dwname',{
                                    initialValue:tableInfo.dwname,
                                    rules:[
                                        {
                                            required: true,
                                            message:'单位名称不能为空！'
                                        }
                                    ]
                                })
                                (<Input placeholder="请输入单位名称" maxlength="200" style={{ width: 200 }}/>
                                )
                            }
                        </FormItem>
                    </div>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="支出功能分类编码" {...formItemLayout}>
                    {   
                        //tableInfo && type=='detail'? tableInfo.cbkType: 
                        getFieldDecorator('zctypecode',{
                            initialValue:tableInfo.zctypecode
                            
                        })(
                            <Select style={{ width: 200 }} onChange={this.handleZcTypeCodeChange} >
                               <Option value="001">001</Option>
                                <Option value="002">002</Option>
                                <Option value="003">003</Option>
                            </Select>
                        )
                    }
                </FormItem>
                    </div>
                    </Col>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="支出功能分类名称" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.cbkGrade:
                                getFieldDecorator('zctypename',{
                                    initialValue:tableInfo.zctypename
                                    
                                })
                                (<Select style={{ width: 200 }} onChange={this.handleZcTypeName} >
                                    <Option value="新增项目">新增项目</Option>
                                    <Option value="上年延续">上年延续</Option>
                                    <Option value="上年结转">上年结转</Option>
                                </Select>
                                )
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="项目属性编码" {...formItemLayout}>
                    {   
                        //tableInfo && type=='detail'? tableInfo.cbkType: 
                        getFieldDecorator('xmsxcode',{
                            initialValue:tableInfo.xmsxcode,
                            
                        })(
                            <Select style={{ width: 200 }} onChange={this.handleXmsxCodeChange} >
                               <Option value="001">001</Option>
                                <Option value="002">002</Option>
                                <Option value="003">003</Option>
                            </Select>
                        )
                    }
                </FormItem>
                    </div>
                    </Col>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="项目属性名称" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.cbkGrade:
                                getFieldDecorator('xmsxname',{
                                    initialValue:tableInfo.xmsxname,
                                    rules:[
                                        {
                                            required: true,
                                            message:'请选择项目属性名称！'
                                        }
                                    ]
                                })
                                (<Select style={{ width: 200 }} onChange={this.handleXmsxNameChange}>
                                     <Option value="新增项目">新增项目</Option>
                                     <Option value="上年延续">上年延续</Option>
                                     <Option value="上年结转">上年结转</Option>
                                 </Select>
                                )
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="存续属性编码" {...formItemLayout}>
                        {   
                            //tableInfo && type=='detail'? tableInfo.cbkType: 
                            getFieldDecorator('cxsxcode',{
                                initialValue:tableInfo.cxsxcode,
                                
                            })(
                                <Select style={{ width: 200 }} onChange={this.handleCxsxCodeChange}>
                                    <Option value="01">01</Option>
                                    <Option value="02">02</Option>
                                </Select>
                            )
                        }
                    </FormItem>
                    </div>
                    </Col>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="存续属性名称" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.cbkGrade:
                                getFieldDecorator('cxsxname',{
                                    initialValue:tableInfo.cxsxname,
                                    
                                })
                                (<Select style={{ width: 200 }} onChange={this.handleCxsxNameChange} >
                                    <Option value="经常性项目">经常性项目</Option>
                                    <Option value="一次性项目">一次性项目</Option>
                                 </Select>
                                )
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="资金保障类型编码" {...formItemLayout}>
                        {   
                            //tableInfo && type=='detail'? tableInfo.cbkType: 
                            getFieldDecorator('zjbztypecode',{
                                initialValue:tableInfo.zjbztypecode,
                                
                            })(
                                <Select style={{ width: 200 }} onChange={this.handleZjbzTypeCodeChange}>
                                    <Option value="01">01</Option>
                                    <Option value="02">02</Option>
                                </Select>
                            )
                        }
                    </FormItem>
                    </div>
                    </Col>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="资金保障类型名称" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.cbkGrade:
                                getFieldDecorator('zjbztypename',{
                                    initialValue:tableInfo.zjbztypename,
                                    
                                })
                                (<Select style={{ width: 200 }} onChange={this.handleZjbzTypeNameChange} >
                                    <Option value="刚性项目">刚性项目</Option>
                                    <Option value="弹性项目">弹性项目</Option>
                                 </Select>
                                )
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="支出方向编码" {...formItemLayout}>
                        {   
                            //tableInfo && type=='detail'? tableInfo.cbkType: 
                            getFieldDecorator('zcfxcode',{
                                initialValue:tableInfo.zcfxcode,
                                
                            })(
                                <Select style={{ width: 200 }} onChange={this.handleZcfxCodeChange} >
                                    <Option value="01">01</Option>
                                    <Option value="02">02</Option>
                                    <Option value="03">03</Option>
                                </Select>
                            )
                        }
                    </FormItem>
                    </div>
                    </Col>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="支出方向名称" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.cbkGrade:
                                getFieldDecorator('zcfxname',{
                                    initialValue:tableInfo.zcfxname,
                                    
                                })
                                (<Select style={{ width: 200 }} onChange={this.handleZcfxNameChange}>
                                    <Option value="机构运行保障类项目">机构运行保障类项目</Option>
                                    <Option value="重点民生事业类项目">重点民生事业类项目</Option>
                                    <Option value="一般事业发展性项目">一般事业发展性项目</Option>
                                 </Select>
                                )
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="项目类别编码" {...formItemLayout}>
                        {   
                            //tableInfo && type=='detail'? tableInfo.cbkType: 
                            getFieldDecorator('xmtypecode',{
                                initialValue:tableInfo.xmtypecode,
                                
                            })(
                                <Select style={{ width: 200 }} onChange={this.handleXmtypeCodeChange} >
                                    <Option value="01">01</Option>
                                    <Option value="02">02</Option>
                                    <Option value="03">03</Option>
                                    <Option value="04">04</Option>
                                    <Option value="05">05</Option>
                                </Select>
                            )
                        }
                    </FormItem>
                    </div>
                    </Col>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="项目类别名称" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.cbkGrade:
                                getFieldDecorator('xmtypename',{
                                    initialValue:tableInfo.xmtypename,
                                    
                                })
                                (<Select style={{ width: 200 }} onChange={this.handleXmtypeNameChange}>
                                    <Option value="制度及法定增长类">制度及法定增长类</Option>
                                    <Option value="开办费类">开办费类</Option>
                                    <Option value="发改投资项目后续运维类">发改投资项目后续运维类</Option>
                                    <Option value="水电物管类">水电物管类</Option>
                                    <Option value="其他类">其他类</Option>
                                 </Select>
                                )
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="项目依据类型编码" {...formItemLayout}>
                        {   
                            //tableInfo && type=='detail'? tableInfo.cbkType: 
                            getFieldDecorator('xmyjtypecode',{
                                initialValue:tableInfo.xmyjtypecode,
                                
                            })(
                                <Select style={{ width: 200 }} onChange={this.handleXmyjtypeCodeChange}>
                                    <Option value="001">001</Option>
                                    <Option value="002">002</Option>
                                    <Option value="003">003</Option>
                                    <Option value="004">004</Option>
                                </Select>
                            )
                        }
                    </FormItem>
                    </div>
                    </Col>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="项目依据类型名称" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.cbkGrade:
                                getFieldDecorator('xmyjtypename',{
                                    initialValue:tableInfo.xmyjtypename,
                                    
                                })
                                (<Select style={{ width: 200 }} onChange={this.handleXmyjtypeNameChange}>
                                    <Option value="单位履职需要的项目">单位履职需要的项目</Option>
                                    <Option value="市委市政府确定的项目">市委市政府确定的项目</Option>
                                    <Option value="中央安排的项目">中央安排的项目</Option>
                                    <Option value="省级安排的项目">省级安排的项目</Option>
                                 </Select>
                                )
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="是否跨年支付项目" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.area:
                                getFieldDecorator('knzfflag',{
                                    initialValue:tableInfo.knzfflag,
                                    rules:[
                                        {
                                            required: true,
                                            message:'请选择是否跨年支付项目！'
                                        }
                                    ]
                                })
                                (<Select style={{ width: 200 }} >
                                    <Option value="0">否</Option>
                                    <Option value="1">是</Option>
                                </Select>)    
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="政府采购服务类型" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.areaCode:
                                getFieldDecorator('zfcgfwtype',{
                                    initialValue:tableInfo.zfcgfwtype,
                                })
                                (<Input placeholder="请输入政府采购服务类型"  maxlength="10" style={{ width: 200 }}/>
                                )
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="起始年月" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.area:
                                getFieldDecorator('begdate',{
                                    initialValue:moment(tableInfo.begdate),
                                })
                                (<DatePicker  style={{ width: 200 }}/>)   
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="结束年月" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.areaCode:
                                getFieldDecorator('enddate',{
                                    initialValue:moment(tableInfo.enddate),
                                })
                                (<DatePicker  style={{ width: 200 }}/>
                                )
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="项目负责人" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.area:
                                getFieldDecorator('xmfzrname',{
                                    initialValue:tableInfo.xmfzrname,
                                })
                                (<Input placeholder="请输入项目负责人"  maxlength="30" style={{ width: 200 }}/>)    
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="负责人联系方式" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.areaCode:
                                getFieldDecorator('link',{
                                    initialValue:tableInfo.link,
                                })
                                (<Input placeholder="请输入政府采购服务类型"  maxlength="50" style={{ width: 200 }}/>
                                )
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                </Row>
                <Row>
                    <Col>
                    <div className="gutter-box">
                    <FormItem label="项目概况"  >
                            {   
                                //tableInfo && type=='detail'? tableInfo.cbwz:
                                getFieldDecorator('xmdet',{
                                    initialValue:tableInfo.xmdet,
                                    rules:[
                                        {
                                            required: true,
                                            message:'项目概况不能为空！'
                                        }
                                    ]
                                })
                                (<TextArea style={{ width: 556 }}
                                    autosize={{minRows:2}}
                                    placeholder="请输入项目概况" 
                                    />
                                )
                            }
                        </FormItem>
                    </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                    <div className="gutter-box">
                    <FormItem label="项目申报依据"  >
                            {   
                                //tableInfo && type=='detail'? tableInfo.cbwz:
                                getFieldDecorator('xmsbyj',{
                                    initialValue:tableInfo.xmsbyj,
                                    rules:[
                                        {
                                            required: true,
                                            message:'项目申报依据不能为空！'
                                        }
                                    ]
                                })
                                (<TextArea style={{ width: 556 }}
                                    autosize={{minRows:2}}
                                    placeholder="请输入项目申报依据" 
                                    />
                                )
                            }
                        </FormItem>
                    </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                    <div className="gutter-box">
                    <FormItem label="项目测算标准"  >
                            {   
                                //tableInfo && type=='detail'? tableInfo.cbwz:
                                getFieldDecorator('xmcsbz',{
                                    initialValue:tableInfo.xmcsbz,
                                    rules:[
                                        {
                                            required: true,
                                            message:'项目测算标准不能为空'
                                        }
                                    ]
                                })
                                (<TextArea style={{ width: 556 }}
                                    autosize={{minRows:2}}
                                    placeholder="请输入项目测算标准" 
                                    />
                                )
                            }
                        </FormItem>
                    </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                    <div className="gutter-box">
                    <FormItem label="专家论证情况"  >
                            {   
                                //tableInfo && type=='detail'? tableInfo.cbwz:
                                getFieldDecorator('zjlzdet',{
                                    initialValue:tableInfo.zjlzdet,
                                })
                                (<TextArea style={{ width: 556 }}
                                    autosize={{minRows:2}}
                                    placeholder="请输入专家论证情况" 
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

const mapStateToProps = state => {
    return {
        userId: state.userId
    }
};
export default connect(mapStateToProps)(Xmjbxx)