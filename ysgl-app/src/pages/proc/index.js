import React from 'react';
import {  Button , Form ,  Table , Card , Popconfirm ,Input , InputNumber ,message,Tree,TreeSelect , Layout ,Select ,DatePicker ,Tabs ,Row, Col} from  'antd';
import { StickyContainer, Sticky } from 'react-sticky';
import axios from '../../axios'
import moment from 'moment'
import FaceUrl from '../../utils/apiAndInterfaceUrl'

import ImgGoBack from '../../static/images/ystz/goback.png'
import ImgSongShen from '../../static/images/ystz/songshen.png'
import ImgZjys from '../../static/images/ystz/zjys.png'
import ImgFwxm from '../../static/images/ystz/fwxm.png'

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
 
const FormItem = Form.Item;
  

export default class Proc extends React.Component{
    state={
        dataSource:[],
        fwxmDataSource:[],
        footer:'', 
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
          dataIndex: 'jjkmcode',
          key:'jjkmcode',
          width: 150,
          editable: 'true',
         
        }, {
          title: '经济科目名称',
          dataIndex: 'jjkmname',
          key:'jjkmname',
          width: 150,
          editable: 'true',
        //   render: (text, record) => {
        //     return (
        //         <Input size="small" placeholder="small size" />
        //     );
        //   },
        }, {
            title: '是否政府采购',
            dataIndex: 'zfcgflag',
            key:'zfcgflag',
            width: 100,
            editable: 'true',
            render: (text, record) => {
                return text==='0'?'否':'是' ;
              },
        },{
            title: '政府采购项目填写如下栏',
            dataIndex: 'govCode',
            key: 'govCode',
            children:  [{
                title: '采购品目编码',
                dataIndex: 'zfcgcode',
                key: 'zfcgcode',
                width: 200,
                editable: 'true',
              }, {
                title: '采购编码名称',
                dataIndex: 'zfcgname',
                key: 'zfcgname',
                width: 200,
                editable: 'true',
              },
              , {
                title: '单价',
                dataIndex: 'dj',
                key: 'dj',
                width: 100,
                editable: 'true',
              }, {
                title: '数量',
                dataIndex: 'cgnum',
                key: 'cgnum',
                width: 100,
                editable: 'true',
              },
            ],
        }, {
            title: '预算金额',
            dataIndex: 'ysje',
            key: 'ysje',
            width: 150,
            editable: 'true',
        }, {
            title: '经费详细测算情况',
            dataIndex: 'jfcs',
            key: 'jfcs',
            width: 200,
            editable: 'true',
        }];
        //政府购买服务项目
        this.zfgmfwColumns = [{
            title: '处室',
            dataIndex: 'gmcs',
            key:'gmcs',
            width: 100,
            editable: 'true',
          }, {
            title: '购买服务名称',
            dataIndex: 'fwname',
            key:'fwname',
            width: 150,
            editable: 'true',
           
          }, {
            title: '所属项目',
            dataIndex: 'ssxm',
            key:'ssxm',
            width: 150,
            editable: 'true',
          //   render: (text, record) => {
          //     return (
          //         <Input size="small" placeholder="small size" />
          //     );
          //   },
          } 
           ,{
              title: '所属政府购买服务目录',
              dataIndex: 'zfgmfwml',
              key: 'zfgmfwml',
              children:  [{
                  title: '编号',
                  dataIndex: 'zfgmmlcode',
                  key: 'zfgmmlcode',
                  width: 100,
                  editable: 'true',
                }, {
                  title: '名称',
                  dataIndex: 'zfgmmlname',
                  key: 'zfgmmlname',
                  width: 200,
                  editable: 'true',
                } 
              ],
          }, {
              title: '金额',
              dataIndex: 'fwje',
              key: 'fwje',
              width: 150,
              editable: 'true',
          }, {
              title: '备注',
              dataIndex: 'remark',
              key: 'remark',
              width: 200,
              editable: 'true',
          }];     
      }
   
      ajaxRequest =(url,method,stateVar,param)=>{ 
            axios.ajax({
                url:url,
                method:method,
                baseApi:FaceUrl.bdApi,
                data:param
            }).then((res)=>{
                if(res.code == '1') { 
                    if(stateVar==='tableInfo'){
                        let tableInfo=res.data;
                        this.setState({
                            tableInfo
                        }) 
                    }
                    if(stateVar==='procVo'){
                        let procVo=res.data; 
                        const actions= this.handleAction(procVo.actions)
                        this.setState({
                            procVo : procVo,
                            actions : actions
                        }) 
                    }
                    if(stateVar==='zjysList'){
                        let zjysObj=res.data;
                        let zjysmxList=[];
                        if(zjysObj){
                         zjysmxList=zjysObj.zjysmxs; 
                        } 
                       let list = zjysmxList.map((item,index)=>{
                        item.key = index;
                        return item
                        }) 
                     this.setState({
                        dataSource :list
                    }) 
                    }
                    if(stateVar==='zfgmfwList'){
                        let zfgmfwObj=res.data; 
                        let zfgmfwmxList=[];
                        if(zfgmfwObj){
                            zfgmfwmxList=zfgmfwObj.gmfwmxs; 
                        } 
                        let list = zfgmfwmxList.map((item,index)=>{
                            item.key = index;
                            return item
                            }) 
                            this.setState({
                                fwxmDataSource :list
                            }) 
                    }
                    // if(stateVar==='procStart'){
                    //     let procStart =res.data;
                    //     // this.setState({
                    //     //     procStart
                    //     // }) 
                        
                    //      window.location.reload();
                    // }
                    if(stateVar==='procRun'){           //||param.actionId==='yssp_cwwld_bcw_pz'
                        if(param.actionId==='yssp_nb_cs_th'||param.actionId==='yssp_nb_fs_thlr'||param.actionId==='yssp_msc_cs_thcs'){
                          let xmId= this.state.tableInfo.kid;
                          window.open(`/#/ysbztz/detail/${xmId}`,'_self')
                        }else{
                            window.location.reload();
                        }
                       
                    }    
                }
            })
           
        
      } 
      // componentWillMount componentDidMount
      componentDidMount(){    
        let currentKey = window.location.hash.replace(/#|\?.*$/g,'');
        let kid= currentKey.substr(currentKey.lastIndexOf('/')+1) ;
        
        // let tableInfo='tableInfo';
        // this.ajaxRequest(FaceUrl.xmxxDetail+kid,FaceUrl.GET,tableInfo);
        axios.ajax({
            url:FaceUrl.xmxxDetail+kid,
            method:FaceUrl.GET,
            baseApi:FaceUrl.bdApi
        }).then((res)=>{
            if(res.code == '1') {
             let tableInfo=res.data;  
                    this.setState({
                        tableInfo  
                    }) 
            let zjysList='zjysList'; 
            this.ajaxRequest(FaceUrl.zjysfindByXmId+tableInfo.kid+'/'+tableInfo.latestVersion,FaceUrl.GET,zjysList);      
            let zfgmfwList='zfgmfwList'; 
            this.ajaxRequest(FaceUrl.gmfwfindByXmId+tableInfo.kid+'/'+tableInfo.latestVersion,FaceUrl.GET,zfgmfwList);  

            if(tableInfo.status ==='3'){
                this.setState({actions: '' });
             }else{
                let procVo='procVo';
                this.ajaxRequest(FaceUrl.ProcVo+kid,FaceUrl.GET,procVo);
             } 
            }
        }) 
           
        // let procVo='procVo';
        // this.ajaxRequest(FaceUrl.ProcVo+kid,FaceUrl.GET,procVo);
        
        
    }
    
   
    //动作执行
    handleAction = (data) => {
        return data.map((item) => {
            return  <div key={item.id} style={{marginLeft:20,display:"inline-block"}}>
            <span><img src={ImgSongShen} style={{marginTop:-3,marginLeft:5,marginRight:4}}></img> 
               <a onClick={()=>{this.redirectToProc(item.id)}} style={{color:'#1890ff',height:24,display:"inline-block",letterSpacing:3}}>{item.name}</a>
            </span>
          </div>;
        });
      }

    //返回上一级
    handleGoLast =()=>{
       // window.history.go(-1);
       //let xmId= this.state.tableInfo.kid;
        window.open(`/#/xmjbxx`,'_self')
    }
    //跳转审批页面
    redirectToProc = (value)=>{
 
        console.log(990)
        console.log(value)
        let procVo =this.state.procVo; 
        let param ={};
        param.procId=procVo.procId; 
        param.actionId=value;
    //    if(procVo.procRecId&&!this.state.tableInfo.status==='1'){
            //流程执行
            param.procRecId=procVo.procRecId;
            let selectedUsers=[];
            let User={"id":"f87b6fbe-6943-4c52-bd82-e920941cfe6c","name":"编制人员"};
            selectedUsers.push(User);
            param.selectedUsers=selectedUsers; 
                  let procRun='procRun';
                  this.ajaxRequest(FaceUrl.procRun,FaceUrl.POST,procRun,param);
                   
               
          
           //  axios.ajax({
           //     url:FaceUrl.procGetPersons,
           //     method:FaceUrl.POST,
           //     baseApi:FaceUrl.bdApi, 
           //     data:param
           // }).then((res)=>{
           //     if(res.code == '1') {
           //         let data=res.data;
           //         let chooseFlag=data.choose; 
           //         param.selectedUsers=data.persons;
           //         if(!chooseFlag){
           //             let procRun='procRun';
           //             this.ajaxRequest(FaceUrl.procRun,FaceUrl.GET,procRun,param);
           //         }
           //     }
           // })
           
     //  }else{
            //流程启动
            // console.log(11)
            // console.log(procVo)
            // console.log(this.state.tableInfo)
            //       param.xmId=this.state.tableInfo.kid;
            //       param.taskId=procVo.taskId;
            //       let selectedUsers=[];
            //       let User={"id":"f87b6fbe-6943-4c52-bd82-e920941cfe6c","name":"编制人员"};
            //       selectedUsers.push(User);
            //       param.selectedUsers=selectedUsers; 
            //            let procStart='procStart';
            //            this.ajaxRequest(FaceUrl.procStart,FaceUrl.POST,procStart,param);
                   
              
            
           // axios.ajax({
           //     url:FaceUrl.procGetPersons,
           //     method:FaceUrl.POST,
           //     baseApi:FaceUrl.bdApi, 
           //     data:param
           // }).then((res)=>{
           //     if(res.code == '1') {
           //         let data=res.data;
           //         let chooseFlag=data.choose; 
           //         param.selectedUsers=data.persons;
           //         if(!chooseFlag){
           //             let procStart='procStart';
           //             this.ajaxRequest(FaceUrl.procStart,FaceUrl.GET,procStart,param);
           //         }
           //     }
           // })
           
           
    //   }
        
           

       // let xmId= this.state.tableInfo.kid;
       // window.open(`/#/proc/detail/${xmId}`,'_self')
    }
    
    // onTabClick=(value)=>{
    //     if(value === '1'){
    //         this.setState({
    //             type:'xmjbxx'
    //         })
    //       }
    //     if(value === '2'){
    //         this.setState({
    //             type:'bmzjys'
    //         })
    //       }
    //     if(value === '3'){
    //         this.setState({
    //             type:'zfgmfw'
    //         })
    //     }
    // }
   
    
    render(){
        
        // const { dataSource } = this.state;
        // let type =this.state.type;
        // let procVo=this.state.procVo;  
        // let bmzjysButton =this.state.bmzjysButton;
        // let zfgmfwButton= this. state.zfgmfwButton;

        return (
                <StickyContainer>
                 <div style={{borderBottom:'2px solid #d9d9d9',paddingBottom:10}}>
                    <div style={{marginLeft:9,marginTop:10,display:"inline-block"}}>
                        <span><img src={ImgGoBack} style={{marginTop:-3,marginLeft:5,marginRight:4}}></img> 
                           <a  onClick={this.handleGoLast} style={{color:'#1890ff',height:24,display:"inline-block",letterSpacing:2}}>返回上层</a>
                        </span>
                         </div>
                        {this.state.actions}

                        
                        
                       
                       {/* <Button onClick={this.handleAdd} type="primary" style={{marginTop:2,marginLeft:3 }}>上报预算</Button> 
                       <Button onClick={this.handleAdd} type="primary" style={{marginTop:2,marginLeft:120 }}>历程查看</Button> 
                       <Button onClick={this.handleAdd} type="primary" style={{marginTop:2,marginLeft:120}}>预审审批</Button> 
                       <Button onClick={this.handleAdd} type="primary" style={{marginTop:2,marginLeft:120 }}>目标下达</Button>  */}
                        {/* {this.state.actions} */}
                       
                   </div>
               
                    
                <Tabs defaultActiveKey="1" renderTabBar={renderTabBar} onTabClick={this.onTabClick}>
                    <TabPane tab="项目基本信息" key="1" >
                        <OpenFormTable type={this.state.type} tableInfo={this.state.tableInfo} PtableInfo={this.PtableInfo} 
                        clickData={this.state.clickData}  wrappedComponentRef={(inst)=>{this.modalForm = inst;}}/>
                    </TabPane>
                    
                    <TabPane tab="部门资金预算" key="2">
                        <div>
                            <Table  
                                columns={this.columns}
                                dataSource={this.state.dataSource}
                                bordered={true}
                                size="middle"
                                pagination={false}
                            />
                             
                        </div>
                    </TabPane>
                    
                    <TabPane tab="政府购买服务项目" key="3"> 
                    <Table 
                            columns={this.zfgmfwColumns}
                            dataSource={this.state.fwxmDataSource}
                            bordered
                            size="middle"
                            pagination={false}
                            />
                    </TabPane>
                    
                </Tabs>
            </StickyContainer>
         
      )
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
                                       
                                    })
                                    (<Input  readOnly  maxlength="200" style={{ width: 666 }}/>
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
                                <Input readOnly  maxlength="20" style={{ width: 200 }}/>
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
                                     
                                })
                                (<Input readOnly maxlength="200" style={{ width: 200 }}/>
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
                            <Select style={{ width: 200 }}  disabled>
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
                                (<Select style={{ width: 200 }} disabled  >
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
                            <Select style={{ width: 200 }} disabled>
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
                                     
                                })
                                (<Select style={{ width: 200 }} disabled>
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
                                <Select style={{ width: 200 }} disabled>
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
                                (<Select style={{ width: 200 }} disabled>
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
                                <Select style={{ width: 200 }} disabled>
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
                                (<Select style={{ width: 200 }} disabled>
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
                                <Select style={{ width: 200 }} disabled>
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
                                (<Select style={{ width: 200 }} disabled>
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
                                <Select style={{ width: 200 }} disabled>
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
                                (<Select style={{ width: 200 }} disabled>
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
                                <Select style={{ width: 200 }} disabled>
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
                                (<Select style={{ width: 200 }} disabled>
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
                                    
                                })
                                (<Select style={{ width: 200 }} disabled>
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
                                (<Input readOnly maxlength="10" style={{ width: 200 }}/>
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
                                (<DatePicker  style={{ width: 200 }} disabled />)   
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
                                (<DatePicker  style={{ width: 200 }} disabled />
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
                                (<Input readOnly maxlength="30" style={{ width: 200 }}/>)    
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
                                (<Input readOnly maxlength="50" style={{ width: 200 }}/>
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
                                     
                                })
                                (<TextArea style={{ width: 666 }}
                                    autosize={{minRows:2}} 
                                    readOnly 
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
                                     
                                })
                                (<TextArea style={{ width: 666 }}
                                    autosize={{minRows:2}}
                                    readOnly
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
                                     
                                })
                                (<TextArea style={{ width: 666 }}
                                    autosize={{minRows:2}}
                                    readOnly
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
                                    readOnly
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