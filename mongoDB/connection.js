const connectMongoDB = (mongoose)=>{
    if (process.env.NODE_ENV !== 'production') {
        const dotenv = require('dotenv');
        dotenv.config();
    };
    if(process.env.NODE_ENV === 'dev'){
        console.log('mongo connection about to start');
    mongoose.connect('mongodb://localhost/users', { useNewUrlParser: true, useUnifiedTopology: true });
    }else if (process.env.NODE_ENV === 'production'){
        mongoose.connect(process.env.MONGO_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true });
    }
    mongoose.connection.once('open',()=>{
        console.log('mongo connection has been made');
    })
};
module.exports = connectMongoDB;