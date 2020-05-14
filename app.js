const express = require('express');
const routes = require('./routes/routes');
const mongoose = require('mongoose');
const mongoConnect = require('./mongoDB/connection');
const socket = require('./sockets/socket');


const app = express();

if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}
const server = app.listen(process.env.PORT,console.log('server listening port ',process.env.PORT));
socket.socketInit(server);
mongoConnect(mongoose);
app.set('view engine','ejs')

app.use(process.env.ASSETS_NICK,express.static(__dirname +'/assets'))
app.use('/',routes);

// Pora galimu variantu isplesti galimu chromo paiesku kieki
// process.setMaxListeners(0);
// require('events').EventEmitter.defaultMaxListeners = 15;
// require('events').defaultMaxListeners = 15;

