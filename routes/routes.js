const express = require('express');
const urlencodedParse = express.urlencoded({ extended: true });
const router = express.Router();
const puppet = require('../puppet/main-input');
const storage = require('../mongoDB/storage');



let numberOfSearches = 3;

router.get('/',function(req,res){
    res.render('index');
});

router.post('/paieska',urlencodedParse,function(req,res,next){
    let raktinisZ =req.body.raktinis;
    let miestas = req.body.miestas;
    numberOfSearches++
    const searchID = Date.now();
    // cvMarket(raktinisZ,miestas,searchID);
    (async ()=>{
       await puppet.paieska(raktinisZ,miestas,searchID).then(()=>{console.log('db pabaiga route dirctorijoj')});
       await storage.readAdList(searchID);
    })();
    
    //gal sita visa sudet i promisa  //arba duomenu parsiuntima is db atlikti main inpute
})
module.exports = router;