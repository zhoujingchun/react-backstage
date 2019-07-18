
import React, {Component} from 'react';
import {Radio, Select} from 'antd';
import './style.css'



class RadioSelect extends React.Component {
    state = {

    };
//
// <Select   style={{width: 300, flexGrow: 0}}
// placeholder="粗料/粗料待定/今日细料/细料反工/今日垃圾"
// optionFilterProp="children">
//
// <Option value="粗料">粗料</Option>
// <Option value="粗料待定">粗料待定</Option>
// <Option value="今日细料">今日细料</Option>
// <Option value="细料返工">细料返工</Option>
// <Option value="今日垃圾">今日垃圾</Option>
// </Select>

   onChange(e){
       let value=e.target.value;
      this.props.onChange(value);
   }

    render() {
       return (
           <div className="radio-select">

               {
                   this.props.cate==1?
                       //粗筛选择框
                       <Radio.Group   onChange={this.onChange.bind(this)} defaultValue="原料" buttonStyle="solid">
                           <Radio.Button value="原料">原料</Radio.Button>
                           <Radio.Button value="原料待定">原料待定</Radio.Button>
                           <Radio.Button value="今日垃圾">今日垃圾</Radio.Button>
                           <Radio.Button value="今日粗料">今日粗料</Radio.Button>
                       </Radio.Group>:

                       //精筛框
                       <Radio.Group   onChange={this.onChange.bind(this)} defaultValue="粗料" buttonStyle="solid">
                           <Radio.Button value="粗料">粗料</Radio.Button>
                           <Radio.Button value="粗料待定">原料待定</Radio.Button>
                           <Radio.Button value="今日细料">今日细料</Radio.Button>
                           <Radio.Button value="细料返工">细料返工</Radio.Button>
                           <Radio.Button value="今日垃圾">今日垃圾</Radio.Button>
                       </Radio.Group>
               }
           </div>
       )

    }
}

export default   RadioSelect
