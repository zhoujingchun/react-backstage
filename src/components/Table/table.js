
import React, { Component } from 'react';
import './style.css'
import img from './image/back.jpg'

import {Table, Input, Button, Popconfirm, Form, Modal,Tag, Tooltip, Icon } from 'antd';
import axios from "axios";

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
        <tr {...props} />
    </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);


let visible=false,currentValue="";




class EditableCell extends React.Component {
    state = {
        editing: false,
    };

    toggleEdit = () => {
        const editing = !this.state.editing;
        this.setState({ editing }, () => {
            if (editing) {
                this.input.focus();
            }
        });
    };

    save = e => {

        const { record, handleSave ,dataIndex} = this.props;


        //console.log(e.currentTarget.value)  当前的vaule值
        let value=e.currentTarget.value
        console.log(record);
        console.log(dataIndex);


        let {id,describe,label,sort}=record;


        //判断是更改标题 标签 分类


            if(describe==value){
                return
            }

            axios.put("/raw-post-update-title", {
                id: id,
                title: value
            }).then(res => {
                console.log(res.statusText + "更改成功")
                currentValue=value;
            }).then(() => {

                this.form.validateFields((error, values) => {
                    if (error && error[e.currentTarget.id]) {
                        return;
                    }
                    this.toggleEdit();
                    handleSave({...record, ...values});
                });

            })

    };

    renderCell = form => {
        this.form = form;
        const { children, dataIndex, record, title } = this.props;

        const { editing } = this.state;
        return editing ? (
            <Form.Item style={{ margin: 0 }}>
                {form.getFieldDecorator(dataIndex, {
                    rules: [
                        {
                            required: true,
                            message: `${title} is required.`,
                        },
                    ],
                    initialValue: record[dataIndex],
                })(<Input ref={node => (this.input = node)} onBlur={this.toggleEdit}  onPressEnter={this.save}  />)}
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{ paddingRight: 24 }}
                onClick={this.toggleEdit}
            >
                {children}
            </div>
        );
    };

    render() {
        const {
            editable,
            dataIndex,
            title,
            record,
            index,
            handleSave,
            children,
            ...restProps
        } = this.props;

        return (
            <td {...restProps}>
                {editable ? (
                    <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
                ) : (
                    children
                )}
            </td>
        );
    }
}

class EditableTable extends React.Component {
    constructor(props) {
        super(props);



        this.columns = [
            {
                title: '头图',
                dataIndex: 'headImg',

            },
            {
                title: '标题',
                dataIndex: 'describe',
                editable: true,

            },
            {
                title: '标签',
                dataIndex: 'label',

            }
            ,{
                title: '分类',
                dataIndex: 'sort',
                editable: true,
            },
            {
                title: '时长',
                dataIndex: 'duration',


            },
            {
                title: '源站  源UP',
                dataIndex: 'oringn',


            },

            {
                title: '当前状态',
                dataIndex: 'status',
            },
            {
                title: '入库时间',
                dataIndex: 'firstTime',
            },
            {
                title: '最后修改',
                dataIndex: 'lastTime',
            },
            {
                title: '修改人',
                dataIndex: 'remake_name',
            },

        ];

        this.state = {
            selectedRowKeys: [], // Check here to configure the default column
            data: [],
            current:1,//当前所在的页数,


        }

    }


    componentDidMount() {


    }
    componentWillReceiveProps(nextProps, nextContext) {

        console.log(nextProps)
        this.setState({
            data:nextProps.dataList
        })


    }






    onSelectChange =(selectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
        console.log(this.props)
        this.props.getSelectedRowKeys(selectedRowKeys)
    };

    handleDelete = key => {
        const data = [...this.state.data];
        this.setState({ data: data.filter(item => item.key !== key) });
    };


    handleAdd = () => {
        const { count, data } = this.state;
        const newData = {
            key: count,
            name: `Edward King ${count}`,
            age: 32,
            address: `London, Park Lane no. ${count}`,
        };
        this.setState({
            data: [...data, newData],
            count: count + 1,
        });
    };

    handleSave = row => {
        const newData = [...this.state.data];
        const index = newData.findIndex(item => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        this.setState({ data: newData });
    };
    cancelSelect(e){
        console.log(e)
    }


    render() {
        const { data ,selectedRowKeys} = this.state;
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };
        const columns = this.columns.map(col => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    handleSave: this.handleSave,
                }),
            };
        });
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            selections: [
                {
                    key: 'all-data',
                    text: '全选',
                    onSelect: () => {
                        this.setState({
                            selectedRowKeys: [...Array(46).keys()], // 0...45
                        });
                    },
                },

                {
                    key: 'even',
                    text: '选择偶数行',
                    onSelect: changableRowKeys => {
                        let newSelectedRowKeys = [];
                        newSelectedRowKeys = changableRowKeys.filter((key, index) => {
                            if (index % 2 !== 0) {
                                return true;
                            }
                            return false;
                        });
                        this.setState({ selectedRowKeys: newSelectedRowKeys });
                    },
                },
            ],
        };



        return (

            <div>

                <Table
                    onSelectInvert={this.cancelSelect.bind(this)}
                    loading={this.props.loading}
                    rowKey={record =>record.id}
                    pagination={this.props.pagination}

                    rowSelection={rowSelection}
                    onChange={this.props.handleTableChange}

                    components={components}
                    rowClassName={() => 'editable-row'}
                    bordered


                    dataSource={data}
                    columns={columns}
                />


            </div>
        );
    }


}

export  default EditableTable







