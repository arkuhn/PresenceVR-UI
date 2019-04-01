import React, { Component } from 'react';
import { Header, Icon, List } from 'semantic-ui-react';


class Host extends Component {

    getStatus = () => {

        // TODO: Standardize statuses into a central util
        const statuses = [
            <span>&#160;Offline <Icon color='red' size='small' name='circle thin' /></span>,
            <span>&#160;Online <Icon color='green' size='small' name='circle thin' /></span>
            ];

        let status = this.props.participantStatuses[this.props.host] ? this.props.participantStatuses[this.props.host] : 0;
        return statuses[status];
    }

    render() {
        return (
            <div className="ParticipantsBox">
            <Header as='h3'>
                <Icon circular name='chess queen' />
                Host
            </Header>
            <List>
            <List.Item>
                <Icon name='chess queen' />
                <List.Content>
                    <List.Header>{this.props.host}</List.Header>
                    <List.Description>
                    Status: {this.getStatus()}
                    </List.Description>
                </List.Content>
            </List.Item>
            </List>
            </div>
        );
    }
}

export default Host;