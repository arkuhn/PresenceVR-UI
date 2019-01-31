import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';
import 'filepond/dist/filepond.min.css';
import React, { Component } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import { Button, Segment, Dimmer, Loader, Header, Icon, List, Checkbox } from 'semantic-ui-react';
import UploadAPI from '../../utils/UploadAPI';
import InterviewAPI from '../../utils/InterviewAPI';

registerPlugin(FilePondPluginImagePreview);

class Asset extends Component {
    constructor(props) {
        super(props)
    }

    renderAsset = (event) =>  {
        InterviewAPI.renderAssets(this.props.id, this.props.interview);
        console.log("we hit!!!")
        this.props.updateInterviewCallback()
    }

    deleteAsset = () => {
        UploadAPI.deleteUpload(this.props.id).then((response) => {
            this.props.updateAssetsCallback()
        });
    }

    render() {
        return (
            <List.Item active={false} >
            <List.Content floated='left'>
                    <Icon name={this.props.icon} />
                    <b>{this.props.name}</b> <br/>
                    {this.props.owner}
                </List.Content>
        
                <List.Content floated='right'>
                    <Checkbox toggle onClick={this.renderAsset}/>
                </List.Content>
            </List.Item>
            )
    }
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
    }

    handleModelClose = () => { 
        this.setState({ modalOpen: false })
    }

    handleModelOpen = () => {
        this.setState({ modalOpen: true})
    }

    updateList = () => {
        this.setState({loading: true})
        UploadAPI.getUploads().then((uploads) => {  
            if (uploads && uploads.data) {
                this.setState({assets: uploads.data.filter(upload => upload.type === 'asset'), loading: false});
            }
            else {
                this.setState({assets: []})
            }
        });
    }

    componentDidMount = () => {
        this.updateList()
    }

    onChange = (e) => {
        switch (e.target.name) {
          case 'uploadedFile':
            this.setState({ uploadedFile: e.target.files[0] });
            break;
          default:
            this.setState({ [e.target.name]: e.target.value });
        }
      }

    onSubmit = (e) => {
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


    loadAssetsModal = () => {
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
    generateAssets = () => {
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

        var interview = this.props.interview;
    
        return this.state.assets.map((asset) => {
            return  (  
                <Asset name={asset.name}
                id={asset._id}
                owner={asset.owner}
                icon='boxes'
                updateInterviewCallback={this.props.updateInterviewCallback}
                updateAssetsCallback={this.updateList}
                />
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