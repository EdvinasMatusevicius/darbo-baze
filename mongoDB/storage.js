const AdListModel = require('./schema');

const adList = {
    addAdList: async (adArr,id)=>{
        const adList = new AdListModel({
            searchID: id,
            adList: adArr
        })
        await adList.save();
        console.log('suveike saugojimas su schema');
    },
    readAdList: async(id)=>{
        const adList =  await AdListModel.find({searchID:id}).lean().then(list=>{for(ad of list){
            console.log(ad.adList);
        }});
        
    }
    
} 

module.exports = adList;