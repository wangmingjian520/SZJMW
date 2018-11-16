import React from 'react';
import {  Button , Form ,  Table , Card , Popconfirm ,Input ,Modal, InputNumber ,message,Tree,TreeSelect , Layout ,Select ,DatePicker ,Tabs ,Row, Col} from  'antd';
import { StickyContainer, Sticky } from 'react-sticky';
import axios from '../../../axios'
import moment from 'moment'
import FaceUrl from '../../../utils/apiAndInterfaceUrl'
import ImgGoBack from '../../../static/images/ystz/goback.png'
import ImgSongShen from '../../../static/images/ystz/songshen.png'
import ImgZjys from '../../../static/images/ystz/zjys.png'
import ImgFwxm from '../../../static/images/ystz/fwxm.png'
const Content = Layout;
const { TextArea ,Search} = Input;
const TreeNode = Tree.TreeNode; 
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
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);
 

class EditableCell extends React.Component {
      
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
        if (this.props.dataIndex === 'jjkmname') {
            const {departobj}=this.props;
            //   console.log(520)
            //   console.log(this.state.departData)
            return (<Select  style={{ width: 150}} onChange={this.handleChangjjfkName} >
                {this.renderDepartment(departobj)}
               </Select>);
         
        }
        if (this.props.dataIndex === 'zfcgcode'||this.props.dataIndex === 'zfcgname'||this.props.dataIndex === 'jjkmcode') {
            return ( <Input readOnly/>);
        }
         
        return <Input />;
  };
  //更改分类名称
  handleChangjjfkName = (value)=>{
      const {departobj}=this.props;
      let datalist= departobj;
    //   alert(value)
      console.log(datalist);
     for(var i=0;i<datalist.length;i++){

         if(datalist[i].jjkmName === value){ 
            this.form.setFieldsValue({
                jjkmcode: datalist[i].jjkmCode
              });
         }
     }
  }
  //
  handleChangBuyFlag=(value,kid)=>{ 
    const {departobj}=this.props;
       if(value === '1'){
       let jjkmcode= this.form.getFieldValue('jjkmcode');
       let jjkmname= this.form.getFieldValue('jjkmname'); 
        
         if(jjkmcode&&jjkmname){
            let datalist= departobj;
            console.log(datalist)
            //   alert(value)
              console.log(datalist);
             for(var i=0;i<datalist.length;i++){ 
                 if(datalist[i].jjkmName === jjkmname && datalist[i].jjkmCode===jjkmcode){ 
                    this.form.setFieldsValue({
                        zfcgcode: datalist[i].govCode,
                        zfcgname:datalist[i].govName
                      });
                 }
             }
         }
       
       }else{
        this.form.setFieldsValue({
            zfcgcode:'' ,
            zfcgname:''
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
              {editing ? dataIndex==='zfcgflag' ? (
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                    rules: [{
                      required: false,
                      //message: `Please Input ${title}!`,
                    }],
                    initialValue: record[dataIndex],
                  })(<Select  style={{ width: 80 }} onChange={(value)=>this.handleChangBuyFlag(value,record.key)} >
                            <Option value="0">否</Option>
                            <Option value="1">是</Option>  
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
//政府购买服务项目
class EditablezfgmfwCell extends React.Component { 
       
    getzffwInput = () => { 
        
       if (this.props.dataIndex === 'ssxm'||this.props.dataIndex === 'zfgmmlcode') {
           
       return (<Input  readOnly/> );
       }
       if (this.props.dataIndex === 'zfgmmlname') {
        const { treedata } = this.props;
          const flag=true;//onChange={this.handleChangfwmlName}  labelInValue={flag}
           return (<TreeSelect  style={{ width: 190}}  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }} onSelect={this.onSelect}>
                {treedata}
              </TreeSelect>);
       }
        
       return <Input />;
 };
    onSelect =(value, node, extra)=>{
        console.log(value)
        console.log(node)
        this.form.setFieldsValue({
            zfgmmlcode: node.props.eventKey,
             
          });
    }
     
 
 render() {
   const {
     editing,
     dataIndex,
     title,
     inputType,
     record,
     xmname,
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
             {editing ? dataIndex==='ssxm' ? 
             (
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                    rules: [{
                      required: false,
                      //message: `Please Input ${title}!`,
                    }],
                    initialValue:xmname,
                  })(this.getzffwInput())}
                </FormItem>
              ):
             (
               <FormItem style={{ margin: 0 }}>
                 {getFieldDecorator(dataIndex, {
                   rules: [{
                     required: false,
                     //message: `Please Input ${title}!`,
                   }],
                   initialValue: record[dataIndex],
                 })(this.getzffwInput())}
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
        dataSource:[],
        fwxmDataSource:[],
        userdataSource:[],
        footer:'',
        count:0,
        zfgmfwxmcount:0,
        type:'xmjbxx',
        visible:false,
        selectedRowKeys: []
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
          }, {
            title: '操作',
            dataIndex: 'operation',
            key:'operation',
            width: 200,
            render: (text, record) => { 
              const editable = this.iszfgmfwxmEditing(record); 
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
                    <Popconfirm title="确定删除吗?" onConfirm={() => this.handlezfgmfwxmDelete(record.key,'delete')}>
                     <a href="javascript:;" style={{ marginRight: 8 }}>删除</a>
                    </Popconfirm>  
                  </div>
                  
                );
              
            },
          }];    
      //人员信息列表
      this.userColumns = [{
        title: '编号',
        dataIndex: 'no',
        key:'no',
        width: 50, 
      },{
        title: '姓名',
        dataIndex: 'name',
        key:'name',
        width: 100, 
      }]
      }
    //渲染树节点
    renderTreeNodes = (data) => {
        return data.map((item) => {
        if (item.childs) {
            //value={item.fwCode}
            return (
            <TreeNode  value={item.fwName}  title={item.fwName} key={item.fwCode} >
                {this.renderTreeNodes(item.childs)}
            </TreeNode> 
            );
        }
          
         return <TreeNode value={item.fwName}  title={item.fwName} key={item.fwCode} />;
        });
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
                        dataSource :list,zjysObj
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
                                fwxmDataSource :list,zfgmfwObj
                            }) 
                    }
                    if(stateVar==='departObj'){
                        let departobj=res.data;
                        this.setState({
                            departobj
                        }) 
                    }
                    if(stateVar==='procStart'){
                      //  let procStart =res.data;
                        // this.setState({
                        //     procStart
                        // }) 
                        //   let xmId= this.state.tableInfo.kid;http://192.168.50.183:3030/#/xmjbxx
                          window.open(`#/xmjbxx`,'_self')
                           //window.location.reload();
                           

                    }
                    if(stateVar==='procRun'){
                        // let xmId= this.state.tableInfo.kid;
                        //  window.open(`/#/proc/detail/${xmId}`,'_self')
                        //  let xmId= this.state.tableInfo.kid;
                        //   window.open(`/#/ysbztz/detail/${xmId}`,'_self')
                          window.location.reload();
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
            // if(tableInfo.status==='1'){
            //     let procVo='procVo';
            //     this.ajaxRequest(FaceUrl.ProcVo+kid,FaceUrl.GET,procVo);
            // }
            }
        }) 
        //部门资金预算-获取下拉服务名称
         
        let departObj='departObj'; 
        this.ajaxRequest(FaceUrl.depysjjflList,FaceUrl.POST,departObj);   
        
        
        let procVo='procVo';
        this.ajaxRequest(FaceUrl.ProcVo+kid,FaceUrl.GET,procVo);
        

        axios.ajax({
            url:FaceUrl.zfgmfwmlTree,
            method:FaceUrl.GET,
            baseApi:FaceUrl.bdApi, 
        }).then((res)=>{
            console.log(res)
            if(res.code == '1') {
               const treeData= this.renderTreeNodes(res.data)
                this.setState({ 
                    treeData: treeData,
                });
            }else{
              //  message.error(message);
            }
        })
        
    }
    
   
    //动作执行
    handleAction = (data) => {
        return data.map((item) => {
            return  <div key={item.id} style={{marginLeft:20,display:"inline-block"}}>
                      <span><img src={ImgSongShen} style={{marginTop:-3,marginLeft:5,marginRight:4}}></img> 
                         <a onClick={()=>{this.redirectToProc(item.id)}} style={{color:'#1890ff',height:24,display:"inline-block",letterSpacing:3}}>{item.name}</a>
                      </span>
                    </div>;
            
          //return <Button key={item.id} type="primary"  onClick={()=>{this.redirectToProc(item.id)}} style={{marginTop:2,marginLeft:53 }}>{item.name}</Button>;
        });
      }
       //模态框选人时的改变
  onSelectChange = (selectedRowKeys, selectedRows) => {
       
    console.log('selectedRowKeys')
    console.log(selectedRowKeys) 
    console.log(selectedRows)
   
     const selectedIds = [];
      selectedRows.map((item)=>{
          selectedIds.push(item.id);
      });
      this.setState({
          selectedIds:selectedIds,
          selectedItem: selectedRows
      }); 
   
};
//模态框提交
    handleOk = () => { 

       if(this.state.choose){
        if(this.state.selectedItem){
            let  advice=  document.getElementById('advice').value;
          //  流程启动
           let procVo =this.state.procVo; 
           let param ={};
            param.procId=procVo.procId; 
            param.actionId=this.state.actionId;
            param.xmId=this.state.tableInfo.kid;
            param.taskId=procVo.taskId;
            param.selectedUsers=this.state.selectedItem;
            if(this.state.actionId==='yssp_nb_lr_ss'){
                let procStart='procStart';
                this.ajaxRequest(FaceUrl.procStart,FaceUrl.POST,procStart,param); 
            }else{ 
                param.procRecId=procVo.procRecId;
                let procRun='procRun';
                this.ajaxRequest(FaceUrl.procRun,FaceUrl.POST,procRun,param); 
            } 
                    
            this.setState({visible: false });

        }else{
            message.error('请选择选择人员！');
        } 
       }else{
        let  advice=  document.getElementById('advice').value;
        //  流程启动
         let procVo =this.state.procVo; 
         let param ={};
          param.procId=procVo.procId; 
          param.actionId=this.state.actionId;
          param.xmId=this.state.tableInfo.kid;
          param.taskId=procVo.taskId;
          param.selectedUsers=this.state.userdataSource;
          param.procRecId=procVo.procRecId; 
          if(this.state.actionId==='yssp_nb_lr_ss'){
            let procStart='procStart';
            this.ajaxRequest(FaceUrl.procStart,FaceUrl.POST,procStart,param); 
        }else{ 
            param.procRecId=procVo.procRecId;
            let procRun='procRun';
            this.ajaxRequest(FaceUrl.procRun,FaceUrl.POST,procRun,param); 
        } 
          this.setState({visible: false });
       }

        
        
        
    //    this.setState({visible: false });
        
    }
     //跳转审批页面
     redirectToProc = (value)=>{
        //  if(value==='yssp_nb_cs_th'){
        //       let xmId= this.state.tableInfo.kid;
        //        window.open(`/#/ysbztz/detail/${xmId}`,'_self');
        //        return ; 
        //  } 
         
         let procVo =this.state.procVo; 
         console.log(11)
         console.log(procVo)
         console.log(value)
         let param ={};
         param.procId=procVo.procId; 
         param.actionId=value;
         param.xmId=this.state.tableInfo.kid;
         param.taskId=procVo.taskId;
         param.procRecId=procVo.procRecId;
         if(value==='yssp_nb_cs_th'||value==='yssp_nb_fs_thlr'){
            param.procRecId=procVo.procRecId;
             let selectedUsers=[];
             let User={"id":"f87b6fbe-6943-4c52-bd82-e920941cfe6c","name":"编制人员"};
             selectedUsers.push(User);
             param.selectedUsers=selectedUsers; 
                   let procRun='procRun';
                    this.ajaxRequest(FaceUrl.procRun,FaceUrl.POST,procRun,param);
        }else{
            axios.ajax({
                url:FaceUrl.procGetPersons,
                method:FaceUrl.POST,
                baseApi:FaceUrl.bdApi, 
                data:param
            }).then((res)=>{
                if(res.code == '1') {
                    let data=res.data; 
                    let chooseFlag=data.choose; 
                    //let persons =data.persons ;
                    let list =data.persons.map((item,index)=>{
                        item.key = index;
                        item.no=index+1;
                        return item
                        })
                   if(chooseFlag){
                    this.setState({ 
                        choose:chooseFlag
                    });
                   }
                    this.setState({ 
                        visible: true,
                        userdataSource:list,
                        actionId :value, 
                    });
                   // param.selectedUsers=data.persons;
                     
                        // let procRun='procRun';
                        // this.ajaxRequest(FaceUrl.procRun,FaceUrl.GET,procRun,param);
                    
                } 
                // else{
                //     message.error('该用户没有相关人员信息');
                // }
            })
        }
        // if(procVo.procRecId){
             //流程执行
            //  param.procRecId=procVo.procRecId;
            //  let selectedUsers=[];
            //  let User={"id":"f87b6fbe-6943-4c52-bd82-e920941cfe6c","name":"编制人员"};
            //  selectedUsers.push(User);
            //  param.selectedUsers=selectedUsers; 
            //        let procRun='procRun';
            //         this.ajaxRequest(FaceUrl.procRun,FaceUrl.POST,procRun,param);
                    
            
            
      //   }else{
             //流程启动
            //  console.log(11)
            //  console.log(procVo)
            //  console.log(this.state.tableInfo)
            //        param.xmId=this.state.tableInfo.kid;
            //        param.taskId=procVo.taskId;
            //        let selectedUsers=[];
            //        let User={"id":"f87b6fbe-6943-4c52-bd82-e920941cfe6c","name":"编制人员"};
            //        selectedUsers.push(User);
            //        param.selectedUsers=selectedUsers; 
            //             let procStart='procStart';
            //             this.ajaxRequest(FaceUrl.procStart,FaceUrl.POST,procStart,param);
                    
                        
             
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
    //返回上一级
    handleGoLast =()=>{
       // window.history.go(-1);
       window.open(`#/xmjbxx`,'_self')
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
            // let zjysList='zjysList';
            // let tableInfo=this.state.tableInfo;
            // this.ajaxRequest(FaceUrl.zjysfindByXmId+tableInfo.kid,FaceUrl.GET,zjysList); 
            
            this.setState({
                type:'bmzjys'
            })
          }
        if(value === '3'){
            // let zfgmfwList='zfgmfwList';
            // let tableInfo=this.state.tableInfo; 
            // this.ajaxRequest(FaceUrl.gmfwfindByXmId+tableInfo.kid,FaceUrl.GET,zfgmfwList); 
            this.setState({
                type:'zfgmfw'
            })
        }
    }
    //添加行
    handleRow =()=>{
        let length = this.state.dataSource.length+1;
        let row ={zfcgflag :"0",jjkmcode:"" ,jjkmname:"",key :length.toString(),nd: "2018" ,cgnum :"", dj:"200"}
         
     this.setState({
        dataSource: [...this.state.dataSource, row],
        count:length
      });
      console.log(888)
      console.log(this.state.dataSource)
    }
    //添加政府购买服务目录行
    handlezfgmfwxmRow =()=>{
        let length = this.state.fwxmDataSource.length+1;
        let row ={ key :length.toString()} 
     this.setState({
        fwxmDataSource: [...this.state.fwxmDataSource, row],
        zfgmfwxmcount:length
      });
       
    }

    //删除行
    handleDelete = (key,value) => { 
        let newData = [...this.state.dataSource];
        console.log(key) 
        console.log(55)
        this.setState({ olddataSource: newData}); 
        this.setState({ dataSource: newData.filter(item =>  item.key !== key),delFlag:value,editingKey:'' });
     //   this.setState({ dataSource: newData.filter(item => { alert(item.key !== key); return( item.key !== key)}) });
      }
      //删除政府服务项目行
      handlezfgmfwxmDelete = (key,value) => { 
        let newData = [...this.state.fwxmDataSource];
        // console.log(key) 
        // console.log(55) 
        this.setState({ fwxmDataSource: newData.filter(item =>  item.key !== key) });
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
      }
      //点击政府购买服务table行
      onzfgmfwxmRowClick =(record)=>{
         
        let  currentKey = this.state.editingfwxmKey;
        if(record.key===currentKey){
            this.setState({ editingfwxmKey: record.key });
         }else{ 
              if(!this.form){
                this.setState({ editingfwxmKey: record.key });
                return ;
              }
            this.setState({ editingfwxmKey: record.key });
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
             
         
      }
      /**  ----------start------------ */
      //提交
    submit = ()=>{ 
        
     //   let olddataSource= this.state.olddataSource;
        let  currentKey = this.state.editingKey;
       // let delFlag =false;
         
        
        // if(olddataSource&&olddataSource.length>this.state.dataSource.length){
            
        //     delFlag=true
        //     let tableInfo= this.state.tableInfo;
        //     let zjysObj= this.state.zjysObj;
        //     let param={};
        //     param.zjysmxs=this.state.dataSource ;
        //     param.xmId=tableInfo.kid;
        //     param.kid=zjysObj.kid; 
        //     axios.ajax({
        //         url:FaceUrl.zjysAdd,
        //         method:FaceUrl.POST,
        //         baseApi:FaceUrl.bdApi,
        //         data:param
        //     }).then((res)=>{
        //         if(res.code == '1') {  
        //           let zjysList='zjysList';
        //          // let tableInfo=this.state.tableInfo;
        //           this.ajaxRequest(FaceUrl.zjysfindByXmId+tableInfo.kid,FaceUrl.GET,zjysList);  
        //           this.setState({editingKey:'' ,olddataSource:'' });
        //           message.success('保存成功');
        //           return ;
        //         }
        //     }) 
        // }
        // if(delFlag){
        //     return ;
        // }
            
            if(!this.form){ 
                return ;
            }else{
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
                      console.log(newData)
                      this.setState({ dataSource:newData,editingKey:''  });
                      
                      let tableInfo= this.state.tableInfo;
                      let zjysObj= this.state.zjysObj;
                      let param={};
                      param.zjysmxs=newData ;
                      param.xmId=tableInfo.kid;
                      if(zjysObj){
                        param.kid=zjysObj.kid; 
                      } 
                      axios.ajax({
                          url:FaceUrl.zjysAdd,
                          method:FaceUrl.POST,
                          baseApi:FaceUrl.bdApi,
                          data:param
                      }).then((res)=>{
                          if(res.code == '1') {  
                            let zjysList='zjysList';
                         //   let tableInfo=this.state.tableInfo;
                            this.ajaxRequest(FaceUrl.zjysfindByXmId+tableInfo.kid+'/'+tableInfo.latestVersion,FaceUrl.GET,zjysList);  
                            message.success('保存成功');
                          }
                      }) 
                    }else{
                        let tableInfo= this.state.tableInfo;
                        let zjysObj= this.state.zjysObj;
                        let param={};
                        param.zjysmxs=this.state.dataSource ;
                        param.xmId=tableInfo.kid;
                        param.kid=zjysObj.kid; 
                        axios.ajax({
                            url:FaceUrl.zjysAdd,
                            method:FaceUrl.POST,
                            baseApi:FaceUrl.bdApi,
                            data:param
                        }).then((res)=>{
                            if(res.code == '1') {  
                            let zjysList='zjysList';
                            // let tableInfo=this.state.tableInfo;
                            this.ajaxRequest(FaceUrl.zjysfindByXmId+tableInfo.kid+'/'+tableInfo.latestVersion,FaceUrl.GET,zjysList);  
                            this.setState({editingKey:'' ,olddataSource:'' });
                            message.success('保存成功');
                            return ;
                            }
                        })
                    }  
                  });
            }
            
            
      }
    //政府购买服务项目保存事件
    submitzfgmfwxm = ()=>{ 
        let  currentKey = this.state.editingfwxmKey;
         
        if(!this.form){ 
             
            return ;
         }else{
             
            this.form.validateFields((error, row) => {
                const newData = [...this.state.fwxmDataSource];
                let  index = newData.findIndex(item => currentKey === item.key);
              //   console.log(index);
                if (index > -1) {
                  const item = newData[index];
                  newData.splice(index, 1, {
                    ...item,
                    ...row,
                  });
                  this.setState({ fwxmDataSource: newData,editingfwxmKey:'' });
                  let tableInfo= this.state.tableInfo;
                  let zfgmfwObj= this.state.zfgmfwObj;
                //   console.log(newData)
                //   console.log('zfgmfwObj')
                //   console.log(zfgmfwObj)
                 
                  let param={};
                  param.gmfwmxs=newData ;
                  param.xmId=tableInfo.kid;
                  if(zfgmfwObj){
                    param.kid=zfgmfwObj.kid; 
                  }  
                  axios.ajax({
                    url:FaceUrl.gmfwAdd,
                    method:FaceUrl.POST,
                    baseApi:FaceUrl.bdApi,
                    data:param
                }).then((res)=>{
                    if(res.code == '1') {  
                        let zfgmfwList='zfgmfwList'; 
                        this.ajaxRequest(FaceUrl.gmfwfindByXmId+tableInfo.kid+'/'+tableInfo.latestVersion,FaceUrl.GET,zfgmfwList);   
                        message.success('保存成功');
                    }
                }) 
                }else{
                    let param={};
                    let tableInfo= this.state.tableInfo;
                    let zfgmfwObj= this.state.zfgmfwObj;
                    param.gmfwmxs=newData ;
                    param.xmId=tableInfo.kid;
                    param.kid=zfgmfwObj.kid; 
  
                    axios.ajax({
                      url:FaceUrl.gmfwAdd,
                      method:FaceUrl.POST,
                      baseApi:FaceUrl.bdApi,
                      data:param
                  }).then((res)=>{
                      if(res.code == '1') {  
                          let zfgmfwList='zfgmfwList'; 
                          this.ajaxRequest(FaceUrl.gmfwfindByXmId+tableInfo.kid+'/'+tableInfo.latestVersion,FaceUrl.GET,zfgmfwList);   
                          message.success('保存成功');
                          this.setState({editingfwxmKey:'' });
                      }
                  }) 

                }  
              });
        }
            
      }
/**  ----------------end------*/
      /**  ----------------start------*/
      isEditing = (record) => {
        return record.key === this.state.editingKey;
      };
      
      //服务项目是否编辑
      iszfgmfwxmEditing = (record) => {
        return record.key === this.state.editingfwxmKey;
      };
      /**---------------- end------ */

      /**--------- start--------- */
      //编辑按钮
    edit(key) {
        this.setState({ editingKey: key });
      }
       //编辑按钮
    editzfgmfw(key) {
        this.setState({ editingfwxmKey: key });
      }
       /**---------------- end------ */

      /**---------------- start--------- */
     
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
                   onCell: record => ({
                   record,
                   departobj:this.state.departobj,
                   editable: col.editable,
                   dataIndex: col.dataIndex,
                   title: col.title, 
                   editing: this.isEditing(record),
                   }),
               };
           })
       }
    
      // 遍历政府购买服务列
      renderzfgmfwxmColumns =(data)=>{
        return data.map((column)=>{
            if(column.children){
                //如果列有children
                column.children=this.renderzfgmfwxmColumns(column.children);
             
            }else if(!column.editable) {
                    return column;
            } 

            return {           
                ...column, 
                onCell: record => ({
                record,
                treedata:this.state.treeData,
                xmname:this.state.tableInfo.xmname,
                editable: column.editable,
                dataIndex: column.dataIndex,
                title: column.title, 
                editing: this.iszfgmfwxmEditing(record),
                }),
            };
        })
    }
   /**---------------- end------ */
  

  handleCancel = () => {
    this.setState({ visible: false });
  }
 


    render(){
          
         
        const { dataSource,visible } = this.state;
        let type =this.state.type;
        let procVo=this.state.procVo;  
        let bmzjysButton =this.state.bmzjysButton;
        let zfgmfwButton= this. state.zfgmfwButton;

        let zjysObj= this.state.zjysObj;
        let zfgmfwObj=this.state.zfgmfwObj;
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };
        const zfgmfwxmcomponents = {
            body: {
                row: EditableFormRow,
                cell: EditablezfgmfwCell,
            },
        }; 
        
         const columns = this.renderColumns(this.columns);
        
      //  console.log(columns)
      const zfgmfwxmcolumns = this.renderzfgmfwxmColumns(this.zfgmfwColumns);
      let rowSelect = {};
     //  alert(this.state.choose)
       if(this.state.choose){ 
         rowSelect = { rowSelection:{type:'checkbox',
          onChange: this.onSelectChange }}; 
       } 
     
        return (
                <StickyContainer>
                    <div style={{borderBottom:'2px solid #d9d9d9',paddingBottom:10}}>
                        <div style={{marginLeft:9,marginTop:10,display:"inline-block"}}>
                        <span><img src={ImgGoBack} style={{marginTop:-3,marginLeft:5,marginRight:4}}></img> 
                           <a  onClick={this.handleGoLast} style={{color:'#1890ff',height:24,display:"inline-block",letterSpacing:2}}>返回上层</a>
                        </span>
                         </div>

                        {this.state.actions}

                        {!zjysObj && this.state.tableInfo &&this.state.tableInfo.status==='1' && <div style={{marginLeft:20,display:"inline-block"}}>
                        <span><img src={ImgZjys} style={{marginTop:-3,marginLeft:5,marginRight:4}}></img> 
                           <a onClick={this.handleAdddepartment} style={{color:'#1890ff',height:24,display:"inline-block",letterSpacing:3}}>添加部门资金预算</a>
                        </span>
                        </div>}
                        
                        {!zfgmfwObj&&this.state.tableInfo && this.state.tableInfo.status==='1' &&<div style={{marginLeft:20,display:"inline-block"}}>
                          <span><img src={ImgFwxm} style={{marginTop:-3,marginLeft:5,marginRight:4}}></img> 
                           <a onClick={this.handleAddzfgmfw} style={{color:'#1890ff',height:24,display:"inline-block",letterSpacing:3}}>添加政府服务目录</a>
                          </span>
                        </div>}             
                        
                         <Modal
                            visible={visible}
                            title="选择人员或意见"
                            onOk={this.handleOk}
                            onCancel={this.handleCancel}
                            footer={[
                                <Button key="back" onClick={this.handleCancel}>取消</Button>,
                                <Button key="submit" type="primary" onClick={this.handleOk}>
                                提交
                                </Button>,
                            ]}
                             > 
                             <div>
                                {/* <ETable
                                    columns={columns}
                                    updateSelectedItem={Utils.updateSelectedItem.bind(this)}
                                    dataSource={this.state.list}
                                    selectedRowKeys={this.state.selectedRowKeys}
                                    selectedIds={this.state.selectedIds}
                                    selectedItem={this.state.selectedItem}
                                    rowSelection={rowSelection}
                                    pagination={false}
                                 /> */}
                                <Table  
                                {...rowSelect}
                               // rowSelection={rowSelect }
                                columns={this.userColumns}
                                dataSource={this.state.userdataSource}
                                bordered
                                size="size"
                                pagination={false}
                                onRow={(record,index) => ({
                                    onClick: ()=>{ 
                                        this.onRowClick(record,index)
                                    }
                                  })}
                                />
                               {/* {border:'1px solid #d9d9d9'} */}
                            <div style={{height:200}}>意见填写<div style={{height:150}}><TextArea id='advice' style={{ width: 500 }}
                                    autosize={{minRows:6}}
                                    placeholder="请填写意见" 
                                    /></div>
                            
                            </div>
                          </div>
                        </Modal> 
                        
                        
                        {/* {!zjysObj  && <Button onClick={this.handleAdddepartment} type="primary" style={{marginTop:2,marginLeft:120 }}>添加部门资金预算</Button> }
                        {!zfgmfwObj  && <Button onClick={this.handleAddzfgmfw} type="primary" style={{marginTop:2,marginLeft:120 }}>添加政府购买项目服务</Button> } */}
                       {/* <Button onClick={this.handleGoLast} type="primary" style={{marginTop:2,marginRight:600 ,marginLeft:200}}>返回上一级</Button>  */}
                         
                   </div>
               
                    
                <Tabs defaultActiveKey="1" renderTabBar={renderTabBar} onTabClick={this.onTabClick}>
                    <TabPane tab="项目基本信息" key="1" >
                        <OpenFormTable type={this.state.type} tableInfo={this.state.tableInfo} PtableInfo={this.PtableInfo} 
                        clickData={this.state.clickData}  wrappedComponentRef={(inst)=>{this.modalForm = inst;}}/>
                    </TabPane>
                    {(zjysObj || type ==='bmzjys' || bmzjysButton ==='true')  &&
                    <TabPane tab="部门资金预算" key="2">
                        <div>
                            <Button onClick={this.handleRow} type="primary" style={{ marginBottom: 16,marginTop:2,}}>
                                新增行
                            </Button>
                            <Button onClick={this.submit} type="primary" style={{ marginBottom: 16,marginTop:2,marginLeft:10 }}>
                                保存 
                            </Button>
                            <Table
                                 
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
                    {(zfgmfwObj || type ==='zfgmfw' || zfgmfwButton ==='true')  && <TabPane tab="政府购买服务项目" key="3"> 
                            <Button onClick={this.handlezfgmfwxmRow} type="primary" style={{ marginBottom: 16,marginTop:2,}}>
                                新增行
                            </Button>
                            <Button onClick={this.submitzfgmfwxm} type="primary" style={{ marginBottom: 16,marginTop:2,marginLeft:10 }}>
                                保存
                            </Button>
                    <Table
                            
                            components={zfgmfwxmcomponents}
                            columns={zfgmfwxmcolumns}
                            dataSource={this.state.fwxmDataSource}
                            bordered
                            size="middle"
                            pagination={false}
                            onRow={(record,index) => ({
                                onClick: ()=>{ 
                                    this.onzfgmfwxmRowClick(record,index)
                                }
                                })}
                                
                            />

                    </TabPane>}
                    
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