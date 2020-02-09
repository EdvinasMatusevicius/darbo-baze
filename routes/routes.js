const express = require('express');
const urlencodedParse = express.urlencoded({ extended: true });
const router = express.Router();
const puppet = require('../puppet/main-input');
const storage = require('../mongoDB/storage');

let numberOfSearches = 0;


router.get('/',function(req,res){
    res.render('index');
    //new sockets class?
});

router.post('/paieska',urlencodedParse,function(req,res,next){
    const raktinisZ =req.body.raktinis;
    const miestas = req.body.miestas;
    const pasirinktiPuslapiai = req.body.pasirinktiPuslapiai;
    const socketId = req.body.socket;
    console.log(raktinisZ);
    numberOfSearches++
    const searchID = Date.now();
    (async ()=>{
       await puppet(raktinisZ,miestas,searchID,pasirinktiPuslapiai,socketId).then((data)=>{console.log('db pabaiga route dirctorijoj',data)});
    //    await storage.readAdList(searchID);
    })();
})
module.exports = router;