import React, {Component} from 'react';
import {Select, Input, InputNumber, Modal, Tag, Tooltip, Icon} from 'antd'

import TableTidy from '../Table-tidy/table'
import './style.css'
import axios from "axios";
import EditableTagGroup from '../Tags/index'
import imgUrl from './back.jpg'
import UpImage from '../UpImg/index'


const {Option} = Select;
// optionFilterProp="children"
// onChange={onChange}
// onFocus={onFocus}
// onBlur={onBlur}
// onSearch={onSearch}
// filterOption={(input, option) =>
// option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0

//input的事件  value输入框内容   onChange //根据传过来的cate 筛选类型  cate 1 粗筛  2精筛 3上线审核与排期

//设置
const statusArray = [
    ["原料", "原料待定"], ["粗料待定", "粗料"], ["细料待定", "细料", "不可上线", "预上线"], ["垃圾"]
];


class SelectConten extends Component {

    constructor(props, contex) {
        super(props, contex);

        this.state = {
            selectionType: '',
            signType: '',
            dataList: '',//table数据列表
            inputValue: "",
            visible: false,//对话框变量
            currentStatus: "",
            selectedRowKeys: [],
            pagination: {
                current: 1,
                total: 200
            }


        }
    }

    onChangeNumber(value) {

        console.log('changed', value);
    }

    //利用proxy设置代理服务器  axios  获取数据
    componentDidMount() {
        this.getList(0)
    }

    // 修改 selectedRowKeys
    getSelectedRowKeys(value) {
        this.setState({
            selectedRowKeys: value
        })

    }

    //底部分页点击后的事件
    handleTableChange({current, pageSize}) {
        let {pagination} = this.state;
        pagination.current = current


        this.setState({pagination: pagination})
        console.log(current)
        this.getList(current)
    }

    getList(page) {

        // axios.get('/getlist?page='+page)
        //     .then(res => {
        //
        //         return res.data.data
        //     }).then(res => {
        //     this.setTableList(res);
        // })

        let value = this.parseStatus("粗料");
        console.log(value);


        axios.get(' http://api-evo-admin.mars-health.com/search_status?page=' + page + '&type=' + value[0] + "&status=" + value[1]).then(res => {
            //console.log(res.data.data)
            return res.data.data
        }).then(data => {
            this.setTableList(data)
        })


    }

    parseTags(data) {
        let tags = [];
        data.forEach(item => {
            tags.push(item.title)
        });

        return tags

    }
  parseTime(data){
        let time='';
        let min="";
        let s="";
        if(data>60){
            min=parseInt(data/60);
            s=data%60
        }
        time=min+"分"+s+"秒"
        return  time
    }


    setTableList(res) {

        console.log(statusArray[0][0]);

        const data = [];
        res.forEach((res, index) => {

            res.data = eval('(' + res.data + ')');

            let tags = this.parseTags(res.tags)

            // res.updated_at.slice(0, 13).replace(/\s|-/g, "/") res.data.thumb
            data.push({

                'describe': res.title,
                'video': <div className="video-container">  <video className="video" controls src={res.data.url}></video></div>,
                "firstTime": "2019/9/3",
                "lastTime": "2019/10/11",
                "name": res.name,
                "status": statusArray[res.type][res.status],
                "duration":  this.parseTime(res.data.duration) ,
                "remake_name": res.end_edit_user_id,
                "label": <EditableTagGroup id={res.id} tags={tags}/>,
                "oringn": "源站 :" + res.source_station + "  源UP " + res.source_up,
                "sort": res.sort,
                "id": res.id,
                "img":<div className="vieo-update"><UpImage  url={res.data.thumb} /></div>



            });
        })

        this.setState({
            dataList: data
        })
    }


    // 选择状态框选中后的事件
    handleChange(value) {
        value = this.parseStatus(value);


        axios.get(' http://api-evo-admin.mars-health.com/search_status/?type=' + value[0] + "&status=" + value[1]).then(res => {
            //console.log(res.data.data)
            return res.data.data
        }).then(data => {
            this.setTableList(data)
        })


    }

    parseStatus(value) {
        console.log(value)
        switch (value) {
            case "原料待定":
                return [0, 1];
                break;
            case  "原料":
                return [0, 0];
                break;
            case "粗料待定":
                return [1, 0];
                break;
            case  "粗料":
                return [1, 1];
                break;
            case "今日粗料":
                return [1, 1];
            case "细料待定":
                return [2, 0];
                break;
            case  "细料":
                return [2, 1];
                break;
            case  "不可上线":
                return [2, 2];
                break;
            case  "预上线":
                return [2, 3];
                break;
            default:
                return [3, 0]


        }

    }

    //标记状态框
    handleSelChangeTwo(currentValue) {

        let {selectedRowKeys, dataList} = this.state;
        if(!selectedRowKeys.length){
            return
        }

        let value = this.parseStatus(currentValue);
        axios.put(' http://api-evo-admin.mars-health.com/raw-post-update-status', {
            type: value[0],
            status: value[1],
            id: selectedRowKeys
        }).then(() => {
            this.getList(0)
        })

    }


    //input框输入后的选择事件
    handleInput(e) {

        console.log(e.target.value) //输入时匹配后台数据


    }

    //  onOk={this.handleOk.bind(this)}
    //                     onCancel={this.handleCancel.bind(this)}




    handleCancel() {
        this.setState({
            visible: false
        })
    }


    render() {



        return (
            <div>
                <div className="select-title">
                    <div className="select-title-type">按状态筛选</div>
                    <div className="select-title-value">多标签查询,分割</div>
                </div>
                <div className="select-content">

                    {/*标签部分*/}

                    <Select onChange={this.handleChange.bind(this)}  style={{width: 300, flexGrow: 0}}
                            placeholder="粗料/粗料待定/今日细料/细料反工/今日垃圾"
                            optionFilterProp="children">

                        <Option value="粗料">粗料</Option>
                        <Option value="粗料待定">粗料待定</Option>
                        <Option value="今日细料">今日细料</Option>
                        <Option value="细料返工">细料返工</Option>
                        <Option value="细料返工">今日垃圾</Option>
                    </Select>


                    <Input onPressEnter={this.handleInput.bind(this)} style={{width: 200, marginLeft: "30px"}}
                           placeholder="      Input Value"/>
                    {/*autoClearSearchValue={false} value="标记为"  autoFocus={false} allowClear={true}  onChange={this.handleSelChangeTwo.bind(this)}
                                    style={{marginLeft: "30px",color:"#ccc", width: 300, flexGrow: 0}}*/}

                    <Select onChange={this.handleSelChangeTwo.bind(this)}
                            value="标记为"  autoFocus={false}
                            style={{marginLeft: "30px", width: 300, flexGrow: 0,color:"#ccc"}} placeholder="标记为  细料/垃圾/粗料待定"
                            optionFilterProp="children">

                        <Option value="细料">细料</Option>
                        <Option value="垃圾">垃圾</Option>
                        <Option value="粗料待定">粗料待定</Option>

                    </Select>
                </div>


                {/*表格部分*/}
                <div style={{marginTop: "30px"}}>

                    {/*将父级的data传给表格*/}
                    <TableTidy pagination={this.state.pagination}
                               handleTableChange={this.handleTableChange.bind(this)}
                               getSelectedRowKeys={this.getSelectedRowKeys.bind(this)}
                               dataList={this.state.dataList}
                               />
                </div>


            </div>
        )
    }
}

export default SelectConten;


