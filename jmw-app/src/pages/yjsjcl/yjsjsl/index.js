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
                 dataIndex:'jydwName',
                 key:'jydwName',
                 align:'center',
                 render:(jydwName,record)=>{
                     return <a  href="javascript:;" onClick={()=>{this.handleDetail(record)}}>{jydwName}</a>;
                }
             },
             {
                title:'接报编号',
                dataIndex:'jydwCode',
                key:'jydwCode',
                align:'center',
            },
             {
                 title:'事件',
                 dataIndex:'mj',
                 key:'mj',
                 align:'center',
            },
             {
                 title:'报送时间',
                 dataIndex:'jydwType',
                 key:'jydwType',
                 align:'center',
                 render(jaDate){
                    return moment(jaDate).format('YYYY-MM-DD')
                 }
            },
            {
                title:'报送单位',
                dataIndex:'zc',
                key:'zc',
                align:'center',
            },
            {
                title:'报送人',
                dataIndex:'zyType',
                key:'zyType',
                align:'center',
           },
           {
               title:'报送方式',
               dataIndex:'zytc',
               key:'zytc',
               align:'center',
           },
           {
            title:'事件类型 ',
            dataIndex:'szzjz',
            key:'szzjz',
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
                            <FormItem label="专家名称" {...formItemLayout}>
                                {   
                                    //tableInfo && type=='detail'? tableInfo.cbkName: 
                                    getFieldDecorator('jydwName',{
                                        initialValue:tableInfo.jydwName,
                                        rules:[
                                            {
                                                required: true,
                                                message:'专家名称不能为空！'
                                            }
                                        ]
                                    })
                                    (<Input placeholder="请输专家名称"  maxlength="100" style={{ width: 200 }}/>
                                    )
                                }
                            </FormItem>
                        </div>
                    </Col>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="专家编号" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.cbkCode: 
                                getFieldDecorator('jydwCode',{
                                    initialValue:tableInfo.jydwCode,
                                    rules:[
                                        {
                                            required: true,
                                            message:'专家编号不能为空！'
                                        }
                                    ]
                                })
                                (<Input placeholder="请输入专家编号"  maxlength="50" style={{ width: 200 }}/>
                                )
                            }
                        </FormItem>
                    </div>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="类型" {...formItemLayout}>
                    {   
                        //tableInfo && type=='detail'? tableInfo.cbkType: 
                        getFieldDecorator('jydwType',{
                            initialValue:tableInfo.jydwType ? tableInfo.jydwType : '1',
                            rules:[
                                {
                                    required: true,
                                    message:'请选择类型'
                                }
                            ]
                        })(
                            <Select style={{ width: 200 }} >
                                <Option value="1">自然灾害类</Option>
                                <Option value="2">事故灾难类</Option>
                                <Option value="3">公共卫生事件类</Option>
                                <Option value="4">社会安全事件类</Option>
                            </Select>
                        )
                    }
                </FormItem>
                    </div>
                    </Col>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="密级" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.cbkGrade:
                                getFieldDecorator('mj',{
                                    initialValue:tableInfo.mj,
                                    rules:[
                                        {
                                            required: true,
                                            message:'级别不能为空！'
                                        }
                                    ]
                                })
                                (<Input placeholder="请输入级别名称" maxlength="2" style={{ width: 200 }}/>
                                )
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="所在专家组" {...formItemLayout}>
                    {   
                        //tableInfo && type=='detail'? tableInfo.cbkType: 
                        getFieldDecorator('szzjz',{
                            initialValue:tableInfo.szzjz ? tableInfo.szzjz : '1',
                            
                        })(
                            <Select style={{ width: 200 }} >
                                <Option value="1">煤矿组</Option>
                                <Option value="2">机电排水</Option>
                                <Option value="3">采矿通风</Option>
                            </Select>
                        )
                    }
                </FormItem>
                    </div>
                    </Col>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="民族" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.cbkGrade:
                                getFieldDecorator('mz',{
                                    initialValue:tableInfo.mz,
                                    
                                })
                                (<Input placeholder="请输入民族" maxlength="20" style={{ width: 200 }}/>
                                )
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="性别" {...formItemLayout}>
                    {   
                        //tableInfo && type=='detail'? tableInfo.cbkType: 
                        getFieldDecorator('jydwType',{
                            initialValue:tableInfo.sex ? tableInfo.sex : '1',
                            
                        })(
                            <Select style={{ width: 200 }} >
                                <Option value="1">男</Option>
                                <Option value="2">女</Option>
                                <Option value="0">未知</Option>
                                <Option value="9">未说明的性别</Option>
                            </Select>
                        )
                    }
                </FormItem>
                    </div>
                    </Col>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="出生日期" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.cbkGrade:
                                getFieldDecorator('csrq',{
                                    initialValue:moment(tableInfo.csrq),
                                    
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
                    <FormItem label="工作单位" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.area:
                                getFieldDecorator('gzdw',{
                                    initialValue:tableInfo.gzdw,
                                })
                                (<Input placeholder="请输入工作单位"  maxlength="200" style={{ width: 200 }}/>)    
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="职称" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.areaCode:
                                getFieldDecorator('zc',{
                                    initialValue:tableInfo.zc,
                                })
                                (<Input placeholder="请输入职称"  maxlength="20" style={{ width: 200 }}/>
                                )
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="行政职务" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.area:
                                getFieldDecorator('xzzw',{
                                    initialValue:tableInfo.xzzw,
                                })
                                (<Input placeholder="请输入行政职务"  maxlength="20" style={{ width: 200 }}/> )   
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="专业类型" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.areaCode:
                                getFieldDecorator('zyType',{
                                    initialValue:tableInfo.zyType,
                                })
                                (<Input placeholder="请输入专业类型"  maxlength="50" style={{ width: 200 }}/>
                                )
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                </Row>
                <Row>
                    <Col>
                    <div className="gutter-box">
                    <FormItem label="专业特长描述"  >
                            {   
                                //tableInfo && type=='detail'? tableInfo.cbwz:
                                getFieldDecorator('zytc',{
                                    initialValue:tableInfo.zytc,
                                })
                                (<TextArea style={{ width: 526 }}
                                    autosize={{minRows:2}}
                                    placeholder="请输入专业特长描述" 
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
                    <FormItem label="家庭住址" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.area:
                                getFieldDecorator('jtAddr',{
                                    initialValue:tableInfo.jtAddr,
                                })
                                (<Input placeholder="请输入家庭住址"  maxlength="200" style={{ width: 200 }}/>)    
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="身份证号码" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.areaCode:
                                getFieldDecorator('sfz',{
                                    initialValue:tableInfo.sfz,
                                })
                                (<Input placeholder="请输入身份证号码"  maxlength="20" style={{ width: 200 }}/>
                                )
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                </Row>
                <Row >
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="籍贯" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.cbkAdd:
                                getFieldDecorator('jg',{
                                    initialValue:tableInfo.jg,
                                })
                                (<Input placeholder="请输入籍贯"  maxlength="30" style={{ width: 200 }}/>
                                )
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="户籍所在地" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.kr:
                                getFieldDecorator('hjszd',{
                                    initialValue:tableInfo.hjszd,
                                })
                                (<Input placeholder="请输入户籍所在地"  maxlength="100" style={{ width: 200 }}/> 
                                )
                            }
                        </FormItem>
                    </div>
                       
                    </Col>
                </Row>
                <Row >
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="政治面貌" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.cbkAdd:
                                getFieldDecorator('zcmm',{
                                    initialValue:tableInfo.zcmm,
                                })
                                (<Input placeholder="请输入政治面貌"  maxlength="20" style={{ width: 200 }}/>
                                )
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="健康状况" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.kr:
                                getFieldDecorator('jkzk',{
                                    initialValue:tableInfo.jkzk,
                                })
                                (<Input placeholder="请输入健康状况"  maxlength="20" style={{ width: 200 }}/> 
                                )
                            }
                        </FormItem>
                    </div>
                       
                    </Col>
                </Row>
                <Row >
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="最高学历" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.cbkAdd:
                                getFieldDecorator('zgxl',{
                                    initialValue:tableInfo.zgxl,
                                })
                                (<Input placeholder="请输入最高学历"  maxlength="20" style={{ width: 200 }}/>
                                )
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="毕业院校" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.kr:
                                getFieldDecorator('byyx',{
                                    initialValue:tableInfo.byyx,
                                })
                                (<Input placeholder="请输入毕业院校"  maxlength="100" style={{ width: 200 }}/> 
                                )
                            }
                        </FormItem>
                    </div>
                       
                    </Col>
                </Row>
                <Row >
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="参加工作时间" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.cbkAdd:
                                getFieldDecorator('cjgzDate',{
                                    initialValue:moment(tableInfo.cjgzDate),
                                })
                                (<DatePicker  style={{ width: 200 }}/>
                                )
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="移动电话" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.kr:
                                getFieldDecorator('mob',{
                                    initialValue:tableInfo.mob,
                                })
                                (<Input placeholder="请输入移动电话"  maxlength="20" style={{ width: 200 }}/> 
                                )
                            }
                        </FormItem>
                    </div>
                       
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="办公电话" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.fzrName:
                                getFieldDecorator('tel',{
                                    initialValue:tableInfo.tel,
                                })
                                (<Input placeholder="请输入办公电话"  maxlength="20" style={{ width: 200 }}/>
                                )
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="传真" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.fzrOffTel:
                                getFieldDecorator('fax',{
                                    initialValue:tableInfo.fax,
                                })
                                (<Input placeholder="请输入传真"  maxlength="20" style={{ width: 200 }}/>
                                )
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                </Row>
                <Row >
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="电子邮箱" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.fzrMob:
                                getFieldDecorator('email',{
                                    initialValue:tableInfo.email,
                                    rules: [{
                                        type: 'email', message: '无效的电子邮箱!',
                                      }],
                                })
                                (<Input placeholder="请输入电子邮箱" style={{ width: 200 }}/>
                                )
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="主管部门电话" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.linkName:
                                getFieldDecorator('deptTel',{
                                    initialValue:tableInfo.deptTel,
                                })
                                (<Input placeholder="请输入主管部门电话"  maxlength="20" style={{ width: 200 }}/>
                                )
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                </Row>
                <Row >
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="单位通信地址" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.linkOffTel:
                                getFieldDecorator('dwAddr',{
                                    initialValue:tableInfo.dwAddr,
                                })
                                (<Input placeholder="请输入单位通信地址"  maxlength="200" style={{ width: 200 }}/>
                                )
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="单位邮政编码" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.linkMob:
                                getFieldDecorator('postCode',{
                                    initialValue:tableInfo.postCode,
                                })
                                (<Input placeholder="请输入单位邮政编码" style={{ width: 200 }}/>
                                )
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                </Row>
                <Row >
                    <Col span={24}>
                    <div className="gutter-box">
                    <FormItem label="工作简历" >
                            {   
                                //tableInfo && type=='detail'? tableInfo.zbjt:
                                getFieldDecorator('gzjl',{
                                    initialValue:tableInfo.gzjl,
                                    rules:[]
                                })(
                                <TextArea style={{ width: 526 }}
                                autosize={{minRows:2}}
                                placeholder="请输入工作简历" 
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
                    <FormItem label="主要成果" >
                            {   
                                //tableInfo && type=='detail'? tableInfo.zbjt:
                                getFieldDecorator('zycg',{
                                    initialValue:tableInfo.zycg,
                                    rules:[]
                                })(
                                <TextArea style={{ width: 526 }}
                                autosize={{minRows:2}}
                                placeholder="请输入主要成果" 
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
                    <FormItem label="管理工作经历" >
                            {   
                                //tableInfo && type=='detail'? tableInfo.zbjt:
                                getFieldDecorator('yjgljy',{
                                    initialValue:tableInfo.yjgljy,
                                    rules:[]
                                })(
                                <TextArea style={{ width: 526 }}
                                autosize={{minRows:2}}
                                placeholder="请输入管理工作经历" 
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
                    <FormItem label="数据来源单位" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.longitude:
                                getFieldDecorator('sjlydw',{
                                    initialValue:tableInfo.sjlydw,
                                })
                                (<Input placeholder="请输入数据来源单位"  maxlength="200" style={{ width: 200 }}/>
                                )
                            }
                        </FormItem>
                    </div>
                        
                    </Col>
                    <Col span={12}>
                    <div className="gutter-box">
                    <FormItem label="专家属性" {...formItemLayout}>
                            {   
                                //tableInfo && type=='detail'? tableInfo.syDate:
                                getFieldDecorator('zjFlag',{
                                    initialValue:tableInfo.zjFlag ? tableInfo.zjFlag : '0',
                                })
                                (<Select style={{ width: 200 }} >
                                    <Option value="0">现有</Option>
                                    <Option value="1">可调用</Option>
                                </Select>
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
                                autosize={{minRows:2}}
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