import React from 'react';
import {  Button , Form ,  Breadcrumb , Modal , message ,Input , InputNumber , Layout ,Select ,DatePicker ,Row, Col} from  'antd';
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
export default class Yjsjsl extends React.Component{
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
        axios.requestList(_this,FaceUrl.sjsl,FaceUrl.POST,FaceUrl.bdApi,this.params);
    }

    //查询
    handleSearchTable = (value)=>{
        let _this =this;
        this.params.query = {"searchInfo":value}
        axios.requestList(_this,FaceUrl.sjsl,FaceUrl.POST,FaceUrl.bdApi,this.params);
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
                url:FaceUrl.sjslAdd,
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
                        url:FaceUrl.sjslDel,
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
                 title:'信息标题',
                 dataIndex:'xxbt',
                 key:'xxbt',
                 align:'center',
                 render:(xxbt,record)=>{
                     return <a  href="javascript:;" onClick={()=>{this.handleDetail(record)}}>{xxbt}</a>;
                }
             },
             {
                title:'接报编号',
                dataIndex:'jbCode',
                key:'jbCode',
                align:'center',
            },
             {
                 title:'事件',
                 dataIndex:'sj',
                 key:'sj',
                 align:'center',
            },
             {
                 title:'报送时间',
                 dataIndex:'bsTime',
                 key:'bsTime',
                 align:'center',
                 render(bsTime){
                    return moment(bsTime).format('YYYY-MM-DD')
                 }
            },
            {
                title:'报送单位',
                dataIndex:'bsdw',
                key:'bsdw',
                align:'center',
            },
            {
                title:'报送人',
                dataIndex:'bsr',
                key:'bsr',
                align:'center',
           },
           {
               title:'报送方式',
               dataIndex:'bsfs',
               key:'bsfs',
               align:'center',
           },
           {
            title:'事件类型 ',
            dataIndex:'sjType',
            key:'sjType',
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
                    <Breadcrumb.Item>应急事件处理</Breadcrumb.Item>
                    <Breadcrumb.Item>应急事件受理</Breadcrumb.Item>
                </Breadcrumb>
                <Content className="content-wrap">
                    <div >
                    <span className="table_input ft">
                        <Search size="large" style={{width: 325}}
                        name="searchInfo"
                        placeholder="请输入信息标题/事件/报送人"
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
                            <FormItem label="信息标题" {...formItemLayout}>
                                {   
                                    //tableInfo && type=='detail'? tableInfo.cbkName: 
                                    getFieldDecorator('xxbt',{
                                        initialValue:tableInfo.xxbt,
                                        rules:[
                                            {
                                                required: true,
                                                message:'信息标题不能为空！'
                                            }
                                        ]
                                    })
                                    (<Input placeholder="请输信息标题"  maxlength="100" style={{ width: 200 }}/>
                                    )
                                }
                            </FormItem>
                        </div>
                    </Col>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="接报编号" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.cbkCode: 
                                getFieldDecorator('jbCode',{
                                    initialValue:tableInfo.jbCode,
                                    rules:[
                                        {
                                            required: true,
                                            message:'接报编号不能为空！'
                                        }
                                    ]
                                })
                                (<Input placeholder="请输入接报编号"  maxlength="20" style={{ width: 200 }}/>
                                )
                            }
                        </FormItem>
                    </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                    <div className="gutter-box">
                    <FormItem label="事件"  >
                            {   
                                //tableInfo && type=='detail'? tableInfo.cbwz:
                                getFieldDecorator('sj',{
                                    initialValue:tableInfo.sj,
                                    rules:[
                                        {
                                            required: true,
                                            message:'事件不能为空！'
                                        }
                                    ]
                                })
                                (<TextArea style={{ width: 526 }}
                                    autosize={{minRows:2}}
                                    placeholder="请输入事件" 
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
                    <FormItem label="报送时间" {...formItemLayout}>
                    {   
                        //tableInfo && type=='detail'? tableInfo.cbkType: 
                        getFieldDecorator('bsTime',{
                            initialValue:moment(tableInfo.bsTime),
                            
                        })(
                            <DatePicker  style={{ width: 200 }}/>
                        )
                    }
                </FormItem>
                    </div>
                    </Col>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="报送单位" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.cbkGrade:
                                getFieldDecorator('bsdw',{
                                    initialValue:tableInfo.bsdw,
                                    rules:[
                                        {
                                            required: true,
                                            message:'报送单位不能为空！'
                                        }
                                    ]
                                })
                                (<Input placeholder="请输入报送单位" maxlength="200" style={{ width: 200 }}/>
                                )
                            }
                        </FormItem>
                    </div>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="报送人" {...formItemLayout}>
                    {   
                        //tableInfo && type=='detail'? tableInfo.cbkType: 
                        getFieldDecorator('bsr',{
                            initialValue:tableInfo.bsr,
                            
                        })(
                            <Input placeholder="请输入报送单位" maxlength="20" style={{ width: 200 }}/>
                        )
                    }
                </FormItem>
                    </div>
                    </Col>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="联系电话" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.cbkGrade:
                                getFieldDecorator('dwTel',{
                                    initialValue:tableInfo.dwTel,
                                    
                                })
                                (<Input placeholder="请输入联系电话" maxlength="20" style={{ width: 200 }}/>
                                )
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="报送方式" {...formItemLayout}>
                    {   
                        //tableInfo && type=='detail'? tableInfo.cbkType: 
                        getFieldDecorator('bsfs',{
                            initialValue:tableInfo.bsfs,
                            
                        })(
                            <Input placeholder="请输入报送方式" maxlength="50" style={{ width: 200 }}/>
                        )
                    }
                </FormItem>
                    </div>
                    </Col>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="事发时间" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.cbkGrade:
                                getFieldDecorator('sjfssj',{
                                    initialValue:moment(tableInfo.sjfssj),
                                    
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
                    <FormItem label="事件类型" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.area:
                                getFieldDecorator('sjType',{
                                    initialValue:tableInfo.sjType,
                                })
                                (<Input placeholder="请输入事件类型"  maxlength="50" style={{ width: 200 }}/>)    
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="事件等级" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.areaCode:
                                getFieldDecorator('sjdj',{
                                    initialValue:tableInfo.sjdj,
                                })
                                (<Input placeholder="请输入事件等级"  maxlength="10" style={{ width: 200 }}/>
                                )
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="行政区划" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.area:
                                getFieldDecorator('areaCode',{
                                    initialValue:tableInfo.areaCode,
                                })
                                (<Input placeholder="请输入行政区划"  maxlength="10" style={{ width: 200 }}/> )   
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="事发地点" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.areaCode:
                                getFieldDecorator('sjAddr',{
                                    initialValue:tableInfo.sjAddr,
                                })
                                (<Input placeholder="请输入事发地点"  maxlength="200" style={{ width: 200 }}/>
                                )
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                </Row>
                <Row>
                    <Col>
                    <div className="gutter-box">
                    <FormItem label="涉及范围"  >
                            {   
                                //tableInfo && type=='detail'? tableInfo.cbwz:
                                getFieldDecorator('sjfw',{
                                    initialValue:tableInfo.sjfw,
                                })
                                (<TextArea style={{ width: 526 }}
                                    autosize={{minRows:2}}
                                    placeholder="请输入涉及范围" 
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
                    <FormItem label="事件原因"  >
                            {   
                                //tableInfo && type=='detail'? tableInfo.cbwz:
                                getFieldDecorator('sjyy',{
                                    initialValue:tableInfo.sjyy,
                                })
                                (<TextArea style={{ width: 526 }}
                                    autosize={{minRows:2}}
                                    placeholder="请输入事件原因" 
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
                    <FormItem label="事件描述"  >
                            {   
                                //tableInfo && type=='detail'? tableInfo.cbwz:
                                getFieldDecorator('sjms',{
                                    initialValue:tableInfo.sjms,
                                })
                                (<TextArea style={{ width: 526 }}
                                    autosize={{minRows:2}}
                                    placeholder="请输入事件描述" 
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
                    <FormItem label="经度" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.area:
                                getFieldDecorator('longitude',{
                                    initialValue:tableInfo.longitude,
                                })
                                (<InputNumber placeholder="请输入经度"   style={{ width: 200 }}/>)    
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="纬度" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.areaCode:
                                getFieldDecorator('latitude',{
                                    initialValue:tableInfo.latitude,
                                })
                                (<InputNumber placeholder="请输入纬度"   style={{ width: 200 }}/>
                                )
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                </Row>
                <Row >
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="高程" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.cbkAdd:
                                getFieldDecorator('gc',{
                                    initialValue:tableInfo.gc,
                                })
                                (<Input placeholder="请输入高程"  maxlength="20" style={{ width: 200 }}/>
                                )
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="签发人" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.kr:
                                getFieldDecorator('qfrName',{
                                    initialValue:tableInfo.qfrName,
                                })
                                (<Input placeholder="请输入签发人"  maxlength="20" style={{ width: 200 }}/> 
                                )
                            }
                        </FormItem>
                    </div>
                       
                    </Col>
                </Row>
                <Row >
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="死亡人数" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.cbkAdd:
                                getFieldDecorator('swNum',{
                                    initialValue:tableInfo.swNum,
                                })
                                (<InputNumber placeholder="请输入死亡人数"   style={{ width: 200 }}/>
                                )
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="受伤人数" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.kr:
                                getFieldDecorator('ssNum',{
                                    initialValue:tableInfo.ssNum,
                                })
                                (<InputNumber placeholder="请输入受伤人数" style={{ width: 200 }}/> 
                                )
                            }
                        </FormItem>
                    </div>
                       
                    </Col>
                </Row>
                <Row >
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="失踪人数" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.cbkAdd:
                                getFieldDecorator('szNum',{
                                    initialValue:tableInfo.szNum,
                                })
                                (<InputNumber placeholder="请输入失踪人数"  style={{ width: 200 }}/>
                                )
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="受困人数" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.kr:
                                getFieldDecorator('skNum',{
                                    initialValue:tableInfo.skNum,
                                })
                                (<InputNumber placeholder="请输入受困人数"  style={{ width: 200 }}/> 
                                )
                            }
                        </FormItem>
                    </div>
                       
                    </Col>
                </Row>
                <Row >
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="受灾人数" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.cbkAdd:
                                getFieldDecorator('sziNum',{
                                    initialValue:tableInfo.sziNum,
                                })
                                (<InputNumber placeholder="请输入受灾人数"  style={{ width: 200 }}/> 
                                )
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="影响半径" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.kr:
                                getFieldDecorator('yxbj',{
                                    initialValue:tableInfo.yxbj,
                                })
                                (<Input placeholder="请输入影响半径"  maxlength="200" style={{ width: 200 }}/> 
                                )
                            }
                        </FormItem>
                    </div>
                       
                    </Col>
                </Row>
                <Row >
                    <Col span={24}>
                    <div className="gutter-box">
                    <FormItem label="影响程度" >
                            {   
                                //tableInfo && type=='detail'? tableInfo.zbjt:
                                getFieldDecorator('yxcd',{
                                    initialValue:tableInfo.yxcd,
                                    rules:[]
                                })(
                                    <TextArea style={{ width: 526 }}
                                    autosize={{minRows:2}}
                                    placeholder="请输入影响程度" 
                                        />
                                )
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                </Row>
                <Row >
                    <Col span={24}>
                    <div className="gutter-box">
                    <FormItem label="经济损失" >
                            {   
                                //tableInfo && type=='detail'? tableInfo.zbjt:
                                getFieldDecorator('jjss',{
                                    initialValue:tableInfo.jjss,
                                    rules:[]
                                })(
                                    <TextArea style={{ width: 526 }}
                                    autosize={{minRows:2}}
                                    placeholder="请输入经济损失" 
                                        />
                                )
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                </Row>
                <Row >
                    <Col span={24}>
                    <div className="gutter-box">
                    <FormItem label="损失程度描述" >
                            {   
                                //tableInfo && type=='detail'? tableInfo.zbjt:
                                getFieldDecorator('sscd',{
                                    initialValue:tableInfo.sscd,
                                    rules:[]
                                })(
                                    <TextArea style={{ width: 526 }}
                                    autosize={{minRows:2}}
                                    placeholder="请输入损失程度描述" 
                                        />
                                )
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                </Row>
                <Row >
                    <Col span={24}>
                    <div className="gutter-box">
                    <FormItem label="救援进展情况" >
                            {   
                                //tableInfo && type=='detail'? tableInfo.zbjt:
                                getFieldDecorator('jyjz',{
                                    initialValue:tableInfo.jyjz,
                                    rules:[]
                                })(
                                    <TextArea style={{ width: 526 }}
                                    autosize={{minRows:2}}
                                    placeholder="请输入救援进展情况" 
                                        />
                                )
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                </Row>
                <Row >
                    <Col span={24}>
                    <div className="gutter-box">
                    <FormItem label="附件信息" >
                            {   
                                //tableInfo && type=='detail'? tableInfo.zbjt:
                                getFieldDecorator('fjxx',{
                                    initialValue:tableInfo.fjxx,
                                    rules:[]
                                })(
                                <TextArea style={{ width: 526 }}
                                autosize={{minRows:2}}
                                placeholder="请输入附件信息" 
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