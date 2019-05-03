const registerEventHandlers = (socket, addMessage, handleParticipantStatusChange, getCurrentUser, getUserStatus, updateInterview) => {
    socket.on('join', (data) =>{
        addMessage({
            type: 'system',
            content: 'User ' + data.user + ' has joined the room.',
            color: 'green'
        });
        handleParticipantStatusChange({
            user: data.user,
            status: 1  // TODO: Standardize this to mean online
        });
        console.log(data);
    });

    socket.on('leave', (data) =>{
        addMessage({
            type: 'system',
            content: 'User ' + data.user + ' has left the room.',
            color: 'teal'
        });
        handleParticipantStatusChange({
            user: data.user,
            status: 0  // TODO: Standardize this to mean offline
        });
        console.log(data);
    });

    socket.on('message', (data) =>{
        addMessage(data);
    });

    socket.on('updateInterview', () => {
        updateInterview()
    })

    socket.on('Marco', (data) =>{
        data.status = getUserStatus();
        data.user = getCurrentUser();
        socket.emit('Polo', data);
    });

    socket.on('Polo', (data) =>{
        handleParticipantStatusChange(data);
    });
}

module.exports = {registerEventHandlers}