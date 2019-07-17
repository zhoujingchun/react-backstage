import { Upload, Icon, Modal } from 'antd';
import React, {Component} from 'react';
import axios from "axios"
import './style.css'
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

class PicturesWall extends React.Component {
    state = {
        previewVisible: false,
        previewImage: '',
        fileList:
            [
            {
                uid: '-1',
                name: 'xxx.png',
                status: 'done',
                url: this.props.url,
            },
        ],
    };

    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async file => {
        console.log(file);

        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };

    handleChange = ({ fileList }) =>{




        let lastList=[];
        lastList.push(fileList.pop());

        if(!lastList[0]){
            lastList=[]
        }
        console.log(lastList);

        axios.put('/raw-post-up-pic',{
            filename:"F",
            filepath:"f"
        }).then(res=>{
            console.log(res)
        });

        this.setState(
            { fileList:lastList}
        )

    };

    render() {
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <div className="clearfix">
                <Upload
                    action="/raw-post-up-pic"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 3 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }
}

export default  PicturesWall
