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

<<<<<<< HEAD
    renderAsset = (event) =>  {
        InterviewAPI.renderAssets(this.props.id, this.props.interview);
        console.log("we hit!!!");
        this.props.updateInterviewCallback();
        console.log("testing123")
        console.log(UploadAPI.getUpload(this.props.id));
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
=======
function Asset(props) {
    return (
    
    <List.Item active={false} >
    <List.Content floated='right'>
        <Icon corner color='red' name='trash alternate outline' link onClick={() => {console.log("PRESSED!")}} aria-hidden='Delete' />
    </List.Content>
    <List.Content floated='left'>
            <Icon name={props.icon} />
            <b>{props.name}</b> <br/>
            {props.owner}
        </List.Content>

        <List.Content floated='right'>
            <Checkbox toggle onClick={renderAsset}/>
        </List.Content>
    </List.Item>
    )
>>>>>>> Standard trash button added above Asset name
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
                <Asset name={asset.name} owner={asset.owner} id={asset._id} interview={interview} icon='boxes' updateInterviewCallback={this.props.updateInterviewCallback}/>
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