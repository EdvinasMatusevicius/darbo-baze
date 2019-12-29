const puppeteer = require('puppeteer');

const raktinioZodzioInputID = '#ctl00_MainArea_QuickSearchByLocalityControl_Keyword';
const ieskojimoBtnID = "#ctl00_MainArea_QuickSearchByLocalityControl_SearchBtn"

const darboBirza = (raktinisDarboBirza) => {
    return new Promise((resolve, reject) => {
        (async () => {
            try {
                const browser = await puppeteer.launch({headless:true});
                const page = await browser.newPage();
                page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36");
                
                await page.goto('http://www.ldb.lt/LDBPortal/Pages/ServicesForEmployees.aspx');
                await page.waitForSelector(raktinioZodzioInputID);
                await page.$eval(raktinioZodzioInputID,(el,raktinisDarboBirza) => el.value = raktinisDarboBirza,raktinisDarboBirza);
                const ieskojimoBtn = await page.$(ieskojimoBtnID);
                ieskojimoBtn.click();
                await page.waitForSelector('.GridHeader');
                const trs = await page.$$('.GridHeader ~ tr');
                for (const tr of trs){
                    const jobName = await tr.$eval('a', a=>a.innerText);
                    console.log(jobName);
                };



                await page.screenshot({ path: 'image.jpg', type: 'jpeg' });
                await page.close()
                await browser.close();
                console.log('darbo birza screenshoot');
                return resolve('darbo birza');
                



            } catch (error) {
                console.log(error);
            }
        })();
    }
    )
};
module.exports = {darboB: async(raktinisDarboBirza)=>{await darboBirza(raktinisDarboBirza)}};

// (async () => {
//     try {
//         const browser = await puppeteer.launch({ headless: true });
//         const page = await browser.newPage();
//         page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36");

//         await page.goto('https://chat-basic.herokuapp.com/');
//         await page.waitForSelector('#btnGuest');
//         const guestButton = await page.$('#btnGuest');
//         guestButton.click();
//         await page.waitForSelector('#message-input-field');
//         await page.focus('#message-input-field');
//         page.keyboard.type('puppetieer test2 jasdnandlaksdajnfjanflkamdslkafdaokdmlaks');

//         const sendButton = await page.$('#btn-send');

//         setTimeout(function(){ sendButton.click(); }, 1000);
//         setTimeout(function(){ browser.close(); }, 2000);
//         console.log('done');
//     } catch (error) {
//         console.log('pasitaike kalida. Klaidos kodos info: ', error)
//     }
// })();
