import React from 'react';
import { Button , Form , Breadcrumb , Modal , message ,Input , InputNumber , Layout , Select , DatePicker , Row , Col} from  'antd';
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
export default class Yjjydw extends React.Component{
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
        axios.requestList(_this,FaceUrl.jydw,FaceUrl.POST,FaceUrl.bdApi,this.params);
    }

    //查询
    handleSearchTable = (value)=>{
        let _this =this;
        this.params.query = {"searchInfo":value}
        axios.requestList(_this,FaceUrl.jydw,FaceUrl.POST,FaceUrl.bdApi,this.params);
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
                url:FaceUrl.jydwAdd,
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
                        url:FaceUrl.jydwDel,
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
                 title:'救援队伍名称',
                 dataIndex:'jydwName',
                 key:'jydwName',
                 align:'center',
                 render:(jydwName,record)=>{
                    return <a  href="javascript:;" onClick={()=>{this.handleDetail(record)}}>{jydwName}</a>;
               }
             },
             {
                title:'救援队伍编号',
                dataIndex:'jydwCode',
                key:'jydwCode',
                align:'center'
            },
             {
                 title:'密级',
                 dataIndex:'mj',
                 key:'mj',
                 align:'center',

             },
             {
                title:'类型',
                dataIndex:'jydwType',
                key:'jydwType',
                align:'center',
                render(jydwType){
                    let config = Dictionary.jydwType
                    return config[jydwType];
                }
            },
            {
                title:'主要职责',
                dataIndex:'zyzz',
                key:'zyzz',
                align:'center'
            },
            {
                title:'级别',
                dataIndex:'jb',
                key:'jb',
                align:'center'
            },
            {
                title:'行政区划',
                dataIndex:'areaCode',
                key:'areaCode',
                align:'center'
            },
            {
                title:'地址',
                dataIndex:'jyAddr',
                key:'jyAddr',
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
                    <Breadcrumb.Item>应急救援队伍</Breadcrumb.Item>
                </Breadcrumb>
                <Content className="content-wrap">
                    <div >
                    <span className="table_input ft">
                        <Search size="large" style={{width: 325}}
                        name="searchInfo"
                        placeholder="请输入救援队伍名称/编号/地址"
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
                            <FormItem label="救援队伍名称" {...formItemLayout}>
                                {   
                                    //tableInfo && type=='detail'? tableInfo.cbkName: 
                                    getFieldDecorator('jydwName',{
                                        initialValue:tableInfo.jydwName,
                                        rules:[
                                            {
                                                required: true,
                                                message:'救援队伍名称不能为空！'
                                            }
                                        ]
                                    })
                                    (<Input placeholder="请输救援队伍名称" style={{ width: 200 }}/>
                                    )
                                }
                            </FormItem>
                        </div>
                    </Col>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="救援队伍编号" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.cbkCode: 
                                getFieldDecorator('jydwCode',{
                                    initialValue:tableInfo.jydwCode,
                                    rules:[
                                        {
                                            required: true,
                                            message:'救援队伍编号不能为空！'
                                        }
                                    ]
                                })
                                (<Input placeholder="请输入救援队伍编号" style={{ width: 200 }}/>
                                )
                            }
                        </FormItem>
                    </div>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="密级" {...formItemLayout}>
                        {   
                            //tableInfo && type=='detail'? tableInfo.cbkCode: 
                            getFieldDecorator('mj',{
                                initialValue:tableInfo.mj,
                                rules:[
                                    {
                                        required: true,
                                        message:'密级不能为空！'
                                    }
                                ]
                            })
                            (<Input placeholder="请输入密级" maxlength="2" style={{ width: 200 }}/>
                            )
                        }
                </FormItem>
                    </div>
                    </Col>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="类型" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.cbkGrade:
                                getFieldDecorator('jydwType',{
                                    initialValue:tableInfo.jydwType ? tableInfo.jydwType :"1",
                                    rules:[
                                        {
                                            required: true,
                                            message:'类型不能为空！'
                                        }
                                    ]
                                })
                                (
                                    <Select style={{ width: 200 }} >
                                    <Option value="1">防汛抗旱应急队</Option>
                                    <Option value="2">气象灾难应急队</Option>
                                    <Option value="3">地质灾害应急队</Option>
                                    <Option value="4">地震灾害应急队</Option>
                                    <Option value="5">森林防火应急队</Option>
                                    <Option value="6">矿山、危险化学品应急队</Option>
                                    <Option value="7">环境污染应急队</Option>
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
                    <FormItem label="级别" {...formItemLayout}>
                        {   
                            //tableInfo && type=='detail'? tableInfo.cbkCode: 
                            getFieldDecorator('jb',{
                                initialValue:tableInfo.jb,
                                rules:[
                                    {
                                        required: true,
                                        message:'级别不能为空！'
                                    }
                                ]
                            })
                            (
                                <Input placeholder="请输入级别" maxlength="2" style={{ width: 200 }}/>
                            )
                        }
                </FormItem>
                    </div>
                    </Col>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="行政区划" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.cbkGrade:
                                getFieldDecorator('areaCode',{
                                    initialValue:tableInfo.areaCode,
                                    rules:[
                                        {
                                            required: true,
                                            message:'行政区划不能为空！'
                                        }
                                    ]
                                })
                                ( 
                                    <Input placeholder="请输入行政区划" style={{ width: 200 }}/>
                                )
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="地址" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.area:
                                getFieldDecorator('jyAddr',{
                                    initialValue:tableInfo.jyAddr,
                                })
                                (<Input placeholder="请输入地址" style={{ width: 200 }}/> )
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="社会信用代码" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.areaCode:
                                getFieldDecorator('xyCode',{
                                    initialValue:tableInfo.xyCode,
                                })
                                (<Input placeholder="请输入社会信用代码" style={{ width: 200 }}/>
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
                                //tableInfo && type=='detail'? tableInfo.kr:
                                getFieldDecorator('longitude',{
                                    initialValue:tableInfo.longitude,
                                })
                                (<InputNumber style={{ width: 200 }}/>    
                                )
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="纬度" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.fzrName:
                                getFieldDecorator('latitude',{
                                    initialValue:tableInfo.latitude,
                                })
                                (<InputNumber style={{ width: 200 }}/>  
                                )
                            }
                        </FormItem>
                    
                    </div>
                        
                    </Col>
                </Row>
                <Row >
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="总人数" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.cbkAdd:
                                getFieldDecorator('zrsNum',{
                                    initialValue:tableInfo.zrsNum,
                                })
                                (<InputNumber style={{ width: 200 }}/>    
                                )
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="成立时间" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.fzrOffTel:
                                getFieldDecorator('clDate',{
                                    initialValue:moment(tableInfo.clDate),
                                })
                                (
                                    <DatePicker  style={{ width: 200 }}/>
                                )
                            }
                        </FormItem>
                    
                    </div>
                       
                    </Col>
                </Row>
                <Row >
                    <Col span={24}>
                    <div className="gutter-box">
                    <FormItem label="主要职责" >
                            {   
                                //tableInfo && type=='detail'? tableInfo.zbjt:
                                getFieldDecorator('zyzz',{
                                    initialValue:tableInfo.zyzz,
                                    rules:[]
                                })(
                                <TextArea style={{ width: 526 }}
                                autosize={{minRows:2}}
                                placeholder="请输入主要职责" 
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
                    <FormItem label="主要装备描述" >
                            {   
                                //tableInfo && type=='detail'? tableInfo.zbjt:
                                getFieldDecorator('zyzb',{
                                    initialValue:tableInfo.zyzb,
                                    rules:[]
                                })(
                                <TextArea style={{ width: 526 }}
                                autosize={{minRows:2}}
                                placeholder="请输入主要装备描述" 
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
                    <FormItem label="专长描述" >
                            {   
                                //tableInfo && type=='detail'? tableInfo.zbjt:
                                getFieldDecorator('zc',{
                                    initialValue:tableInfo.zc,
                                    rules:[]
                                })(
                                <TextArea style={{ width: 526 }}
                                autosize={{minRows:2}}
                                placeholder="请输入专长描述" 
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
                    <FormItem label="资质等级" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.kr:
                                getFieldDecorator('zzdj',{
                                    initialValue:tableInfo.zzdj,
                                })
                                (<Input placeholder="请输入资质等级" maxlength="2" style={{ width: 200 }}/>
                                )
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="值班电话" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.fzrName:
                                getFieldDecorator('zbTel',{
                                    initialValue:tableInfo.zbTel,
                                })
                                (<Input placeholder="请输入值班电话" style={{ width: 200 }}/>
                                )
                            }
                        </FormItem>
                    
                    </div>
                        
                    </Col>
                </Row>
                <Row >
                    <Col span={24}>
                    <div className="gutter-box">
                    <FormItem label="应急救援经历" >
                            {   
                                //tableInfo && type=='detail'? tableInfo.zbjt:
                                getFieldDecorator('yjjyjl',{
                                    initialValue:tableInfo.yjjyjl,
                                    rules:[]
                                })(
                                <TextArea style={{ width: 526 }}
                                autosize={{minRows:2}}
                                placeholder="请输入应急救援经历" 
                                    />
                                )
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                </Row>
                <Row >
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="传真" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.fzrMob:
                                getFieldDecorator('fax',{
                                    initialValue:tableInfo.fax,
                                })
                                (<Input placeholder="请输入传真" style={{ width: 200 }}/>
                                )
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="负责人" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.linkName:
                                getFieldDecorator('fzrName',{
                                    initialValue:tableInfo.fzrName,
                                })
                                (<Input placeholder="请输入负责人" style={{ width: 200 }}/>
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
                                getFieldDecorator('fzrTel',{
                                    initialValue:tableInfo.fzrTel,
                                })
                                (<Input placeholder="请输入办公电话" style={{ width: 200 }}/>
                                )
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="移动电话" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.linkMob:
                                getFieldDecorator('fzrMob',{
                                    initialValue:tableInfo.fzrMob,
                                })
                                (<Input placeholder="请输入移动电话" style={{ width: 200 }}/>
                                )
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                </Row>
                <Row >
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="联系人" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.longitude:
                                getFieldDecorator('linkName',{
                                    initialValue:tableInfo.linkName,
                                })
                                (<Input placeholder="请输入联系人" style={{ width: 200 }}/>
                                )
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="办公电话" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.syDate:
                                getFieldDecorator('linkTel',{
                                    initialValue:tableInfo.linkTel,
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
                    <FormItem label="移动电话" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.latitude:
                                getFieldDecorator('linkMob',{
                                    initialValue:tableInfo.linkMob,
                                })
                                (<Input placeholder="请输入移动电话" style={{ width: 200 }}/>
                                )
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="主管单位" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.synx:
                                getFieldDecorator('zgdw',{
                                    initialValue:tableInfo.zgdw,
                                })
                                ( <Input placeholder="请输入主管单位" style={{ width: 200 }}/>
                                )
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                </Row>
                <Row >
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="单位电话" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.latitude:
                                getFieldDecorator('zgdwTel',{
                                    initialValue:tableInfo.zgdwTel,
                                })
                                (<Input placeholder="请输入单位电话" style={{ width: 200 }}/>
                                )
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="应急通信方式" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.synx:
                                getFieldDecorator('yjtxfs',{
                                    initialValue:tableInfo.yjtxfs,
                                })
                                ( <Input placeholder="请输入应急通信方式" style={{ width: 200 }}/>
                                )
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                </Row>
                <Row >
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="队伍属性" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.latitude:
                                getFieldDecorator('dwFlag',{
                                    initialValue:tableInfo.dwFlag ? tableInfo.dwFlag : '0',
                                })
                                (
                                    <Select style={{ width: 200 }} >
                                        <Option value="0">现有</Option>
                                        <Option value="1">可调用</Option>
                                </Select>
                                )
                            }
                    </FormItem>
                    </div>
                        
                    </Col>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="数据来源单位" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.synx:
                                getFieldDecorator('sjlydw',{
                                    initialValue:tableInfo.sjlydw,
                                })
                                ( <Input placeholder="请输入数据来源单位" style={{ width: 200 }}/>
                                )
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                </Row>
                <Row >
                    <Col span={24}>
                    <div className="gutter-box">
                    <FormItem label="备注" >
                            {   
                                //tableInfo && type=='detail'? tableInfo.zbjt:
                                getFieldDecorator('remark',{
                                    initialValue:tableInfo.remark,
                                    rules:[]
                                })(
                                <TextArea style={{ width: 526 }}
                                autosize={{minRows:3}}
                                placeholder="请输入备注" 
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
