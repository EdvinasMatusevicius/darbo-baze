const express = require('express');
const urlencodedParse = express.urlencoded({ extended: true });
const router = express.Router();
const puppet = require('../puppet/main-input');
const storage = require('../mongoDB/storage');

let numberOfSearches = 0;


router.get('/',function(req,res){
    res.render('index',{page:'index'});
    //new sockets class?
});
router.get('/results',function(req,res){
    const curentPage = req.query.page;
    const adsInPage = 15;
    (async ()=>{
        const allAds = await storage.readAdList(req.query.id);
        const pageAds = ()=>{if(allAds.length>adsInPage){
            return allAds.slice((curentPage-1)*adsInPage,curentPage*adsInPage);
        }else{
            return allAds;
        }};
        res.render('results',{page:'results',results:pageAds()});
     })()

})
router.post('/paieska',urlencodedParse,function(req,res,next){
    const raktinisZ =req.body.raktinis;
    const miestas = req.body.miestas;
    const pasirinktiPuslapiai = req.body.pasirinktiPuslapiai;
    const socketId = req.body.socket;
    console.log(raktinisZ);
    numberOfSearches++
    const searchID = Date.now()+`${numberOfSearches}`;
    (async ()=>{
       await puppet(raktinisZ,miestas,searchID,pasirinktiPuslapiai,socketId).then((data)=>{console.log('db pabaiga route dirctorijoj',data)});
      res.send(searchID);
    })();
})
module.exports = router;