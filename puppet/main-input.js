const forTestTimeOut = require('./timeoutFunc');
const cvBankas = require('./websites_inputs/cv-bankas');

const paieskosFn = (raktinis,miestas,id)=>{
    return new Promise((resolve,reject)=>{
        Promise.all([forTestTimeOut.time(10000),cvBankas.cvBankas(raktinis,miestas,id)]).then((result)=>{return resolve(result)}).catch((err)=>{console.log(err)});
        // cvBankas.cvBankas(raktinis,id).then(()=>{return resolve('cvB-tipo data perduota resolve viduj')});
        
    })
}

module.exports = {paieska: async(raktinis,miestas,id)=>{await paieskosFn(raktinis,miestas,id)}};