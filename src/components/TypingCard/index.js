import React from 'react'
import {Card} from 'antd'
import Typing from '../../utils/typing'
import SelectConten from '../SelectContent/index';
import axios from "axios";




class TypingCard extends React.Component {
    constructor(props,contex){
        super(props,contex);

    }

   static defaultProps = {
     title: '粗筛',
     source:'',
    height:20
  };
  componentDidMount(){
      const typing = new Typing({
      source:this.source,
      output:this.output,
      delay:30
    });
    typing.start();



  }





  render() {

    return (

        <div>
       <Card hoverable bordered={false} className='card-item'  style={{minHeight:this.props.height}} id={this.props.id}>
        <div style={{display:'none'}} ref={el => this.source = el} dangerouslySetInnerHTML={{__html:this.props.source}}/>
        <div ref={el => this.output = el}/>
       </Card>



        </div>
    )
  }
}

export default TypingCard
