import React, { Component } from 'react';
import { Checkbox, Container, Dimmer, Icon, Input, List, Loader, Popup, Segment } from 'semantic-ui-react';
import InterviewAPI from '../../../utils/InterviewAPI';
import UploadAPI from '../../../utils/UploadAPI';

/**
 * Class for single asset
 */
class Asset extends Component {
    renderAsset = () => {
        //variable for slider checkbox
        var op;
        //keep track of state; if loaded, checkbox trigger will remove asset from AFrame
        if (this.props.loaded) {
            op = 'remove';
        //if not loaded, checkbox trigger will draw asset in AFrame
        } else {
            op = 'add';
        }
        
        //keep track of asset status in interview object
        InterviewAPI.patchInterview(this.props.interviewId, 'loadedAssets', this.props.id, op).then((response) => {
            //update all clients with new asset state
            this.props.socket.emit('update');
        });
    }

    /**
     * Handler for deleting asset
     */
    deleteAsset = () => {
        //Calls uploadAPI and gives it id of asset to delete
        UploadAPI.deleteUpload(this.props.id).then((response) => {
            this.props.updateAssetsCallback();
        });
    }

    /**
     * Renders single asset list item
     */
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

/**
 * Class for asset list
 * Utilizes asset class found above
 */
class Assets extends Component {
    constructor(props) {
        super(props)
        this.state = {
            assets: [],
            uploadedFile: '',
            loading: false
        }
    }

    /**
     * Handler for updating list of assets
     */
    updateList = () => {
        //shows loading icon while app is processing request
        this.setState({ loading: true });
        //Calls the upload API
        UploadAPI.getUploads().then((uploads) => {
            //checks for uploads and sets the state with the upload list
            if (uploads && uploads.data) {
                this.setState({ assets: uploads.data.filter(upload => upload.type === 'asset'), loading: false });
            }
            //if no list, set the state to no list
            else {
                this.setState({ assets: [], loading: false });
            }
        });
    }

    /**
     * Handler for mounting this component
     */
    componentDidMount = () => {
        this.updateList();
    }

    /**
     * Change Handler
     */
    onChange = (e) => {
        switch (e.target.name) {
            case 'uploadedFile':
                this.setState({ uploadedFile: e.target.files[0] });
                break;
            default:
                this.setState({ [e.target.name]: e.target.value });
        }
    }

    /**
     * Handler for uploading an asset
     */
    onSubmit = (e) => {
        e.preventDefault();
        let formData = new FormData();
        //sanity check; is there actually an uploaded file?
        if (!this.state.uploadedFile) {
            return
        }
        //adds new file to formData
        formData.append('uploadedFile', this.state.uploadedFile);
        //Show loading symbol
        this.setState({ loading: true });
        //Call UploadAPI
        UploadAPI.uploadFile(formData, 'asset').then((response) => {
            this.updateList();
        });
    }

    /**
     * Formatting for upload section
     * This is the section where you actually upload a file
     */
    uploadBox = () => {
        return (
                    <Input
                        fluid
                        action={{ icon: 'upload', onClick: this.onSubmit }}
                        type="file"
                        name="uploadedFile"
                        onChange={this.onChange}
                        />
        );
    }

    /**
     * Renders asset list
     * Type corresponds to filetype
     * image, obj, or mp4
     * TODO: add more filetypes
     */
    renderAssets = (type) => {
        var getIcon = {
            'image': 'image outline',
            'obj': 'box',
            'video': 'video'
        };

        //filter for assets, this utilizes mimetypes
        //TODO: make a better filter, for instance .flv has the same mimetype as .obj
        var getFilter = {
            'image': 'image',
            'obj': 'application/octet-stream',
            'video': 'video/mp4',
        };

        var getTitle = {
            'image': 'Images',
            'obj': 'Object',
            'video': 'Videos'
        };

        //TODO: change as more file types are supported
        var getContent = {
            'image': "Supported image formats are png and jpg.",
            'obj': "The only supported mesh format is obj.",
            'video': "Supported video formats are MP4."
        };

        //filters asset based on file type
        var filtertedAssets = this.state.assets.filter(asset => asset.filetype.includes(getFilter[type]))
        if (filtertedAssets.length === 0) {
            return '';
        }
        //mapping function for iterating through each asset in the list
        let assetsjsx = filtertedAssets.map((asset) => {
            var loaded = false;
            if (this.props.loadedAssets.indexOf(asset._id) >= 0) {
                loaded = true;
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
            );
        })
        //return the list we just iterated over
        return  <List divided>
                <Popup trigger={
                    
                    <List.Header as='h4'>
                        <Icon  name={getIcon[type]} />
                        {getTitle[type]}
                    </List.Header>
                    } content={getContent[type]} />
                    {assetsjsx}
                    </List>
    }

    /**
     * Renders Assets section
     */
    render() {
        const css = ` 
        .AssetsList {
            overflow-y:auto;
            max-width: 100%;
            max-height: 250px;
            overflow-x: hidden;
        }
        ` 
        //checks for loading trigger
        if (this.state.loading) {
            return (<div>
                <br />
                <br />
                <Dimmer active inverted>
                    <Loader> Loading assets </Loader>
                </Dimmer>
            </div>);
        }
        let popupContent = 'Upload an asset below. Clicking the slider will render the asset. Rendered assets are visible to the host and all participants.';
        //vars for storing lists of different types of assets
        let images = this.renderAssets('image');
        let objects =  this.renderAssets('obj');
        let videos = this.renderAssets('video');

        let empty = '';
        //if all lists are empty, show a starter message
        if (this.state.assets.length === 0) {
            empty = <Segment>
                        Upload a JPG, PNG, OBJ or MP4 to get Started!
                    </Segment>
        }


        return (
                <Container style={{maxHeight: '30vh', overflowY: 'auto'}} className="assetsList" textAlign='center'>
                                        
                    {images}

                    {objects}

                    {videos}

                    {empty}

                {this.uploadBox()}
            </Container>
        );              
    }
}

export default Assets;