const registerEventHandlers = (socket, addMessage, handleParticipantStatusChange, getUserStatus) => {
    socket.on('join', (data) =>{
        addMessage({
            type: 'system',
            content: 'User ' + data.user + ' has joined the room.',
            color: 'green'
        })
        handleParticipantStatusChange({
            caller: data.user,
            status: 1  // TODO: Standardize this to mean offline
        });
        console.log(data)
    })

    socket.on('leave', (data) =>{
        addMessage({
            type: 'system',
            content: 'User ' + data.user + ' has left the room.',
            color: 'teal'
        })
        handleParticipantStatusChange({
            caller: data.user,
            status: 0  // TODO: Standardize this to mean offline
        });
        console.log(data)
    })

    socket.on('message', (data) =>{
        addMessage(data)
        console.log(data)
    })

    socket.on('Marco', (data) =>{
        data.status = getUserStatus();
        socket.emit('Polo', data)
        console.log(data)
    })

    socket.on('Polo', (data) =>{
        handleParticipantStatusChange(data)
        console.log(data)
    })
}

module.exports = {registerEventHandlers}