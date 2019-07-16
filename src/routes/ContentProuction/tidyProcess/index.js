import React from 'react'
import {Card, Col, Row, Menu, Icon, Switch} from 'antd'
import CustomBreadcrumb from "../../../components/CustomBreadcrumb/index";
import TypingCard from '../../../components/TypingCard'
import SelectContenTidy from "../../../components/SelectContend-tidy";


class MenuDemo extends React.Component {


  constructor(props,contex){
    super(props,contex);

    this.state = {
      indexNum:1789996,

    }
  }
  render() {
    const cardContent = ` 精筛加工   当前还剩${this.state.indexNum}条待处理` ;
    return (
      <div>
        <CustomBreadcrumb arr={['内容生产','精筛加工']}/>
        <TypingCard   cate="2" source={cardContent} height={30}/>
        <SelectContenTidy cate="2" />

      </div>
    )
  }
}



export default MenuDemo
