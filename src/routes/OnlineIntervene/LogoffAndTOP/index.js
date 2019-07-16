import React from 'react'
import {Card, Col, Row, Radio, Icon, Button, Steps, message,BackTop} from 'antd'
import CustomBreadcrumb from "../../../components/CustomBreadcrumb/index";
import TypingCard from '../../../components/TypingCard'


class StepsDemo extends React.Component {

    constructor(props,contex){
        super(props,contex);

        this.state = {
            indexNum:33242,

        }


    }


    render() {
        const cardContent = ` 下线与置顶   线上共有${this.state.indexNum}条` ;


        return (
            <div>
                <CustomBreadcrumb arr={['在线干预', '下线与置顶']}/>
                <TypingCard cate="4" source={cardContent}/>
            </div>
        )
    }
}




export default StepsDemo
