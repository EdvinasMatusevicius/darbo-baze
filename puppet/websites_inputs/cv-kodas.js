const puppeteer = require('puppeteer');
const storage = require('../../mongoDB/storage');
const socket = require('../../sockets/socket');

const dataLoop = async (page, pirmasPaieskosPsl, puslapioNum, jobArr, adNumber) => {
    if (puslapioNum > 1) {
        await page.goto(pirmasPaieskosPsl + '&page=' + puslapioNum)
        await page.waitForSelector('.search-col');
    }
    const adList = await page.$$('.job-item');
    adNumber.adNumb += adList.length;
    for (const ad of adList) {
        const algaFn = async () => {
            try {
                const algosInnerTextArr = (await ad.$eval('.item-salary', salaryNode => salaryNode.innerText)).split(" ");
                const algosKiekis = await algosInnerTextArr.slice(0, -1).join(" ");
                const algosPeriodas = await algosInnerTextArr.slice(algosInnerTextArr.length - 1).join(" ");
                const algosSkaiciavimas = '-'
                return { alga: algosKiekis, algosPeriodas: algosPeriodas, algosSkaiciavimas: algosSkaiciavimas };
            } catch (e) {
                return '-';
            }
        }
        const jobName = await ad.$eval('.col3 h3', nameNode => nameNode.innerText);
        const alga = await algaFn();
        const miestas = await ad.$eval('.item-city', miestoNode => miestoNode.innerText);
        const galiojimas = await ad.$eval('.item-service', galiojimoNode => galiojimoNode.innerText);
        const linkToAd = 'https://cvkodas.lt' + await ad.$eval('.filter-link', linkNode => linkNode.getAttribute('href'));

        const darboInfo = {
            jobName: jobName, alga: alga, miestas: miestas, adGaliojimas: galiojimas, nuoroda: linkToAd, source: 'cv kodas'
        }
        jobArr.push(darboInfo);
    }
}

const cvKodas = (raktinisCvKodas, miestas, id, socketId) => {
    return new Promise(async (resolve, reject) => {
        let miestoNumVal = 'empty';
        let jobsArr = [];
        let pirmasPaieskosPsl;
        let puslapiuSkaicius;
        let pagingContainer;
        let adNumber = { adNumb: 0 };//number of ads found. adNumb gets added to on every dataLoop
        try {
            const browser = await puppeteer.launch({ headless: true });
            const page = await browser.newPage();
            page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36");

            await page.goto('https://www.cvkodas.lt');
            await page.waitForSelector('.search-col');
            await page.$eval('#filter_keyword', (input, raktinisZodis) => input.value = raktinisZodis, raktinisCvKodas);
            if (miestas !== 'Visa Lietuva') {
                const miestuList = await page.$$('#f1-select option')
                for (const miestoNode of miestuList) {
                    const miestoNodeInner = await (await miestoNode.getProperty('innerText')).jsonValue();
                    if (miestas === miestoNodeInner) {
                        miestoNumVal = await (await miestoNode.getProperty('value')).jsonValue();
                    }
                }
                if (miestoNumVal === 'empty') {
                    await page.close();
                    await browser.close();
                    console.log('cv kodas neturi sio miesto pasirinkimo');
                    resolve(`cv kodas neturi ${miestas} miesto pasirinkimo`)
                }
                await page.select('select#f1-select', miestoNumVal);
            }
            const searchBtn = await page.$('.search-button');
            await searchBtn.click();
            //ar rasta skelbimu pagal specifikacijas
            try {
                await page.waitForSelector('.job-item', { timeout: 4000 }); //continues after catch block when results are found
            } catch (error) {
                await page.close()
                await browser.close();
                console.log('cv kodas rezultatu nera');//galima io sockets data siuntimo vieta i frontenda
                return resolve('cv kodas rezultatu nera');
            }
            pirmasPaieskosPsl = page.url();

            try {
                pagingContainer = await page.$$('.paging li');
                puslapiuSkaicius = await pagingContainer[pagingContainer.length - 2].$eval('a', btn => btn.innerText);
            } catch (e) {
                puslapiuSkaicius = 1;
            }

            // i data loopa
            for (let i = 1; i <= puslapiuSkaicius; i++) {
                await dataLoop(page, pirmasPaieskosPsl, i, jobsArr, adNumber)

            }
            await page.close()
            await browser.close();
            await storage.addAdList(jobsArr, id);
            return resolve(`cv kodas rado ${adNumber.adNumb} darbo  ${adNumber.adNumb>9 ? 'skelbimu' : 'skelbimus'}`);

        } catch (error) {
            console.log(error)
        }
    }).then(data=>{socket.getIo().to(`${socketId}`).emit('cvkodas',data); return new Promise((resolve, reject) => {return resolve(data)})})
}
module.exports = cvKodas