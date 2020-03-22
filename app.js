const express = require('express');
const routes = require('./routes/routes');
const mongoose = require('mongoose');
const mongoConnect = require('./mongoDB/connection');
const socket = require('./sockets/socket');

const AdListModel = require('./mongoDB/schema');


const app = express();

if(process.env.NODE_ENV !== 'prod'){
    require('dotenv').config();
}
const server = app.listen(process.env.PORT,console.log('server listening port ',process.env.PORT));
socket.socketInit(server);
mongoConnect(mongoose);
app.set('view engine','ejs')

app.use('/public',express.static(__dirname +'/assets'))
app.use('/',routes);

// 1584897108300.0

// async function testFind (id){
//     await AdListModel.find({ searchID: id }).lean().then(list => {
//         const allAds = list.reduce((finalList,websiteList)=>finalList.concat(websiteList.adList),[]);
//         return allAds;
//     }
//     );
    // AdListModel.countDocuments({ searchID: id }).exec((err, count) => {
    //     if (err) {
    //        console.log(err)
    //     }
    
    //    console.log({ count: count });
    // });
// }
// testFind(1584897108300.0);


