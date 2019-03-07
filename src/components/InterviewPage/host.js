import React, { Component } from 'react';
import { Header, Icon, List } from 'semantic-ui-react';


class Host extends Component {

    render() {
        return (
            <div className="ParticipantsBox">
            <Header as='h3'>
                <Icon name='user plus' />
                Host
            </Header>
            <List>
            <List.Item>
                <Icon name='user plus' />
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