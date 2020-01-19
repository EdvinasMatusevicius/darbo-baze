const express = require('express');
const urlencodedParse = express.urlencoded({ extended: true });
const router = express.Router();
const puppet = require('../puppet/main-input');
const storage = require('../mongoDB/storage');

// cv test
const cv = require('../puppet/websites_inputs/cv')



let numberOfSearches = 0;

router.get('/',function(req,res){
    res.render('index');
});

router.post('/paieska',urlencodedParse,function(req,res,next){
    let raktinisZ =req.body.raktinis;
    let miestas = req.body.miestas;
    console.log(raktinisZ);
    numberOfSearches++
    const searchID = Date.now();
    // cvMarket(raktinisZ,miestas,searchID);
    (async ()=>{
            await cv(raktinisZ,miestas);
    //    await puppet(raktinisZ,miestas,searchID).then((data)=>{console.log('db pabaiga route dirctorijoj',data)});
    //    await storage.readAdList(searchID);
    })();
    
    //gal sita visa sudet i promisa  //arba duomenu parsiuntima is db atlikti main inpute
})
module.exports = router;