const AdListModel = require('./schema');

const adList = {
    addAdList: async (adArr, id) => {
        const adList = new AdListModel({
            searchID: id,
            adList: adArr
        })
        await adList.save();
        console.log('suveike saugojimas su schema');
    },

//perdaryti paginating funkcija gaunancia id, current page, ad limit per page
    readAdList: async (id) => {
        return await AdListModel.find({ searchID: id }).lean().then(list => {
            const allAds = list.reduce((finalList,websiteList)=>finalList.concat(websiteList.adList),[]);
            return allAds;
        }
        );
        // AdListModel.countDocuments({ searchID: id }).exec((err, count) => {
        //     if (err) {
        //        console.log(err)
        //     }
        
        //    console.log({ count: count });
        // });
    }

}

module.exports = adList;