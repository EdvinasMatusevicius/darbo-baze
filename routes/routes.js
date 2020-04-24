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
    const currentPage = Number(req.query.page);
    const adsInPage = Number(req.query.countperpage)||30;
    const webSite = req.query.site;//SELECT ADS FROM SITE. for later after UI

    (async ()=>{
        const allAds = await storage.readAdList(req.query.id);
        console.log(allAds);
        const pageCount=Math.ceil(allAds.length/adsInPage);

        const pageAds = ()=>{if(allAds.length>adsInPage){
            return allAds.slice((currentPage-1)*adsInPage,currentPage*adsInPage);
        }else{
            return allAds;
        }};
        res.render('results',{
            page:'results',
            results:pageAds(),
            pageCount:pageCount,
            currentPage:currentPage
        });
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
router.use((req, res, next) => {
    res.status(404).render(
        'not-found',{page:'not-found'}
    )
   })
module.exports = router;