const express = require('express');
const routes = require('./routes/routes');
const mongoose = require('mongoose');
const mongoConnect = require('./mongoDB/connection');
const socket = require('./sockets/socket');


const app = express();

if(process.env.NODE_ENV !== 'prod'){
    require('dotenv').config();
}
const server = app.listen(process.env.PORT,console.log('server listening port ',process.env.PORT));
mongoConnect(mongoose);
app.set('view engine','ejs')

app.use('/public',express.static(__dirname +'/assets'))
app.use('/',routes)
// const userSocket = socket.socketInit(server);
// if(userSocket.id){
//     console.log(userSocket.id)
// }



