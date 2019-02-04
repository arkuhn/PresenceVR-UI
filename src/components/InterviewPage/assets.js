import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';
import 'filepond/dist/filepond.min.css';
import React, { Component } from 'react';
import { registerPlugin } from 'react-filepond';
import { Button, Checkbox, Dimmer, Header, Icon, List, Loader, Segment } from 'semantic-ui-react';
import InterviewAPI from '../../utils/InterviewAPI';
import UploadAPI from '../../utils/UploadAPI';

registerPlugin(FilePondPluginImagePreview);

class Asset extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isRendered: false
        };
    }

    renderAsset = (event) => {
        this.setState(state => ({isRendered: !state.isRendered}));
        InterviewAPI.updateAssetList(this.props.id, this.props.interview).then((response) => {
            this.props.updateInterviewCallback();
        });
    }

    deleteAsset = () => {
        UploadAPI.deleteUpload(this.props.id).then((response) => {
            this.props.updateAssetsCallback()
        });
    }

    deleteAsset = () => {
        UploadAPI.deleteUpload(this.props.id).then((response) => {
            this.props.updateAssetsCallback()
        });
    }

    render() {
        return (
            <List.Item active={false} >
                <List.Content floated='right'>
                    <Icon corner color='red' name='trash alternate outline' link onClick={this.deleteAsset} aria-hidden='Delete' />
                </List.Content>
                <List.Content floated='left'>
                    <Icon name={this.props.icon} />
                    <b>{this.props.name}</b> <br />
                    {this.props.owner}
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
    renderAssets = () => {
        if (this.state.loading) {
            return (<div>
                <br />
                <br />
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
            var loaded = false
            if (this.props.loadedAssets.indexOf(asset._id) >= 0) {
                loaded = true
            }
            return (
                <Asset 
                    key={asset._id}
                    name={asset.name} 
                    owner={asset.owner}
                    id={asset._id} 
                    loaded={loaded}
                    interview={interview}
                    icon='boxes'
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
                    {this.renderAssets()}
                </List>
                {this.uploadBox()}
                <style>{css}</style>
            </div>
        );
    }
}

export default Assets;