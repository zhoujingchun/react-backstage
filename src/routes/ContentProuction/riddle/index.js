import React from 'react'
import {Card, Menu, Row, Col, Dropdown, Icon, message, Button} from 'antd'
import CustomBreadcrumb from '../../../components/CustomBreadcrumb/index'
import TypingCard from '../../../components/TypingCard'
import SelectConten from "../../../components/SelectContent";


class DropdownDemo extends React.Component {

    constructor(props,contex){
        super(props,contex);

        this.state = {
            indexNum:1789996,

        }


    }
  handleMenuClick(e) {
    message.info(`Click on menu ${e.key} item.`)
  }

  render() {


    const cardContent = ` 粗筛   当前还剩${this.state.indexNum}条待处理` ;
    return (
      <div>
        <CustomBreadcrumb arr={['内容生产','粗筛']}/>
        <TypingCard  cate="1" source={cardContent}/>
          <SelectConten cate="1" />

      </div>
    )
  }
}

export default DropdownDemo
