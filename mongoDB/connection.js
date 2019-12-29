const AdListModel = require('./schema');
const connectMongoDB = (mongoose)=>{
    if (process.env.NODE_ENV !== 'prod') {
        const dotenv = require('dotenv');
        dotenv.config({
            path: './.env'
        });
    };
    if(process.env.NODE_ENV === 'dev'){
        console.log('mongo connection about to start');
    mongoose.connect('mongodb://localhost/users', { useNewUrlParser: true, useUnifiedTopology: true });
    }else if (process.env.NODE_ENV === 'prod'){
        // connect to online db
    }
    mongoose.connection.once('open',()=>{
        console.log('mongo connection has been made');
    })
};
module.exports = connectMongoDB;