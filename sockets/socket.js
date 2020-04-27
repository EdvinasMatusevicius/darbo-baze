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

