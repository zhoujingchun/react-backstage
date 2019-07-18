import React, {Component} from 'react';
import {Select, Input, InputNumber, Modal} from 'antd'
import Table from '../Table/table'
import './style.css'
import axios from "axios";
import RadioSelect from '../RadioSelect/index'


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
            currentValue: "",
            selectedRowKeys: [],
            pagination:{
                current:1,
                total:100
            },
            loading:false,
            select:[]


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
        console.log(value)
        this.setState({
            selectedRowKeys: value
        })

    }

    //底部分页点击后的事件

    handleTableChange({current, pageSize}) {
        let {pagination,currentValue} = this.state;
        pagination.current = current;
        console.log(currentValue)
        pagination.total = pageSize+pagination.total;

        this.setState({pagination: pagination})
        console.log(current)
        this.getList(current,currentValue)
    }


    //获取首页
    getList(page,value) {

        // axios.get('/getlist?page='+page)
        //     .then(res => {
        //
        //         return res.data.data
        //     }).then(res => {
        //     this.setTableList(res);
        // })
        value=value?value:"原料"

        let   value1 = this.parseStatus(value);
        console.log(value);


        axios.get('/search_status?page='+page+'&type=' + value1[0] + "&status=" + value1[1]).then(res => {

           console.log(res);

            return res.data.data
        }).then(data => {

            this.setTableList(data)
        }).then(()=>{
            this.setState({
                loading:false
            })
        })


    }


    parseTags(data) {
        let tags = [];
        data.forEach(item => {
            tags.push(item.title)
        });

        return tags

    }
    parseTime(data) {
        let time = '';
        let min = "";
        let s = "";
        if (data > 60) {
            min = parseInt(data / 60);
            s = data % 60
        }
        time = min + "分" + s + "秒";
        return time

    }
        setTableList(res) {
        console.log(res);
        console.log(statusArray[0][0]);

        const data = [];
        res.forEach((res, index) => {
            res.data = eval('(' + res.data + ')');
            // res.updated_at.slice(0, 13).replace(/\s|-/g, "/") created_at
            let firstTime=res.created_at.slice(0, 13).replace(/\s|-/g, "/");
            let lastTime=res.updated_at?res.created_at.slice(0, 13).replace(/\s|-/g, "/"):"";
            let tags = this.parseTags(res.tags)

            data.push({

                'describe': res.title,
                'headImg': <img src={res.data.thumb} alt=""/>    ,
                "firstTime": res.created_at,
                "lastTime": res.updated_at,
                "name": res.name,
                "status": statusArray[res.type][res.status],
                "duration": this.parseTime(res.data.duration) ,
                "remake_name": res.end_edit_user_id,
                "label": res.tags.title,
                "oringn": "源站 :" + "bilibili" + "  源UP " + res.source_up,
                "sort": res.sort,
                "id": res.id


            });
        })

        this.setState({
            dataList: data
        })
    }


    //点击不同状态获取列表
    handleChange(value) {
        let currentValue=value;
        console.log('ddadada')

        this.setState({
            currentValue:currentValue,
        })

        value = this.parseStatus(value);

        let  pagination={current:1, total:100}
        this.setState({pagination})

        this.getList(1,currentValue)




    }




    parseStatus(value) {
        console.log(value);
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
                return [1, 1,"sign"];
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
            case  "今日垃圾":
                return [3, 0,"sign"];
                break;
            default:
                return [3,0]


        }

    }

    //标记状态框
    handleSelChangeTwo(currentValue) {

        let {selectedRowKeys, dataList} = this.state;


        if(!selectedRowKeys.length){
            return
        }


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
                        <RadioSelect  cate="1" onChange={this.handleChange.bind(this)}/>


                    }


                    <Input onPressEnter={this.handleInput.bind(this)} style={{width: 200, marginLeft: "30px"}}
                           placeholder="      Input Value"/>
                    {
                        cate == 1 ?
                            <Select autoClearSearchValue={false} value="标记为"  autoFocus={false} allowClear={true}  onChange={this.handleSelChangeTwo.bind(this)}
                                    style={{marginLeft: "30px",color:"#ccc", width: 300, flexGrow: 0}} placeholder="粗料/垃圾/原料待定"
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
                    <Table     loading={this.state.loading}   pagination={this.state.pagination}  handleTableChange={this.handleTableChange.bind(this)}  getSelectedRowKeys={this.getSelectedRowKeys.bind(this)} dataList={this.state.dataList}
                           cate={cate}/>
                </div>






            </div>
        )
    }
}

export default SelectConten;










