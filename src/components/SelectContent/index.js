import React, {Component} from 'react';
import {Select, Input, InputNumber, Modal} from 'antd'
import Table from '../Table/table'
import './style.css'
import axios from "axios";


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
            selectedRowKeys: []


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
    handleTableChange({current, pageSize}){
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

        let   value = this.parseStatus("原料");
        console.log(value);


        axios.get('/search_status?page='+page+'&type=' + value[0] + "&status=" + value[1]).then(res => {
            //console.log(res.data.data)
            return res.data.data
        }).then(data => {
            this.setTableList(data)
        })


    }




    setTableList(res) {
        console.log(res);
        console.log(statusArray[0][0]);

        const data = [];
        res.forEach((res, index) => {


            data.push({

                'describe': res.title,
                'video': <video className="video" controls src={res.data.url}></video>,
                "firstTime": "",
                "lastTime": "",
                "name": res.name,
                "status": statusArray[res.type][res.status],
                "duration": res.data.duration,
                "remake_name": res.end_edit_user_id,
                "label": res.tags.title,
                "oringn": "源站 :" + res.source_station + "  源UP " + res.source_up,
                "sort": res.sort,
                "id": res.id


            });
        })

        this.setState({
            dataList: data
        })
    }


    // 选择状态框选中后的事件
    handleChange(value) {
        value = this.parseStatus(value);


       this.getListByStatus(0,value)


    }

    getListByStatus(page,value){
        axios.get('/search_status/?type=' + value[0] + "&status=" + value[1]).then(res => {
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
                return [3,0]


        }

    }

    //标记状态框
    handleSelChangeTwo(currentValue) {

        let {selectedRowKeys, dataList} = this.state;

        let value = this.parseStatus(currentValue);
        axios.put('/raw-post-update-status', {
            type: value[0],
            status: value[1],
            id:selectedRowKeys
        }).then(()=>{
            this.getList(0)
        })

    }

    //input框输入后的选择事件
    handleInput(e) {
        //raw-post-search-by-tags
         console.log(e.target.value) //输入时匹配后台数据
        let tags=e.target.value

        axios.get('/raw-post-search-by-tags/?tags='+tags).then(res=>{
         console.log(res)
        })




    }

    //  onOk={this.handleOk.bind(this)}
    //                     onCancel={this.handleCancel.bind(this)}


    //对话框ok，与cancel 事件
    handleOk() {

        let {selectedRowKeys, dataList, currentStatus} = this.state;



        let value = this.parseStatus(currentStatus);

        let id = [];

        //获取id 数组

       console.log(id)
        axios.put('/raw-post-update-status', {
            type: value[0],
            status: value[1],
            id:selectedRowKeys
        })
            .then(
                res => {

                    return res.data.data
                }
            ).then(res => {

            this.setTableList(res);

        })
            .then(() => {

                this.setState({
                    visible: false            //关闭提示框
                })

            })



    }

    handleCancel() {
        this.setState({
            visible: false
        })
    }


    render() {
        let {cate} = this.props;
        console.log(cate)


        return (
            <div>
                <div className="select-title">
                    <div className="select-title-type">按状态筛选</div>
                    <div className="select-title-value">多标签查询,分割</div>
                </div>
                <div className="select-content">

                    {/*标签部分*/}


                    {
                        cate == 1 ?
                            <Select  onChange={this.handleChange.bind(this)} style={{width: 300, flexGrow: 0}}
                                    placeholder="原料/原料待定/今日垃圾/今日原料" >


                                <Option value="原料">原料</Option>
                                <Option value="原料待定">原料待定</Option>
                                <Option value="今日垃圾">今日垃圾</Option>
                                <Option value="今日粗料">今日粗料</Option>


                            </Select> :
                            cate == "2" ?
                                <Select showSearch style={{width: 300, flexGrow: 0}} placeholder="粗料/粗料待定/今日细料/细料反工"
                                        optionFilterProp="children">

                                    <Option value="粗料">粗料</Option>
                                    <Option value="粗料待定">粗料待定</Option>
                                    <Option value="今日细料">今日细料</Option>
                                    <Option value="细料返工">细料返工</Option>
                                </Select> :
                                cate == "3" ?
                                    <Select showSearch style={{width: 300, flexGrow: 0}} placeholder="原料/原料待定/今日垃圾/今日原料"
                                            optionFilterProp="children">

                                        <Option value="细料">细料</Option>
                                        <Option value="细料待定">细料待定</Option>
                                        <Option value="不可上线">不可上线</Option>
                                        <Option value="今日预上线">今日预上线</Option>
                                        <Option value="今日上线">今日上线</Option>
                                    </Select> :
                                    cate == "4" ?
                                        <Select showSearch style={{width: 300, flexGrow: 0}} placeholder="线上/今日下线"
                                                optionFilterProp="children">

                                            <Option value="线上">线上</Option>
                                            <Option value="线上">线上</Option>
                                        </Select> : ""


                    }


                    <Input onPressEnter={this.handleInput.bind(this)} style={{width: 200, marginLeft: "30px"}}
                           placeholder="      Input Value"/>
                    {
                        cate == 1 ?
                            <Select onChange={this.handleSelChangeTwo.bind(this)}
                                    style={{marginLeft: "30px", width: 300, flexGrow: 0}} placeholder="粗料/垃圾/原料待定"
                                   >

                                <Option value="粗料">粗料</Option>
                                <Option value="垃圾">垃圾</Option>
                                <Option value="原料待定">原料待定</Option>


                            </Select> :
                            cate == "2" ?
                                <Select  showSearch style={{marginLeft: "30px",width: 300, flexGrow: 0}} placeholder="标记为  细料/垃圾/粗料待定"
                                        optionFilterProp="children">

                                    <Option value="细料">细料</Option>
                                    <Option value="垃圾">垃圾</Option>
                                    <Option value="粗料待定">粗料待定</Option>

                                </Select> :
                                cate == "3" ?
                                    <Select showSearch style={{width: 300, flexGrow: 0}} placeholder="原料/原料待定/今日垃圾/今日原料"
                                            optionFilterProp="children">

                                        <Option value="细料">细料待定</Option>
                                        <Option value="细料">不可上线</Option>
                                        <Option value="今日预上线">今日预上线</Option>
                                        <Option value="今日上线">今日上线</Option>
                                        <Option value="今日上线">细料返工</Option>
                                    </Select> :
                                    cate == "4" ?
                                        <Select showSearch style={{width: 300, flexGrow: 0}} placeholder="标记为 上线/下线/置顶"
                                                optionFilterProp="children">

                                            <Option value="细料">上线</Option>
                                            <Option value="细料">下线</Option>
                                            <Option value="今日预上线">置顶</Option>

                                        </Select> : ""


                    }

                    {/*填写日期的标签*/}
                    {
                        cate == 3 || cate == 3 ?
                            <div style={{marginLeft: "30px"}}><InputNumber min={1} max={100} defaultValue={3}
                                                                           onChange={this.onChangeNumber.bind(this)}/>
                            </div> : ""
                    }
                </div>


                {/*表格部分*/}
                <div style={{marginTop: "30px"}}>

                    {/*将父级的data传给表格*/}
                    <Table handleTableChange={this.handleTableChange.bind(this)}  getSelectedRowKeys={this.getSelectedRowKeys.bind(this)} dataList={this.state.dataList}
                           cate={cate}/>
                </div>






            </div>
        )
    }
}

export default SelectConten;










