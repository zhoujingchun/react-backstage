import React, {Component} from 'react';
import {Select,Input,InputNumber } from 'antd'
import Table  from '../Table/table'
import './style.css'
import axios from "axios";


const { Option } = Select;
// optionFilterProp="children"
// onChange={onChange}
// onFocus={onFocus}
// onBlur={onBlur}
// onSearch={onSearch}
// filterOption={(input, option) =>
// option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0

//input的事件  value输入框内容   onChange //根据传过来的cate 筛选类型  cate 1 粗筛  2精筛 3上线审核与排期


class SelectConten  extends Component {

    constructor(props,contex){
        super(props,contex);

        this.state = {
            selectionType:'',
            signType:''

        }
    }

    onChangeNumber(value) {

        console.log('changed', value);
    }






    render() {
        let {cate}=this.props;


        return (
            <div>
                <div className="select-title">
                    <div className="select-title-type">按状态筛选</div>
                    <div className="select-title-value">多标签查询,分割</div>
                </div>
                <div className="select-content">

                    {/*标签部分*/}



                     <Select    showSearch style={{ width: 300,flexGrow:0}} placeholder="原料/原料待定/今日垃圾/今日原料" optionFilterProp="children">

                       <Option value="原料">原料</Option>
                       <Option value="原料待定">原料待定</Option>
                       <Option value="今日垃圾">今日垃圾</Option>
                       <Option value="今日原料">今日原料</Option>


                    </Select>



                    <Input  style={{ width: 200,marginLeft:"30px" }}  placeholder="      Input Value"/>

                     <Select showSearch style={{ width: 300,flexGrow:0}} placeholder="原料/原料待定/今日垃圾/今日原料" optionFilterProp="children">

                     <Option value="原料">粗料</Option>
                     <Option value="原料待定">垃圾</Option>
                     <Option value="今日原料">原料待定</Option>


                     </Select>




                </div>


                {/*表格部分*/}
                <div style={{marginTop:"30px"}}>

                    {/*将父级的data传给表格*/}
                    <Table />
                </div>



            </div>
        )
    }
}

export default SelectConten ;
