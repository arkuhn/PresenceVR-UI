import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Divider, Image, List } from 'semantic-ui-react';
import CancelInterview from './cancelInterview';
import InterviewForm from './InterviewForm';
import LeaveInterview from './leaveInterview';
import './interviewCard.css'

class InterviewCard extends Component {


    render() {
        let color = 'grey'
        let raised = false
        if (this.props.active) {
            color = 'teal'
            raised = true
        }

        return (<Card fluid color={color} raised={raised} className="interviewCard" centered>
                <Card.Content textAlign='left'>
                    <Card.Header> {this.props.details} </Card.Header>
                    <Card.Meta> {this.props.date} : {this.props.time} </Card.Meta>
                </Card.Content>
            </Card>)
    }
}

export default InterviewCard;