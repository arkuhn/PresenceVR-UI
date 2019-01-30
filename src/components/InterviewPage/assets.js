import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';
import 'filepond/dist/filepond.min.css';
import React, { Component } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import { Button, Segment, Dimmer, Loader, Header, Icon, List, Checkbox } from 'semantic-ui-react';
import UploadAPI from '../../utils/UploadAPI';
import InterviewAPI from '../../utils/InterviewAPI';

registerPlugin(FilePondPluginImagePreview);

function renderAsset(id, interview) {
        //TODO PATCH update interview 'rendered assets' property and reload page
        console.log("we hit!!!!!!!!!!!")
        InterviewAPI.updateAssetList(id, interview).then(() => window.location.reload());
}

function Asset(props) {
    return (
    
    <List.Item active={false} >
    <List.Content floated='left'>
            <Icon name={props.icon} />
            <b>{props.name}</b> <br/>
            {props.owner}
        </List.Content>

        <List.Content floated='right'>
            <Button onClick={renderAsset(props.id, props.interview)}>Render</Button>
            <Button onClick={renderAsset(props.id, props.interview)}>Remove</Button>
        </List.Content>
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
            if (uploads && uploads.data) {
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
    
        var interview = this.props.interview;

        return this.state.assets.map((asset) => {
            return  (  
                //pass in asset ID and interview ID as props
                <Asset id={asset._id} interview={interview} ssname={asset.name} owner={asset.owner} icon='boxes'/>
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