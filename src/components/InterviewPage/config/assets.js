import React, { Component } from 'react';
import { Button, Checkbox, Dimmer, Icon, List, Loader, Popup, Segment } from 'semantic-ui-react';
import InterviewAPI from '../../../utils/InterviewAPI';
import UploadAPI from '../../../utils/UploadAPI';


class Asset extends Component {
    renderAsset = () => {
        var op;
        if (this.props.loaded) {
            op = 'remove'
        } else {
            op = 'add'
        }
        
        InterviewAPI.patchInterview(this.props.interviewId, 'loadedAssets', this.props.id, op).then((response) => {
            this.props.socket.emit('update')
        });
    }

    deleteAsset = () => {
        UploadAPI.deleteUpload(this.props.id).then((response) => {
            this.props.updateAssetsCallback()
        });
    }

    render() {
        return (
            <List.Item >
                <List.Content floated='right'>
                    <Icon corner color='red' name='trash alternate outline' link onClick={this.deleteAsset} />
                </List.Content>
                <List.Content floated='left'>
                    <Icon name={this.props.icon} />
                    <b>{this.props.name}</b> <br />
          
                </List.Content>

                <List.Content floated='right'>
                    <Checkbox toggle onChange={this.renderAsset} checked={this.props.loaded} />
                </List.Content>
            </List.Item>
        );
    }
}


class Assets extends Component {
    constructor(props) {
        super(props)
        this.state = {
            assets: [],
            uploadedFile: '',
            loading: false
        }
    }


    updateList = () => {
        this.setState({ loading: true })
        UploadAPI.getUploads().then((uploads) => {
            if (uploads && uploads.data) {
                this.setState({ assets: uploads.data.filter(upload => upload.type === 'asset'), loading: false });
            }
            else {
                this.setState({ assets: [], loading: false })
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
            return
        }
        formData.append('uploadedFile', this.state.uploadedFile);
        this.setState({ loading: true })
        UploadAPI.uploadFile(formData, 'asset').then((response) => {
            this.updateList()
        })
    }


    uploadBox = () => {
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

    /* Type corresponds to filetype
    image, obj, or mp4
    */
    renderAssets = (type) => {
        var getIcon = {
            'image': 'image outline',
            'obj': 'box',
            'video': 'video',
            'application/zip': 'box'
        }

        var getFilter = {
            'image': 'image',
            'obj': 'application/octet-stream',
            'video': 'video/mp4',
            'application/zip': 'application/zip'
        }

        var filtertedAssets = this.state.assets.filter(asset => asset.filetype.includes(getFilter[type]))
        if (filtertedAssets.length === 0) {
            return (<List.Item>
                        <List.Content>
                            <List.Header>No {type} assets to show!</List.Header>
                        </List.Content>
                    </List.Item>)
        }
        return filtertedAssets.map((asset) => {
            var loaded = false
            if (this.props.loadedAssets.indexOf(asset._id) >= 0) {
                loaded = true
            }
            return (
                <Asset 
                    key={asset._id}
                    name={asset.name} 
                    socket={this.props.socket}
                    id={asset._id} 
                    loaded={loaded}
                    interviewId={this.props.interview}
                    icon={getIcon[type]}
                    updateInterviewCallback={this.props.updateInterviewCallback}
                    updateAssetsCallback={this.updateList}
                    assetList={this.props.assets}
                ></Asset>
            )
        })
    }

    render() {
        const css = ` 
        .AssetsList {
            overflow-y:auto;
            max-width: 100%;
            max-height: 250px;
            overflow-x: hidden;
        }
        ` 
        if (this.state.loading) {
            return (<div>
                <br />
                <br />
                <Dimmer active inverted>
                    <Loader> Loading assets </Loader>
                </Dimmer>
            </div>)
        }
        let popupContent = 'Upload an asset below. Clicking the slider will render the asset. Rendered assets are visible to the host and all participants.';
        
        return (
                <div>
                    <List divided className="AssetsList">
                    <Popup trigger={
                    <List.Header as='h4'>
                        <Icon  name='image outline' />
                        Images
                    </List.Header>
                    } content="Supported image formats are png and jpg." />
                    {this.renderAssets('image')}

                    <Popup trigger={
                    <List.Header as='h4'>
                        <Icon  name='box' />
                        Objects
                    </List.Header>
                    } content="The only supported mesh format is obj." />
                    {this.renderAssets('obj')}
                    {this.renderAssets('application/zip')}


                    <Popup trigger= {
                    <List.Header as='h4'>
                        <Icon  name='file video outline' />
                        Videos
                    </List.Header>
                    } content = "Supported video formats are MP4."/>
                    {this.renderAssets('video')}
                </List>
                {this.uploadBox()}
                <style>{css}</style>
                </div>      
        );              
    }
}

export default Assets;