const forTestTimeOut = require('./timeoutFunc');
const cvBankas = require('./websites_inputs/cv-bankas');
const cvMarket = require('./websites_inputs/cv-market')

const paieskosFn = (raktinis,miestas,id)=>{
    return new Promise((resolve,reject)=>{
        Promise.all([cvMarket(raktinis,miestas,id),cvBankas.cvBankas(raktinis,miestas,id)]).then((result)=>{return resolve(result)}).catch((err)=>{console.log(err)});
        // cvBankas.cvBankas(raktinis,id).then(()=>{return resolve('cvB-tipo data perduota resolve viduj')});
        
    })
}

module.exports = {paieska: async(raktinis,miestas,id)=>{await paieskosFn(raktinis,miestas,id)}};