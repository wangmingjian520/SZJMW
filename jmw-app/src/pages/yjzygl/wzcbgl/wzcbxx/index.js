import React from 'react';
import { Button, Form, Breadcrumb, Modal, message, Input, Layout, Select, DatePicker } from 'antd';
import axios from './../../../../axios'
import Utils from './../../../../utils/utils'
import ETable from './../../../../components/ETable/index'
import moment from 'moment'
import FaceUrl from '../../../../utils/apiAndInterfaceUrl'

const Content = Layout;
const { TextArea, Search } = Input;
const FormItem = Form.Item;
const Option = Select.Option;
export default class Wzcbxx extends React.Component {

    state = {
        dataSource: [],
    }

    params = {
        currentPage: 1,
        pageSize: 10
    }

    componentDidMount() {
        this.requestList()
    }

    requestList = () => {
        let _this = this;
        axios.requestList(_this, FaceUrl.wzcbxxgl, FaceUrl.POST, this.params,true);
    }

    //查询
    handleSearchTable = (value) => {
        let _this = this;
        let type = "";
        this.setState({
            params: {
                searchInfo: value,
                searchType: type
            }
        })
        axios.requestList(_this, FaceUrl.wzcbxx, this.params,true);
    }

    //打开添加编辑删除
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
                    title:'修改'
               })  
            }else{
                message.error('请选择一条需要修改的项！');
                
            }
            


        }
    }

    //提交
    handleSubmit =()=>{
        let _this =this;
        let addInfo = this.modalForm.props.form.getFieldsValue();
        console.log(addInfo);
        if(addInfo){
            this.setState({
                params:{




                    addFromInfo:addInfo










                }
            })
            axios.requestList(_this,FaceUrl.wzcbxxgl,FaceUrl.POST,this.params,true);
        }
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

            content:`您确定要删除 ${ids.join(',')}`,
            onOk:()=>{
                let _this =this;

                axios.requestList(_this,FaceUrl.wzcbxxgl,this.params);
                message.success('删除成功');
            }
        })
    }else{
        message.error('请选择需要删除的项！');

    }
}
    render() {
        const columns = [
            {
                title: '物资名称',
                dataIndex: 'wzName',
                key: 'wzName',
                align:'center'
            },
            {
                title: '物资类别',
                dataIndex: 'wzType',
                key: 'wzType',
                align:'center'

            },
            {
                title: '物资数量',
                dataIndex: 'wzNum',
                key: 'wzNum',
                align:'center'
            },
            {
                title: '物资储备库点',
                dataIndex: 'cbkCode',
                key: 'cbkCode',
                align:'center'
            },
            {
                title: '物资属性',
                dataIndex: 'wzFlag',
                key: 'wzFlag',
                align:'center'
            }
        ]

        const selectedRowKeys = this.state.selectedRowKeys
        //多选框
        const rowCheckSelection = {
            type: 'checkbox',
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                let ids = [];
                selectedRows.map((item) => {
                    ids.push(item.id)
                })
                this.setState({
                    selectedRowKeys,
                    selectedRows,
                    selectedIds: ids
                })
            }
        }

        return (
            <div>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>首页</Breadcrumb.Item>
                    <Breadcrumb.Item>应急资源管理</Breadcrumb.Item>
                    <Breadcrumb.Item>物资储备管理</Breadcrumb.Item>
                    <Breadcrumb.Item>物资储备信息</Breadcrumb.Item>
                </Breadcrumb>
                <Content className="content-wrap">
                    <div>
                        <span className="table_input ft">
                            {/* <Select defaultValue="wzType" style={{ width: 120 }} onChange={this.handleChange}>
                                <Option value="wzName">物资名称</Option>
                                <Option value="wzType">物资类别</Option>
                                <Option value="wzNum">物资数量</Option>
                                <Option value="cbkCode">物资储备库点</Option>
                                <Option value="wzFlag">物资属性</Option>
                            </Select> */}
                            <Search style={{ width: 300 }}
                                placeholder="请输入查询内容"
                                onSearch={value => this.handleSearchTable(value)}
                                enterButton
                            />
                        </span>
                        <span className="table_button ht">
                            <Button icon="plus" onClick={() => { this.handleOperate('add') }}>添加</Button>
                            <Button icon="form" onClick={() => { this.handleOperate('edit') }}>修改</Button>
                            <Button icon="delete" onClick={this.handleDelete}>删除</Button>
                        </span>
                    </div>

                    <ETable
                        columns={columns}
                        updateSelectedItem={Utils.updateSelectedItem.bind(this)}
                        dataSource={this.state.list}
                        selectedRowKeys={this.state.selectedRowKeys}
                        selectedIds={this.state.selectedIds}
                        selectedItem={this.state.selectedItem}
                        rowSelection={rowCheckSelection}
                        pagination={this.state.pagination}
                    />

                </Content>
                <Modal
                    title={this.state.title}
                    visible={this.state.isVisible}
                    onCancel={() => {
                        this.modalForm.props.form.resetFields();
                        this.setState({
                            isVisible: false
                        })
                    }}
                    onOk={this.handleSubmit}
                >
                    <OpenFormTable wrappedComponentRef={(inst) => { this.modalForm = inst; }} />
                </Modal>
            </div>

        );
    }
}
class OpenFormTable extends React.Component {
    render() {
        const formItemLayout = {
            labelCol: {
                span: 6
            },
            wrapperCol: {
                span: 18
            }
        }
        const { getFieldDecorator } = this.props.form;
        return (
            <Form layout="horizontal">

                <FormItem label="物资名称" {...formItemLayout}>
                    {
                        getFieldDecorator('wzName', {
                            initialValue: '',
                            rules: [
                                {
                                    required: true,
                                    message: '物资名称不能为空！'
                                }
                            ]
                        })
                            (<Input placeholder="请输入物资名称" />
                            )
                    }
                </FormItem>
                <FormItem label="物资类别" {...formItemLayout}>
                    {
                        getFieldDecorator('wzType', {
                            initialValue: '',
                            rules: [
                                {
                                    required: true,
                                    message: '请选择物资类别'
                                }
                            ]
                        })(
                            <Select defaultValue="" style={{ width: 200 }} >
                                <Option value="" >请选择物资类别</Option>
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

                <FormItem label="物资数量" {...formItemLayout}>
                    {
                        getFieldDecorator('wzNum', {
                            initialValue: '',
                            rules: []
                        })(
                            <Input placeholder="请输入物资数量" />
                        )
                    }
                </FormItem>

                <FormItem label="物资储备库点" {...formItemLayout}>
                    {getFieldDecorator('cbkCode', {
                        initialValue: '',
                        rules: [
                            {
                                required: true,
                                message: '物资储备库点不能为空！'
                            }
                        ]
                    })(
                        <Input placeholder="请输入物资储备库点" />
                    )
                    }

                </FormItem>

                <FormItem label="物资属性" {...formItemLayout}>
                    {
                        getFieldDecorator('wzFlag', {
                            initialValue: '',
                            rules: []
                        })(
                            <Select defaultValue="" style={{ width: 200 }} >
                                <Option value="" >请选择物资属性</Option>
                                <Option value="1">可用  </Option>
                                <Option value="2">可调用</Option>
                            </Select>
                        )
                    }
                </FormItem>
            </Form>
        );
    }
}
OpenFormTable = Form.create({})(OpenFormTable);