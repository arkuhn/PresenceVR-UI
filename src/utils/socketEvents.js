const registerEventHandlers = (socket, addMessage, handlePolos) => {
    socket.on('join', (data) =>{
        addMessage({
            type: 'system',
            content: 'User ' + data.user + ' has joined the room.',
            color: 'green'
        })
        console.log(data)
    })

    socket.on('leave', (data) =>{
        addMessage({
            type: 'system',
            content: 'User ' + data.user + ' has left the room.',
            color: 'teal'
        })
        console.log(data)
    })

    socket.on('message', (data) =>{
        addMessage(data)
        console.log(data)
    })

    socket.on('Marco', (data) =>{
        socket.emit('Polo', {user: 'TESTING'})
        console.log(data)
    })

    socket.on('Polo', (data) =>{
        handlePolos(data.user)
        console.log(data)
    })
}

module.exports = {registerEventHandlers}