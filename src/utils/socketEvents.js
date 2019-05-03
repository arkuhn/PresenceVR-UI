
/*
Constant method for registering all sockets and callbacks for socket events received from the server.
*/
const registerEventHandlers = (socket, addMessage, handleParticipantStatusChange, getCurrentUser, getUserStatus, updateInterview) => {

    /*
    When a participant enters the interview, the server emits a join event with their username.
    */
    socket.on('join', (data) =>{

        // Display the joined message in the chat.
        addMessage({
            type: 'system',
            content: 'User ' + data.user + ' has joined the room.',
            color: 'green'
        });

        // Update the participants status on the interview page.
        handleParticipantStatusChange({
            user: data.user,
            status: 1  // TODO: Standardize this to mean online
        });
        console.log(data);
    });

    /*
    When a participant leaves (ie. returns to homepage or closes the browser) the interview, the server emits a leave event with their username.
    */
    socket.on('leave', (data) =>{

        // Display the leave message in the chat.
        addMessage({
            type: 'system',
            content: 'User ' + data.user + ' has left the room.',
            color: 'teal'
        });

        // Update the participants status on the interview page.
        handleParticipantStatusChange({
            user: data.user,
            status: 0  // TODO: Standardize this to mean offline
        });
        console.log(data);
    });

    /*
    When a participant sends a chat message, the server broadcasts it to all the users.
    */
    socket.on('message', (data) =>{
        // Display the message
        addMessage(data);
    });

    /*
    If the interview object is modified on the server, this event tells all the clients to re-request the interview.
    */
    socket.on('updateInterview', () => {
        updateInterview()
    })

    /*
    When a Marco event is received from the server, it contains the user that sent it and their status.
    This user is then expecting all online participants to respond with a Polo event containing their status.
    */
    socket.on('Marco', (data) =>{
        data.status = getUserStatus();
        data.user = getCurrentUser();
        socket.emit('Polo', data);
    });

    /*
    When a Polo event is received from the server, the data will contain a participant in their status.
    This is passed to the handleParticipantsStatusChange callback to update the status.
    */
    socket.on('Polo', (data) =>{
        handleParticipantStatusChange(data);
    });
}

module.exports = {registerEventHandlers}