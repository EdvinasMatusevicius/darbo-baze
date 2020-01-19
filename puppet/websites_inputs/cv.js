const puppeteer = require('puppeteer');
const storage = require('../../mongoDB/storage');
const algosFn = async (ad)=>{
    try {
        const algosKiekis = await ad.$eval('[itemprop="baseSalary"]', alga => alga.innerText);
        const algosPeriodas = '-';
        const algosSkaiciavimas = '-';
        return { alga: algosKiekis, algosPeriodas: algosPeriodas, algosSkaiciavimas: algosSkaiciavimas };
    } catch (e) {
        return '-';
    }
}
const dataLoop =async (page,pageURL,pageNumb,adNumber,jobsArr)=>{
    if(pageNumb>1) await page.goto(pageURL+`&page=${pageNumb}`);
    await page.waitForSelector('#pagBottm');
    const adList = await page.$$('tbody.ng-scope tr');
    console.log(pageNumb, adList.length);
    for(let ad of adList){
       const jobName = await ad.$eval('td p a',link=>link.innerText);
       const alga = await algosFn(ad);
       console.log(jobName);
       console.log(alga);
    }
    // { alga: algosKiekis, algosPeriodas: algosPeriodas, algosSkaiciavimas: algosSkaiciavimas };
    // const darboInfo = {
    //     jobName: jobName, alga: alga, miestas: miestas, adGaliojimas: galiojimas, nuoroda: linkToAd, source: 'cv bankas'
    // };
   
}
const cv = (raktinisCv, miestas, id) => {
    return new Promise((resolve, reject) => {
        (async ()=>{
            let cityURL='empty';
            let adNumber = {adNumb:0}; //ad number is object and not primitive so that it would not be copied (only need a reference) so that its value could be changed in helper functions
            let jobsArr = [];
            miestas==='Visa Lietuva'?miestas='Visi miestai':'';
            try {
                const browser = await puppeteer.launch({ headless: false});
                const page = await browser.newPage();
                page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36");

                await page.goto('https://www.cv.lt');

                await page.waitForSelector('.w25pr');
                const searchBtn = await (await page.$$('.field-holder'))[2].$('.search-button'); //search btn pressed immediately so that city selection with url strings inside would be reached
                searchBtn.click();
                await page.waitForSelector('#resultsHead');
                const cityList = await page.$$('.popup-classificator.cities li');
                for(let city of cityList){
                   const cityText = await city.$eval('a',link=>link.innerText);
                    //checking for  match of website city and provided city name
                   if(cityText===miestas){
                      cityURL = await city.$eval('a',link=>link.getAttribute('href'));
                      console.log(`rado ${miestas}`);
                   }
                }
                if(cityURL==='empty'){ //if after for loop city match hasn't been found search is terminated
                    console.log('cv.lt neturi sio miesto pasirinkimo');   
                    resolve(`cv.lt neturi ${miestas} miesto pasirinkimo`)  
                    await page.close();
                    await browser.close();
                }
                const fullSearchURL = 'https://www.cv.lt'+cityURL+`&text=${raktinisCv}`;
                await page.goto(fullSearchURL);
                await page.waitForSelector('#pagBottm');
                  //LOOKS IF THERES NORESULTS CLASS IF IT DOESNT FIND IT IN 4s IT GOES TO GET AD DATA
                try {
                   await page.waitForSelector('noresults',{timeout: 4000});
                   console.log('cv.lt nerado rezultatu');   
                   resolve('cv.lt nerado rezultatu')  
                   await page.close();
                   await browser.close();
                   
               } catch (e) {
                const puslapiuSkaicius = (await page.$eval('.paging-top',el=>el.innerText)).split(' ')[2];
                
                for (let i = 1; i <= puslapiuSkaicius; i++) {
                  await dataLoop(page,fullSearchURL,i,adNumber,jobsArr);
                    
                }
                resolve('end')
                // await page.close();
                // await browser.close();
               }
            } catch (error) {
                console.log(error)
            };
        })()
    })
}
module.exports = cv;