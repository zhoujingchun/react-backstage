import React from 'react'
import {Card, Col, Row, Radio, Icon, Button, Steps, message,BackTop} from 'antd'
import CustomBreadcrumb from "../../../components/CustomBreadcrumb/index";
import TypingCard from '../../../components/TypingCard'


class StepsDemo extends React.Component {

    constructor(props,contex){
        super(props,contex);

        this.state = {
            indexNum:1789996,

        }


    }


    render() {
        const cardContent = ` 评论维护   当前还剩${this.state.indexNum}条待处理` ;


        return (
            <div>
                <CustomBreadcrumb arr={['内容生产', '上线审核与排期']}/>
                <TypingCard cate="5" source={cardContent}/>
            </div>
        )
    }
}




export default StepsDemo
