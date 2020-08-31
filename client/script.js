//client side
const grid = document.getElementById('container');
const socket = io();
const peer = new Peer(undefined, {
    host: '/',
    port: '3001'
});

const showVid = document.createElement('video');
showVid.muted = true;
const peers = {};

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    addStream(showVid, stream);
    peer.on('call', call => {
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream', userVideoStream => {
            addStream(video, userVideoStream); 
        })
    })
    socket.on('user-joined', userId => {
        connectToNewUser(userId, stream)
    });
})

socket.on('user-left', userId => {
    if (peers[userId]) {
        peers[userId].close();
    }
});

peer.on('open', id => {
    socket.emit('inRoom', roomId, id)
});

function connectToNewUser(userId, stream) {
     const call = peer.call(userId, stream);
     const video = document.createElement('video');
     call.on('stream', userVideoStream => {
         addStream(userVideoStream);
     })
     call.on('close', () => {
         video.remove();
     })
     peers[userId] = call;
}

function addStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    });
    grid.append(video);
}