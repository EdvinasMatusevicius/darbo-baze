const forTestTimeOut = require('./timeoutFunc');
const cvBankas = require('./websites_inputs/cv-bankas');
const cvMarket = require('./websites_inputs/cv-market');
const cv = require('./websites_inputs/cv');
const cvKodas = require('./websites_inputs/cv-kodas')

const paieskosFn = (raktinis,miestas,id)=>{
    return new Promise((resolve,reject)=>{

        Promise.all([cvMarket(raktinis,miestas,id),cvBankas(raktinis,miestas,id),cv(raktinis,miestas,id),cvKodas(raktinis,miestas,id)]).then((result)=>{console.log(result); return resolve(result)}).catch((err)=>{console.log(err)});
        // cvBankas.cvBankas(raktinis,id).then(()=>{return resolve('cvB-tipo data perduota resolve viduj')});
        
    })
}

module.exports = paieskosFn;