const forTestTimeOut = require('./timeoutFunc');
const cvBankas = require('./websites_inputs/cv-bankas');
const cvMarket = require('./websites_inputs/cv-market');
const cv = require('./websites_inputs/cv');
const cvKodas = require('./websites_inputs/cv-kodas');
const sitesObj ={"cvBankas":cvBankas, "cvMarket":cvMarket, "cv":cv, "cvKodas":cvKodas};



const paieskosFn = (raktinis,miestas,id,sitesArr)=>{

    const ieskojamuPslBuilder = (sitesArr)=>{
        if(sitesArr){
        let newFnArr = [];
        sitesArr.forEach(site => {
            newFnArr.push(sitesObj[site](raktinis,miestas,id))
        });
        return newFnArr }else{
            // return [cvMarket(raktinis,miestas,id),cvBankas(raktinis,miestas,id),cv(raktinis,miestas,id),cvKodas(raktinis,miestas,id)]
            return [new Promise((resolve, reject) => { resolve('Klaida! Nepasirinkote ieskojimo puslapiu')})];
        }
    }
     return new Promise((resolve,reject)=>{
        Promise.all(ieskojamuPslBuilder(sitesArr)).then((result)=>{console.log(result); return resolve(result)}).catch((err)=>{console.log(err); reject()});
    })
}

module.exports = paieskosFn;