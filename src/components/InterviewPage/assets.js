import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';
import 'filepond/dist/filepond.min.css';
import React, { Component } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import { Button, Segment, Dimmer, Loader, Header, Icon, List, Checkbox } from 'semantic-ui-react';
import UploadAPI from '../../utils/UploadAPI';

registerPlugin(FilePondPluginImagePreview);

function Asset(props) {
    return (
    <List.Item active={false} >
        <Icon name={props.icon} />
        <List.Content>
            <List.Header>{props.name}</List.Header>
            <List.Description>
            {props.owner}
            </List.Description>
        </List.Content>
        <Checkbox />
    </List.Item>
    )
}


class Assets extends Component {
    constructor(props) {
        super(props)
        this.state = {
            assets: [],
            modalOpen: false,
            uploadedFile: '',
            loading: false
        }

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

    updateList() {
        this.setState({loading: true})
        UploadAPI.getUploads().then((uploads) => {  
            if (uploads.data) {
                this.setState({assets: uploads.data.filter(upload => upload.type === 'asset'), loading: false});
            }
            else {
                this.setState({assets: []})
            }
        });
    }

    componentDidMount() {
        this.updateList()
    }

    renderAssets() {
        //TODO update interview 'rendered assets' property and reload page
    }

    onChange = (e) => {
        console.log(e.target)

        switch (e.target.name) {
          case 'uploadedFile':
            this.setState({ uploadedFile: e.target.files[0] });
            break;
          default:
            this.setState({ [e.target.name]: e.target.value });
        }
        console.log(this.state)
      }

    onSubmit(e) {
        e.preventDefault();
        let formData = new FormData();
        if (!this.state.uploadedFile) {
            this.handleModelClose()
            return
        }
        formData.append('uploadedFile', this.state.uploadedFile);
        this.setState({loading: true})
        UploadAPI.uploadFile(formData, 'asset').then((response) => {
            this.updateList()
        })
        this.handleModelClose()
    }


    loadAssetsModal() {
        return (
            <form onSubmit={this.onSubmit}>

                <Segment>
                <Button secondary content='Upload' onClick={this.onSubmit} />
                <input 
                    type="file"
                    name="uploadedFile"
                    onChange={this.onChange}
                />
                </Segment>
        
            </form>
        )    
    }
    generateAssets() {
        if (this.state.loading) {
            return (<div>
                <br/>
                <br/>
                <Dimmer active inverted>
                    <Loader> Loading assets </Loader>
                </Dimmer>
            </div>)
        }
        if (this.state.assets.length === 0) {
            return (
            <List.Item>
            <List.Content>
                <List.Header>No assets to show!</List.Header>
            </List.Content>
            </List.Item>)
        }
    
        return this.state.assets.map((asset) => {
            return  (  
                <Asset name={asset.name} owner={asset.owner} icon='boxes'/>
            )
            
        })
    }

    render() {
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
                <List selection={true} className="AssetsList">
                    {this.generateAssets()}
                </List>
                {this.loadAssetsModal()}
                <style>{css}</style>
            </div>
        );
    }
}

export default Assets;