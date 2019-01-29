import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';
import 'filepond/dist/filepond.min.css';
import React, { Component } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import { Button, Divider, Header, Icon, List, Modal } from 'semantic-ui-react';
import UploadAPI from '../../utils/UploadAPI';

registerPlugin(FilePondPluginImagePreview);

function Asset(props) {
    return (
    <List.Item as='a'>
        <Icon name={props.icon} />
        <List.Content>
            <List.Header>{props.name}</List.Header>
            <List.Description>
            Uploaded on {props.date}
            </List.Description>
        </List.Content>
    </List.Item>
    )
}


class Assets extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalOpen: false,
            assetUpload: ''
        }
        this.assets = []

        this.handleModelClose = this.handleModelClose.bind(this)
        this.handleModelOpen = this.handleModelOpen.bind(this)
        this.loadAssetsModal = this.loadAssetsModal.bind(this);
        this.generateAssets = this.generateAssets.bind(this)
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }
    handleModelClose() { 
        this.setState({ modalOpen: false })
    }

    handleModelOpen() {
        this.setState({ modalOpen: true})
    }

    onChange = (e) => {
        switch (e.target.name) {
          case 'assetUpload':
            this.setState({ assetUpload: e.target.files[0] });
            break;
          default:
            this.setState({ [e.target.name]: e.target.value });
        }
      }

    onSubmit(e) {
        e.preventDefault();
        let formData = new FormData();
  
        formData.append('assetUpload', this.state.assetUpload);
        formData.append('test', '123')
        console.log(formData)
        UploadAPI.assetUpload(formData)
    }


    loadAssetsModal() {
        return (
            <Modal trigger={ <Button fluid onClick={this.handleModelOpen} content='Load more'/> } open={this.state.modalOpen} onClose={this.handleClose} closeIcon>
                <Header icon='boxes' content='Select an asset to load' />
                <Modal.Content>
                    <form onSubmit={this.onSubmit}>
                    <br/>
                        <input 
                            type="file"
                            name="assetUpload"
                            onChange={this.onChange}
                        />
                    <br/>                    
                    <Button type="submit" onClick={this.onSubmit} fluid>Upload</Button>
                    </form>
                </Modal.Content>
            </Modal>
        )    
    }
    generateAssets() {
        if (this.props.assets.length === 0) {
            return <p> No environments added!</p>
        }
        return this.props.assets.map((asset) => {
            return <Asset name={asset.name} date={'0/0/00'} icon='boxes'/>
        })
    }

    render() {
        this.assets= [] // Clear assets everytime this is re-rendered

        const css = ` 
        .AssetsList {
            height:250px;
            overflow:scroll;
            max-width: 100%;
            overflow-x: hidden;
        }
        `

        return (
            <div>
                <Header as='h3'>
                    <Icon name='boxes' />
                    Assets
                </Header>
                <List className="AssetsList">
                    {this.generateAssets()}
                </List>
                {this.loadAssetsModal()}
                <style>{css}</style>
            </div>
        );
    }
}

export default Assets;