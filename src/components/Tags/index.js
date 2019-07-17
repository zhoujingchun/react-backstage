
//动态标签
import React from "react";
import {Icon, Input, Tag, Tooltip} from "antd";
import axios from 'axios'

class EditableTagGroup extends React.Component {
    state = {
        tags: [...this.props.tags],
        inputVisible: false,
        inputValue: '',
    };

    /* id:id,
           tag: removedTag*/
    handleClose = removedTag => {
        let id=this.props.id;
        //console.log(removedTag)

       axios.delete("/raw-post-delete-tags/?id="+id+"&tag="+removedTag).then(res=>{
           console.log(res)
       }).then(()=>{
     console.log(this.props.tags);
           const tags = this.state.tags.filter(tag => tag !== removedTag);
           this.setState({ tags });
       });



    };

    showInput = () => {
        this.setState({ inputVisible: true }, () => this.input.focus());
    };

    handleInputChange = e => {
        this.setState({ inputValue: e.target.value });
    };

    handleInputConfirm = () => {
        let id = this.props.id;
        const {inputValue} = this.state;
        let {tags} = this.state;
        if (inputValue && tags.indexOf(inputValue) === -1) {
            tags = [...tags, inputValue];
        }

        axios.put("/raw-post-update-tags", {
            id: id,
            tag:inputValue
        }).then(res => {
            console.log(res.statusText + "更改成功")

        }).then(() => {

            this.setState({
                tags,
                inputVisible: false,
                inputValue: '',
            });
        })

        console.log(tags);
        console.log(id);

    };

    saveInputRef = input => (this.input = input);

    render() {
        const { tags, inputVisible, inputValue } = this.state;
        return (
            <div>
                {tags.map((tag, index) => {
                    const isLongTag = tag.length > 20;
                    const tagElem = (
                        <Tag key={tag} closable={index !== -1} onClose={() => this.handleClose(tag)}>
                            {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                        </Tag>
                    );
                    return isLongTag ? (
                        <Tooltip title={tag} key={tag}>
                            {tagElem}
                        </Tooltip>
                    ) : (
                        tagElem
                    );
                })}
                {inputVisible && (
                    <Input
                        ref={this.saveInputRef}
                        type="text"
                        size="small"
                        style={{ width: 78 }}
                        value={inputValue}
                        onChange={this.handleInputChange}
                        onBlur={this.handleInputConfirm}
                        onPressEnter={this.handleInputConfirm}
                    />
                )}
                {!inputVisible && (
                    <Tag onClick={this.showInput} style={{ background: '#fff', borderStyle: 'dashed' }}>
                        <Icon type="plus" /> New Tag
                    </Tag>
                )}
            </div>
        );
    }
}

 export  default  EditableTagGroup
