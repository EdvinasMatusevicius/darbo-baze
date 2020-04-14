const socket = io.connect('http://localhost:3000/');
let userSocket;

socket.on('handshake', (data) => {
    console.log('handshake', data);
    userSocket = data;

    socket.on('cvkodas',(data)=>{
        const site = document.querySelector('.cvKodas');
        site.innerHTML=data;
    })
    socket.on('cvbankas',(data)=>{
        const site = document.querySelector('.cvBankas');
        site.innerHTML=data;
    })
    socket.on('cvmarket',(data)=>{
        const site = document.querySelector('.cvMarket');
        site.innerHTML=data;
    })
    socket.on('cv',(data)=>{
        const site = document.querySelector('.cv');
        site.innerHTML=data;
    })
});
