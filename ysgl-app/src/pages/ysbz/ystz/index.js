import React from 'react';
import {  Button , Form ,  Table , Card , Popconfirm ,Input , InputNumber , Layout ,Select ,DatePicker ,Tabs ,Row, Col} from  'antd';
import { StickyContainer, Sticky } from 'react-sticky';
import axios from '../../../axios'
import Utils from '../../../utils/utils'
import ETable from '../../../components/ETable/index'
import moment from 'moment'
import FaceUrl from '../../../utils/apiAndInterfaceUrl'
import Dictionary from '../../../utils/dictionary'

const Content = Layout;
const { TextArea ,Search} = Input;
 
const Option = Select.Option;

const TabPane = Tabs.TabPane;

const renderTabBar = (props, DefaultTabBar) => (
<Sticky bottomOffset={80}>
    {({ style }) => (
    <DefaultTabBar {...props} style={{ ...style, zIndex: 1, background: '#fff' }} />
    )}
</Sticky>
);
const data = [];
for (let i = 1; i <= 5; i++) {
  data.push({
    key:i.toString(),
    kid: i.toString(),
    nd: `201 ${i}`,
    jjkmCode: `code ${i}`,
    jjkmName: `名称 ${i}`,
    buyFlag :'否',
    // govCode : '0001',
    // govName :'采购编码',
    price :'200$',
    number:` ${i}`,
  });
}

const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
    
     state ={
        departData:[],
        departObj:[]
     }
     componentWillMount(){   
        axios.ajax({
            url:FaceUrl.depysjjflList,
            method:FaceUrl.POST,
            baseApi:FaceUrl.bdApi
        }).then((res)=>{
            if(res.code == '1') {  
             let Data=this.renderDepartment(res.data);
              this.setState({ 
                departData:Data,
                departObj:res.data
              })
                
            }
        }) 

     }

    //遍历部门下拉框 
     renderDepartment =(data)=>{
        return data.map((item)=>{ 
            return <Option key={item.jjkmName}>{item.jjkmName}</Option>
        })
    }
    //
    getInput = () => {
         
        if (this.props.dataIndex === 'nd') {
        return (<Select  style={{ width: 80 }} >
                    <Option value="2018">2018</Option>
                    <Option value="2019">2019</Option>
                    <Option value="2020">2020</Option>
                    <Option value="2021">2021</Option>
                    </Select>);
        }
        if (this.props.dataIndex === 'jjkmName') {
            //   console.log(520)
            //   console.log(this.state.departData)
            return (<Select  style={{ width: 150}} onChange={this.handleChangjjfkName} >
                {this.state.departData }
               </Select>);
         
        }
        if (this.props.dataIndex === 'govCode'||this.props.dataIndex === 'govName'||this.props.dataIndex === 'jjkmCode') {
            return ( <Input readOnly/>);
        }
         
        return <Input />;
  };
  //更改分类名称
  handleChangjjfkName = (value)=>{
      let datalist= this.state.departObj;
    //   alert(value)
      console.log(datalist);
     for(var i=0;i<datalist.length;i++){

         if(datalist[i].jjkmName === value){ 
            this.form.setFieldsValue({
                jjkmCode: datalist[i].jjkmCode
              });
         }
     }
  }
  //
  handleChangBuyFlag=(value,kid)=>{   
       if(value === '是'){
       let jjkmCode= this.form.getFieldValue('jjkmCode');
       let jjkmName= this.form.getFieldValue('jjkmName'); 
         if(jjkmCode&&jjkmName){
            let datalist= this.state.departObj;
            //   alert(value)
              console.log(datalist);
             for(var i=0;i<datalist.length;i++){ 
                 if(datalist[i].jjkmName === jjkmName && datalist[i].jjkmCode===jjkmCode){ 
                    this.form.setFieldsValue({
                        govCode: datalist[i].govCode,
                        govName:datalist[i].govName
                      });
                 }
             }
         }
       
       }else{
        this.form.setFieldsValue({
            govCode:null ,
            govName:null
          });
       }
 
   }
 
  
  render() {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      ...restProps
    } = this.props;
      
    return (
      <EditableContext.Consumer>
        {(form) => { 
          const { getFieldDecorator } = form;
          this.form = form;
          return (
            <td {...restProps}>
              {editing ? dataIndex==='buyFlag' ? (
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                    rules: [{
                      required: false,
                      //message: `Please Input ${title}!`,
                    }],
                    initialValue: record[dataIndex],
                  })(<Select  style={{ width: 80 }} onChange={(value)=>this.handleChangBuyFlag(value,record.key)} >
                            <Option value="否">否</Option>
                            <Option value="是">是</Option>  
                    </Select>)}
                </FormItem>
              ) :
              (
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                    rules: [{
                      required: false,
                      //message: `Please Input ${title}!`,
                    }],
                    initialValue: record[dataIndex],
                  })(this.getInput())}
                </FormItem>
              ) : restProps.children}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}

export default class Ysbztz extends React.Component{
    state={
        dataSource:data,
        footer:'',
        count:data.length,
        type:'xmjbxx'
    }
    
    constructor(props) {
        super(props);
        this.columns = [{
          title: '年度',
          dataIndex: 'nd',
          key:'nd',
          width: 100,
          editable: 'true',
        }, {
          title: '经济科目编码',
          dataIndex: 'jjkmCode',
          key:'jjkmCode',
          width: 150,
          editable: 'true',
         
        }, {
          title: '经济科目名称',
          dataIndex: 'jjkmName',
          key:'jjkmName',
          width: 150,
          editable: 'true',
        //   render: (text, record) => {
        //     return (
        //         <Input size="small" placeholder="small size" />
        //     );
        //   },
        }, {
            title: '是否政府采购',
            dataIndex: 'buyFlag',
            key:'buyFlag',
            width: 100,
            editable: 'true',
            // render: (text, record) => {
            //     return (
            //         <Select defaultValue={text} style={{ width: 80 }} >
            //                 <Option value="否">否</Option>
            //                 <Option value="是">是</Option>   
            //         </Select>
            //     );
            //   },
        },{
            title: '政府采购项目填写如下栏',
            dataIndex: 'govCode',
            key: 'govCode',
            children:  [{
                title: '采购品目编码',
                dataIndex: 'govCode',
                key: 'govCode',
                width: 200,
                editable: 'true',
              }, {
                title: '采购编码名称',
                dataIndex: 'govName',
                key: 'govName',
                width: 200,
                editable: 'true',
              },
              , {
                title: '单价',
                dataIndex: 'price',
                key: 'price',
                width: 100,
                editable: 'true',
              }, {
                title: '数量',
                dataIndex: 'number',
                key: 'number',
                width: 100,
                editable: 'true',
              },
            ],
        }, {
            title: '预算金额',
            dataIndex: 'money',
            key: 'money',
            width: 150,
            editable: 'true',
        }, {
            title: '经费详细测算情况',
            dataIndex: 'csbz',
            key: 'csbz',
            width: 200,
            editable: 'true',
        }, {
          title: '操作',
          dataIndex: 'operation',
          key:'operation',
          width: 200,
          render: (text, record) => { 
            const editable = this.isEditing(record); 
            return (
                <div>
                  {editable && ( 
                      <span>
                  <EditableContext.Consumer>
                    {(form) => {
                     this.form =form;
                    return  null ;
                    }}
                  </EditableContext.Consumer> 
                </span> 
                  )}
                  <Popconfirm title="确定删除吗?" onConfirm={() => this.handleDelete(record.key,'delete')}>
                   <a href="javascript:;" style={{ marginRight: 8 }}>删除</a>
                  </Popconfirm>  
                </div>
                
              );
            
          },
        }];
    
      }
    

      componentWillMount(){    
        let currentKey = window.location.hash.replace(/#|\?.*$/g,'');
        let kid= currentKey.substr(currentKey.lastIndexOf('/')+1) ;
        axios.ajax({
            url:FaceUrl.xmxxDetail+kid,
            method:FaceUrl.GET,
            baseApi:FaceUrl.bdApi
        }).then((res)=>{
            if(res.code == '1') {
             let tableInfo=res.data; 
            //   console.log(datelist)
                    this.setState({
                        tableInfo
                    }) 
            }
        })
        axios.ajax({
            url:FaceUrl.ProcVo+kid,
            method:FaceUrl.GET,
            baseApi:FaceUrl.bdApi
        }).then((res)=>{
            if(res.code == '1') {
             let procVo=res.data; 
             //alert(11111)
             console.log(procVo)
            const actions= this.handleAction(procVo.actions)
                    this.setState({
                        procVo : procVo,
                        actions : actions
                    }) 
            }
        })
        
    }
    //取消
    cancel = () => {
        this.setState({ editingKey: '' });
    };
  //保存
  save(form, key) {
    form.validateFields((error, row) => {
    //   if (error) {
    //     return;
    //   }
      const newData = [...this.state.dataSource];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        this.setState({ dataSource: newData, editingKey: '' });
      } else {
        newData.push(row);
        this.setState({ dataSource: newData, editingKey: '' });
      }
    });
  }
    //动作执行
    handleAction = (data) => {
        return data.map((item) => {
          return <Button key={item.id} type="primary" style={{marginTop:2,marginLeft:53 }}>{item.name}</Button>;
        });
      }
    //返回上一级
    handleGoLast =()=>{
        window.history.go(-1);
    }
    //添加部门资金预算按钮
    handleAdddepartment = ()=>{ 
        this.setState({
            type:'bmzjys',
            bmzjysButton:'true',
        })
    }
    //添加政府服务目录
    handleAddzfgmfw =()=>{
        this.setState({
            type:'zfgmfw',
            zfgmfwButton:'true'
        })
    }
    onTabClick=(value)=>{
        if(value === '1'){
            this.setState({
                type:'xmjbxx'
            })
          }
        if(value === '2'){
             
            this.setState({
                type:'bmzjys'
            })
          }
        if(value === '3'){
            this.setState({
                type:'zfgmfw'
            })
        }
    }
    //添加行
    handleRow =()=>{
        let length = this.state.count+1;
        let row ={buyFlag :"否",jjkmCode:"" ,jjkmName:"",key :length.toString(),nd: "2018" ,number :"", price:"200$"}
         
     this.setState({
        dataSource: [...this.state.dataSource, row],
        count:length
      });
      console.log(888)
      console.log(this.state.dataSource)
    }
    //删除行
    handleDelete = (key,value) => { 
        let newData = [...this.state.dataSource];
        console.log(key) 
        console.log(55) 
        this.setState({ dataSource: newData.filter(item =>  item.key !== key),delFlag:value });
     //   this.setState({ dataSource: newData.filter(item => { alert(item.key !== key); return( item.key !== key)}) });
      }
      //点击行
      onRowClick =(record)=>{
        let delFlag = this.state.delFlag;
        let  currentKey = this.state.editingKey;
        //  if(delFlag==='delete'){ 
        //     this.setState({ delFlag:'',editingKey:''});
        //  } 
         if(record.key===currentKey){
            this.setState({ editingKey: record.key });
         }else{ 
              if(!this.form){
                this.setState({ editingKey: record.key });
                return ;
              }
            this.setState({ editingKey: record.key });
            this.form.validateFields((error, row) => {
                  const newData = [...this.state.dataSource];
                  let  index = newData.findIndex(item => currentKey === item.key);
                //   console.log(index);
                  if (index > -1) {
                    const item = newData[index];
                    newData.splice(index, 1, {
                      ...item,
                      ...row,
                    });
                    this.setState({ dataSource: newData});
                   
                  }  
                });
         }
      
      //  this.submit(key)
      }
      //提交
    submit = ()=>{ 
        let  currentKey = this.state.editingKey;
        if(currentKey){
            this.form.validateFields((error, row) => {
                const newData = [...this.state.dataSource];
                let  index = newData.findIndex(item => currentKey === item.key);
              //   console.log(index);
                if (index > -1) {
                  const item = newData[index];
                  newData.splice(index, 1, {
                    ...item,
                    ...row,
                  });
                  this.setState({ dataSource: newData,editingKey:''  });
                 
                }  
              });
        }
            
      }
      
    isEditing = (record) => {
        return record.key === this.state.editingKey;
      };
      //编辑按钮
    edit(key) {
        this.setState({ editingKey: key });
      }
        // 遍历列
     renderColumns =(data)=>{
        return data.map((col)=>{
            if(col.children){
                //如果列有children
                col.children=this.renderColumns(col.children);
             
            }else if(!col.editable) {
                    return col;
            } 

            return {           
                ...col,
                'departData': this.state.departData,
                onCell: record => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title, 
                editing: this.isEditing(record),
                }),
            };
        })
    }

    render(){
        
        const { dataSource } = this.state;
        let type =this.state.type;
        let procVo=this.state.procVo;  
        let bmzjysButton =this.state.bmzjysButton;
        let zfgmfwButton= this. state.zfgmfwButton;
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };
     
        const columns = this.renderColumns(this.columns);
        const rowKey = function(record) {
            return record.key;  
          };
         
        return (
                <StickyContainer>
                    <div>
                   
                       {/* <Button onClick={this.handleAdd} type="primary" style={{marginTop:2,marginLeft:3 }}>上报预算</Button> 
                       <Button onClick={this.handleAdd} type="primary" style={{marginTop:2,marginLeft:120 }}>历程查看</Button> 
                       <Button onClick={this.handleAdd} type="primary" style={{marginTop:2,marginLeft:120}}>预审审批</Button> 
                       <Button onClick={this.handleAdd} type="primary" style={{marginTop:2,marginLeft:120 }}>目标下达</Button>  */}
                        {this.state.actions}
                        {procVo && !procVo.procRecId && <Button onClick={this.handleAdddepartment} type="primary" style={{marginTop:2,marginLeft:120 }}>上报预算</Button> }
                        {procVo && !procVo.procRecId && <Button onClick={this.handleAddzfgmfw} type="primary" style={{marginTop:2,marginLeft:120 }}>政府购买项目服务</Button> }
                       <Button onClick={this.handleGoLast} type="primary" style={{marginTop:2,marginRight:600 ,marginLeft:200}}>返回上一级</Button> 
                         
                   </div>
               
                    
                <Tabs defaultActiveKey="1" renderTabBar={renderTabBar} onTabClick={this.onTabClick}>
                    <TabPane tab="项目基本信息" key="1" >
                        <OpenFormTable type={this.state.type} tableInfo={this.state.tableInfo} PtableInfo={this.PtableInfo} 
                        clickData={this.state.clickData}  wrappedComponentRef={(inst)=>{this.modalForm = inst;}}/>
                    </TabPane>
                    {((procVo && procVo.procRecId) || type ==='bmzjys' || bmzjysButton ==='true')  &&
                    <TabPane tab="部门资金预算" key="2">
                        <div>
                            <Button onClick={this.handleRow} type="primary" style={{ marginBottom: 16,marginTop:2,}}>
                                新增行
                            </Button>
                            <Button onClick={this.submit} type="primary" style={{ marginBottom: 16,marginTop:2,marginLeft:10 }}>
                                保存
                            </Button>
                            <Table
                                rowKey={rowKey}
                                components={components}
                                columns={columns}
                                dataSource={this.state.dataSource}
                                bordered
                                size="middle"
                                pagination={false}
                                onRow={(record,index) => ({
                                    onClick: ()=>{ 
                                        this.onRowClick(record,index)
                                    }
                                  })}
                                
                            />
                             
                        </div>
                    </TabPane>
                    }
                    {((procVo && procVo.procRecId) || type ==='zfgmfw' || zfgmfwButton ==='true')  && <TabPane tab="政府购买服务项目" key="3">开发中......</TabPane>}
                    
                </Tabs>
            </StickyContainer>
         
        
      )
    }
}

class OpenFormTable extends React.Component{

    handleZcTypeCodeChange =(value)=>{
        this.props.form.setFieldsValue({
            zctypename: `${value === '001' ? '新增项目' : value === '002' ? '上年延续': '上年结转'}`,
          });
    }
    handleZcTypeNameChange =(value)=>{
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
            <Card
            title="项目基本信息表"
            extra={<a href="#">上报预算</a> }
            style={{ width: 1000 }}
            >
            <Form layout="inline">
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
                                    (<Input placeholder="请输入项目名称"  maxlength="200" style={{ width: 666 }}/>
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
                            initialValue:tableInfo.zctypecode,
                            
                        })(
                            <Select style={{ width: 200 }} onChange={this.handleZcTypeCodeChange}>
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
                                    initialValue:tableInfo.zctypename,
                                    
                                })
                                (<Select style={{ width: 200 }} onChange={this.handleZcTypeNameChange}>
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
                            <Select style={{ width: 200 }} onChange={this.handleXmsxCodeChange}>
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
                                (<Select style={{ width: 200 }} onChange={this.handleCxsxNameChange}>
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
                                (<Select style={{ width: 200 }} onChange={this.handleZjbzTypeNameChange}>
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
                                <Select style={{ width: 200 }} onChange={this.handleZcfxCodeChange}>
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
                                <Select style={{ width: 200 }} onChange={this.handleXmtypeCodeChange}>
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
                                (<TextArea style={{ width: 666 }}
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
                                (<TextArea style={{ width: 666 }}
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
                                (<TextArea style={{ width: 666 }}
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
                                (<TextArea style={{ width: 666 }}
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
            </Card>
        );
    }
}
OpenFormTable = Form.create({})(OpenFormTable);