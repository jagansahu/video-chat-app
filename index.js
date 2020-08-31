const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { v4: uuidv4 } = require('uuid'); //this package allows random IDs to be created

// View Engine Setup 
app.set('view engine', 'ejs') 
app.use(express.static(__dirname + "/client"));

app.get('/', (req, res) => {
    res.redirect(`/${ uuidv4() }`);
})

app.get('/:roomId', (req, res) => {
    res.render('home', { roomId: req.params.roomId });
});

io.on('connection', socket => {
    socket.on('inRoom', (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-joined', userId);

        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('user-left', userId);
        })
    })
}); 

server.listen(3000, () => {
    console.log(`go to http://localhost:3000`)
})


