const socketIo = require('socket.io');


class SocketData {
    constructor() {
        this.io;
    }
    socketInit(server) {
            this.io = socketIo(server);
            this.io.on('connection',this.onConnect);
       
    }
    onConnect(socket){
        console.log('io connected with id ' + socket.id);
        socket.emit('handshake',socket.id);
    }
    getIo(){
        return this.io;
    }
}
const socketData = new SocketData();
module.exports = socketData;








// class SocketData {
//     constructor() {
//         this.userSocket = 'class var';
//         this.io;
//         ///perasyti socket data i clase su this.userSocket ir getUserSocket Metodu kuriu galima butu gauti socket perpanaudojimui kitose folderiuose
//     }
//     socketInit(server) {
       
//             const io = socketIo(server);
//             this.io = io;
//             io.on('connection', function (socket) {
//                 new Promise((resolve, reject) => {
//                 console.log('io connected with id ' + socket.id)
//                 socket.emit('test2','isiusta is socketInit');
//                  resolve(socket);
//                 }).then((data)=>{this.userSocket=data;});
//             })
       
//     }
//     getUserSocket(){
//         console.log('is get user socket vidaus', this.userSocket.id);
//         return this.userSocket;
//     }
// }
// const socketData = new SocketData();
// module.exports = socketData;







//---------------------------
// class SocketData{
//     constructor(){
//         this.userSocket = 'class var';
//         ///perasyti socket data i clase su this.userSocket ir getUserSocket Metodu kuriu galima butu gauti socket perpanaudojimui kitose folderiuose
//     }
//     socketInit(server){
//         const io = socketIo(server);
//         io.on('connection', function (socket) {
//             console.log(this.userSocket)
//             this.userSocket=socket;
//         })
//     }
//     getUserSocket(){
//         return this.userSocket
//     }
// }
// const socketData = new SocketData();
// module.exports = socketData;


//------------------------
// const socketData = {
//     socketInit: (server)=> {
//         const io = socketIo(server);
//         return io.on('connection', function (socket) {
//             console.log('io connected with id ' + socket.id)

//             //socket listeners
//             socket.on('search', function (data) {
//                     io.sockets.emit('search', data);
//             });
//             // returning user socket to be used as variable in other modules
//             return socket;
//         })
//     }
// }
// module.exports = socketData;