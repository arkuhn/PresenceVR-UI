const registerEventHandlers = (socket, addMessage) => {
    socket.on('join', (data) =>{
        addMessage({
            type: 'system',
            content: 'User ' + data.user + ' has joined the room.'
        })
        console.log(data)
    })

    socket.on('leave', (data) =>{
        addMessage({
            type: 'system',
            content: 'User ' + data.user + ' has left the room.'
        })
        console.log(data)
    })

    socket.on('message', (data) =>{
        addMessage({
            type: 'user',
            content: data.content,
            author: data.author
        })
        console.log(data)
    })
}

module.exports = {registerEventHandlers}