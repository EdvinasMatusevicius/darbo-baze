const puppeteer = require('puppeteer');
const storage = require('../../mongoDB/storage');

const cvKodas = (raktinisCvKodas,miestas,id)=>{
    return new Promise(async(resolve,reject)=>{
        let miestoNumVal = 'empty';
        try {
            const browser = await puppeteer.launch({ headless: false });
            const page = await browser.newPage();
            page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36");

            await page.goto('https://www.cvkodas.lt');
            await page.waitForSelector('.search-col');
            await page.$eval('#filter_keyword',(input,raktinisZodis)=>input.value = raktinisZodis,raktinisCvKodas);
            const miestuList = await page.$$('#f1-select option')
            for(const miestoNode of miestuList){
                const miestoNodeInner = await (await miestoNode.getProperty('innerText')).jsonValue();
                if(miestas===miestoNodeInner){
                    miestoNumVal = await (await miestoNode.getProperty('value')).jsonValue();
                }
            }
            if(miestoNumVal === 'empty'){
                await page.close();
                await browser.close();
                console.log('cv kodas neturi sio miesto pasirinkimo');
                resolve(`cv kodas neturi ${miestas} miesto pasirinkimo`)
            }
            await page.select('select#f1-select',miestoNumVal);
            const searchBtn = await page.$('.search-button');
            searchBtn.click();
            //ar rasta skelbimu pagal specifikacijas
            try {
                await page.waitForSelector('.job-item',{timeout: 4000});
                console.log('rezultatu rasta')
            } catch (error) {
                console.log('rezultatu nerasta')
                
            }
        } catch (error) {
            console.log(error)
        }
    })
}
module.exports = cvKodas