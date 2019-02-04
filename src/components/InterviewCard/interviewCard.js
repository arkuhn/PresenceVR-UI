import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Divider, Image, List } from 'semantic-ui-react';
import CancelInterview from './cancelInterview';
import InterviewForm from './InterviewForm';
import LeaveInterview from './leaveInterview';

class InterviewCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id
        }

        this.hostCard = this.hostCard.bind(this);
        this.participantCard = this.participantCard.bind(this);
        this.populateParticipantList = this.populateParticipantList.bind(this);
    }

    populateParticipantList() {
        if ((this.props.participants).length === 0) {
            return (
                <List.Item>
                    No participants added!
                </List.Item>
            )
        }
        return this.props.participants.map((participant, index) => {
            return (
                <List.Item key={index}>
                {participant}    
                </List.Item>
            )
        })
    }

    hostCard() {
        return (
        <Card color='teal' centered>
            <Card.Content textAlign='left'>
                <Image floated='right' size='mini' src={this.props.image} />
                <Card.Header> {this.props.date} : {this.props.time} </Card.Header>
                <Card.Meta>{this.props.details}</Card.Meta>
                <Card.Description>
                <List bulleted>
                    {this.populateParticipantList()}
                </List>
                </Card.Description>
                <Divider />
                <Card.Content extra>
                    <div className='ui three buttons'>
                        <Button as={Link} to={"/interview/" + this.state.id} basic color='green'>
                            Join
                        </Button>

                        <InterviewForm updateInterviewListCallback={this.props.updateInterviewListCallback} type='edit' id={this.props.id} participants={this.props.participants} date={this.props.date} time={this.props.time} details={this.props.details} />

                        <CancelInterview updateInterviewListCallback={this.props.updateInterviewListCallback} id={this.props.id} />
                    </div>
                </Card.Content>
            </Card.Content>
        </Card>
        )
    }

    participantCard() {
        return (
            <Card centered>
                <Card.Content textAlign='left'>
                    <Card.Header> {this.props.date} : {this.props.time} </Card.Header>
                    <Card.Meta>{this.props.details}</Card.Meta>
                    <Card.Description>
                        <List bulleted>
                            {this.populateParticipantList()}
                        </List>
                    </Card.Description>
                    <Divider />
                    <Card.Content extra>
                        <div className='ui three buttons'>
                            <Button as={Link} to={"/interview/" + this.state.id} basic color='green'>
                                Join
                            </Button>

                            <LeaveInterview id={this.props.id} />
                        </div>
                    </Card.Content>
                </Card.Content>
            </Card>
        )
    }

    render() {
        if (this.props.host) {
            return this.hostCard()
        }
        return this.participantCard()
    }
}

export default InterviewCard;