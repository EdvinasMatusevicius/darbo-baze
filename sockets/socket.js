const socketIo = require('socket.io');


class SocketData{
    constructor(){
        ///perasyti socket data i clase su this.userSocket ir getUserSocket Metodu kuriu galima butu gauti socket perpanaudojimui kitose folderiuose
    }
}
const socketData = new SocketData();
module.exports = socketData;
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
// ,userSocket:userSocket