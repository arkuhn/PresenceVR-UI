import React, { Component } from 'react';
import { Header, Icon, List } from 'semantic-ui-react';


class Host extends Component {

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
                    <List.Description>
                        {this.props.host}
                    </List.Description>
                </List.Content>
            </List.Item>
            </List>
            </div>
        );
    }
}

export default Host;