const socket = io.connect('http://localhost:3000/');
let userSocket;

socket.on('handshake', (data) => {
    console.log('handshake', data);
    userSocket = data;

    socket.on('cvkodas',(data)=>{
        console.log(data)
    })
    socket.on('cvbankas',(data)=>{
        console.log(data)
    })
    socket.on('cvmarket',(data)=>{
        console.log(data)
    })
    socket.on('cvlt',(data)=>{
        console.log(data)
    })
});
