import React from 'react';
import {  Button , Form ,  Breadcrumb , Modal ,Tabs ,Tree, message ,Input ,Row, Col, InputNumber , Layout ,Select ,DatePicker} from  'antd';
import axios from '../../axios'
import Utils from '../../utils/utils'
 
import moment from 'moment'
import FaceUrl from '../../utils/apiAndInterfaceUrl'
import Dictionary from '../../utils/dictionary'

 
const TreeNode = Tree.TreeNode;
const TabPane = Tabs.TabPane;
const { Header, Footer, Sider,Content } = Layout;
 
const { TextArea ,Search} = Input;
const FormItem = Form.Item;
const Option = Select.Option;
export default class Zfgmfwml extends React.Component{
    state = {
        treeData: [],
        type:'add'
      }

    params={
        currentPage:1,
        pageSize:10,
        query:{},
    }

    componentDidMount(){
       this.init()
    }
    //初始化
   init =()=>{
    axios.ajax({
        url:FaceUrl.zfgmfwmlTree,
        method:FaceUrl.GET,
        baseApi:FaceUrl.bdApi,
         
    }).then((res)=>{
        console.log(res)
        if(res.code == '1') {
            this.setState({ 
                treeData: res.data
            });
        }else{
            message.error(message);
        }
    })
   }
  

    handleCancel =()=>{
        console.log('Cancel');
    }
    getDeleteKeys=(list,ids)=>{
        list.map((item)=>{
            if(item.props.children.length>=0){
                ids.push(item.key)
                this.getDeleteKeys(item.props.children,ids);
            }else{ 
                ids.push(item.key)
            }
            
        })
        return ids

    }
    //删除操作
    handleDelete = ()=>{
      let tableInfo =  this.state.tableInfo ; 
      let ids = [];
        if(tableInfo){
            ids =this.getDeleteKeys(this.state.selectedKeys,ids)
            Modal.confirm({
                title:'提示',
                content:`您确定要删除${this.state.tableInfo.fwName}吗？`,
                onOk:()=>{
                    axios.ajax({
                        url:FaceUrl.zfgmfwmlDel,
                        method:FaceUrl.POST,
                        baseApi:FaceUrl.bdApi,
                        data:ids
                    }).then((res)=>{
                        if(res.code == '1') {
                            message.success('删除成功！');
                            this.init();
                            this.setState({
                                tableInfo:{},
                                type:'add'
                            })
                        }
                    })
                   
                },onCancel:()=>{this.handleCancel}
            })
        }else{
            message.error('请选择需要删除的项！');
        }
    }
     
    //渲染树节点
    renderTreeNodes = (data) => {
        return data.map((item) => {
          if (item.childs) {
            return (
              <TreeNode title={item.fwName} key={item.fwCode} >
                {this.renderTreeNodes(item.childs)}
              </TreeNode> 
            );
          }
          return <TreeNode title={item.fwName} key={item.fwCode} />;
        });
      }
      //点击树
      onSelect = (selectedKeys,value)=>{
          if(selectedKeys.length <=0){
              return ;
          }
          this.setState({
            selectedKeys:value.selectedNodes
        })
        axios.ajax({
            url:FaceUrl.zfgmfwmlDetail+selectedKeys[0],
            method:FaceUrl.GET,
            async:false, 
            baseApi:FaceUrl.bdApi
        }).then((res)=>{
            
            if(res.code == '1') {
                this.setState({ 
                    tableInfo :res.data
                });
               
            }else{
                message.error(message);
            }
        });
        
      }
      //dfdsfds
      onTabClick=(value)=>{
        if(value === '1'){
            this.setState({
                type:'detail'
            })
          }
          if(value === '2'){
            this.setState({
                type:'add'
            })
          }
          if(value === '3'){
            this.setState({
                type:'edit'
            })
        }
            if(value === '4'){
                this.setState({
                    type:'detail'
                })
                this.handleDelete();
          }  
        
      }
    render(){
          let clickFlag= this.state.tableInfo;
          let  flag= {disabled:{}};
          if(clickFlag&&clickFlag.fwCode){
            flag='';
            }
            
        return (
            <div style={{width:'100%',position:'relative'}}>
                <Breadcrumb separator=">" style={{ margin: '16px 20px' }}>
                    <Breadcrumb.Item>首页</Breadcrumb.Item>
                    <Breadcrumb.Item>政府购买服务目录</Breadcrumb.Item>
                </Breadcrumb>
                {/* content-wrap */}
                {/* <Layout > */}
                    <div className="content-wrap"  style={{border:'solid 1px #e8e8e8',position:'absolute',height:'84vh',width:330,left:0}}> 
                    <Tree    
                            defaultExpandAll
                            showLine
                            onSelect={this.onSelect}
                        >
                            {this.renderTreeNodes(this.state.treeData)}
                        </Tree>
                    </div>
              <div className="content-wrap" style={{width:'100%',position:'absolute',left:330,top:36}}>
                <Tabs type="card" onTabClick={this.onTabClick}>
                        <TabPane tab="详情" key="1" {...flag}>
                        <OpenFormTable type={this.state.type} tableInfo={this.state.tableInfo} PtableInfo={this.PtableInfo} clickData={this.state.clickData} 
                         wrappedComponentRef={(inst)=>{this.modalForm = inst;}}/>
                        </TabPane>
                        <TabPane tab="添加" key="2"  >
                        <OpenFormTable type={this.state.type} tableInfo={this.state.tableInfo}   init={this.init}
                         wrappedComponentRef={(inst)=>{this.modalForm = inst;}}/>
                        </TabPane>
                        <TabPane tab="编辑" key="3" {...flag}>
                        <OpenFormTable type={this.state.type} tableInfo={this.state.tableInfo}   init={this.init} handleDelete={this.handleDelete}
                         wrappedComponentRef={(inst)=>{this.modalForm = inst;}}/>
                        </TabPane>
                        
                    </Tabs> 
                </div>
                {/* <Sider className="content-wrap" style={{border:'solid 1px #e8e8e8',height:'90vh',width:'300vw',flex: '0 0 300px'}}> 
                    <Tree    
                            defaultExpandAll
                            showLine
                            onSelect={this.onSelect}
                        >
                            {this.renderTreeNodes(this.state.treeData)}
                        </Tree>
                </Sider> */}
                {/* <Content className="content-wrap">
                <Tabs type="card" onTabClick={this.onTabClick}>
                        <TabPane tab="详情" key="1" {...flag}>
                        <OpenFormTable type={this.state.type} tableInfo={this.state.tableInfo} PtableInfo={this.PtableInfo} clickData={this.state.clickData} 
                         wrappedComponentRef={(inst)=>{this.modalForm = inst;}}/>
                        </TabPane>
                        <TabPane tab="添加" key="2"  >
                        <OpenFormTable type={this.state.type} tableInfo={this.state.tableInfo}   init={this.init}
                         wrappedComponentRef={(inst)=>{this.modalForm = inst;}}/>
                        </TabPane>
                        <TabPane tab="编辑" key="3" {...flag}>
                        <OpenFormTable type={this.state.type} tableInfo={this.state.tableInfo}   init={this.init} handleDelete={this.handleDelete}
                         wrappedComponentRef={(inst)=>{this.modalForm = inst;}}/>
                        </TabPane>
                        
                    </Tabs> 
                </Content> */}
            {/* </Layout>  */}
            </div>
            
        );
    }
}

class OpenFormTable extends React.Component{
     
    handleReset = () => {
        this.props.form.resetFields();
      }

         //提交
    handleSubmit =(e)=>{
        e.preventDefault();
          let type = this.props.type ;
          const form = this.props.form;
          form.validateFields((err, values) => {
            if (err) {
                return;
             }
              //提交or修改
            axios.ajax({
                url:FaceUrl.zfgmfwmlAdd,
                method:FaceUrl.POST,
                baseApi:FaceUrl.bdApi,
                data:{...values }
            }).then((res)=>{
                if(res.code == '1') {
                    let msg = "";
                if(type ==="add"){
                 msg="添加成功!";
                }if(type ==="edit"){
                    msg="修改成功!";
                }
                message.success(msg);
                    form.resetFields();
                    this.setState({ tableInfo:{} 
                    });
                    this.props.init();
                    
                }
            })
          });
            
    }
   
    render(){
        let type = this.props.type ;
        let tableInfo =this.props.tableInfo; 
          
        const formItemLayout = {
            labelCol:{
                span:3
            },
            wrapperCol:{
                span:10
            }
        }
        const { getFieldDecorator }  =this.props.form;
        return (
            <Form layout="horizontal"  onSubmit={this.handleSubmit}>
            { 
                type !=='detail' &&  
                <Row>
                <Col span={13} style={{ textAlign: 'right' }}>
                <Button htmlType="submit">提交</Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>重置</Button> 
             {  type ==='edit' &&  <Button style={{ marginLeft: 8 }} onClick={this.props.handleDelete}>删除</Button> }
               </Col>
             </Row>

            }
              {/* <Contrbutton type={this.props.type} handleReset={this.handleReset} /> */}
                <FormItem label="服务目录编码" {...formItemLayout}>
                    {   
                        tableInfo && (type==='detail' || type==='edit') ? getFieldDecorator('fwCode',{
                            initialValue:tableInfo.fwCode,
                            rules:[
                            ]
                        })
                         (<Input readOnly />
                         ): 
                        getFieldDecorator('fwCode',{
                            initialValue:type==='add'? '':tableInfo.fwCode,
                            rules:[
                                {
                                    required: true,
                                    message:'服务目录代码不能为空！'
                                }
                            ]
                        })
                         (<Input placeholder="请输入服务目录代码" />
                         )
                    }
                </FormItem>
                <FormItem label="服务目录名称" {...formItemLayout}>
                    {   
                        tableInfo && type ==='detail' ? getFieldDecorator('fwName',{
                            initialValue:tableInfo.fwName,
                            rules:[
                            ]
                        })( <Input readOnly />
                        ): 
                        getFieldDecorator('fwName',{
                            initialValue:type==='add'?'':tableInfo.fwName,
                            rules:[
                                {
                                    required: true,
                                    message:'请输入服务目录名称'
                                }
                            ]
                        })( <Input placeholder="请输入服务目录名称" />
                        )
                    }
                </FormItem>
                <FormItem label="父节点编码" {...formItemLayout}>
                   { 
                       tableInfo && type ==='detail' ? getFieldDecorator('pCode',{
                        initialValue:tableInfo.pCode,
                        rules:[
                        ]
                    })( <Input readOnly />
                    ): 
                       getFieldDecorator('pCode',{
                            initialValue: type ==='add'  ?  tableInfo? tableInfo.fwCode :'0' : tableInfo.pCode,
                            rules:[
                            ]
                        })(
                        <Input readOnly />
                        )
                    }

                </FormItem>
               
                <FormItem label="排序" {...formItemLayout}>
                    {   
                        tableInfo && type==='detail'? getFieldDecorator('tabindex',{
                            initialValue:tableInfo.tabindex,
                            rules:[]
                        })(
                        <InputNumber readOnly/>    
                        ): 
                        getFieldDecorator('tabindex',{
                            initialValue:type==='add'?'': tableInfo.tabindex,
                            rules:[{  required: true,
                                message:'排序号不能为空！'}]
                        })(
                        <InputNumber min={0}/>    
                        
                        )
                    }
                </FormItem>
                <FormItem label="备注" {...formItemLayout}>
                    {   
                        tableInfo && type==='detail'? getFieldDecorator('remark',{
                            initialValue:tableInfo.remark,
                            rules:[]
                        })(
                        <TextArea
                        autosize={{minRows:3}} readOnly
                            />
                        ): 
                        getFieldDecorator('remark',{
                            initialValue:type==='add'? '':tableInfo.remark,
                            rules:[]
                        })(
                        <TextArea
                        autosize={{minRows:3}}
                            />
                        )
                    }
                </FormItem>
                
     </Form>
        );
    }
}
OpenFormTable = Form.create({})(OpenFormTable);