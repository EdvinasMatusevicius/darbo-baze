const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adListShema = new Schema({
    searchID: Number,
    adList: Array
},{
    capped: 50000000 //bytes =50mb
});
const AdList = mongoose.model('jobs',adListShema);
module.exports= AdList;