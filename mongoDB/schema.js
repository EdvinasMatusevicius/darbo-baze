const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adListShema = new Schema({
    searchID: Number,
    adList: Array
},{
    capped: 200000 //arba deti objecta su daugiau e
});
const AdList = mongoose.model('jobs',adListShema);
module.exports= AdList;