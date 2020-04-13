const puppeteer = require('puppeteer');
const storage = require('../../mongoDB/storage');
const socket = require('../../sockets/socket');


const raktinioZodzioInputID = '#filter_keyword';
const ieskojimoBtnID = "#main_filter_submit";
//LINKAS APZIURETI VISUS PUSLAPYJE ESANCIUS SKELBIMUS ATSIRANDANTIS PO PAIESKOS
const afterSearch = '#js_id_id_job_ad_list';


const dataLoop = (page,searchPage,pageNum,jobsArr,adNumber) => {
    return new Promise(async(resolve, reject) => {
            //SITAS TRY PATIKRINA AR GAUTAS REZULTATAS YRA DARBU LIST AR KLAIDA PRANESANTI KAD SKELBIMU PAGAL DUOTA INFO NERASTA
            try {
                //SITAS IF EINA I REIKIAMA PUSLAPI NEBENT JIS BUNA PIRMAS JAU ANKSCIAU ATIDARYTAS PUSLAPIS
                if(pageNum>1) await page.goto(searchPage+'&page='+pageNum);
                await page.waitForSelector(afterSearch);
                const adList = await page.$$(`${afterSearch} > .list_article`);
                adNumber.adNumb +=adList.length;
                //FOR LOOPINA PER KIEKVIENA SKELBIMA IR ISGAUNA REIKIAMUS DUOMENIS
                for (const ad of adList) {
                    //SKELBIMU DUOMENU ISGAVIMO FUNKCIJOS NAUDOJAMOS KADA DUOMENYS SKIRTINGUOSE SKELBIMUOSE BUNA SKIRTINGUOSE ELEMENTUOSE ARBA JU ISVIS NEBUBA
                    //SKELBIMO GALIOJIMAS BUNA SKIRTINGUOSE CLASS PRIKLAUSOMAI AR PARASYTA PRIES KIEK DIENU IKELTAS AR KIEK DIENU DAR GALIOJA
                    const galiojimasFn = async () => {
                        try {
                            return await ad.$eval('.txt_list_2', galiojimas => galiojimas.innerText);
                        } catch (e) {
                            return await ad.$eval('.txt_list_important', galiojimas => galiojimas.innerText);
                        }
                    };
                    //FUNKCIJA ISGAUNANTI SIULOMA ALGA TUO ATVEJU KAI JI BUNA NURODYTA
                    const algaFn = async () => {
                        try {
                            const algosKiekis = await ad.$eval('.salary_amount', alga => alga.innerText);
                            const algosPeriodas = await ad.$eval('.salary_period', algosPeriod => algosPeriod.innerText);
                            const algosSkaiciavimas = await ad.$eval('.salary_calculation', salaryCalc => salaryCalc.innerText);
                            return { alga: algosKiekis, algosPeriodas: algosPeriodas, algosSkaiciavimas: algosSkaiciavimas };
                        } catch (e) {
                            return '-';
                        }
                    }
                    const jobName = await ad.$eval('h3', h3 => h3.innerText);
                    const miestas = await ad.$eval('.list_city', city => city.innerText);
                    const alga = await algaFn();
                    const galiojimas = await galiojimasFn();
                    const linkToAd = await ad.$eval('.list_a', city => city.getAttribute('href'));

                    const darboInfo = {
                        jobName: jobName, alga: alga, miestas: miestas, adGaliojimas: galiojimas, nuoroda: linkToAd, source: 'cv bankas'
                    };
                    jobsArr.push(darboInfo);
                };
                return resolve('cv bankas loop done');
            } catch (e) {
                console.log(e, 'EEEEEE KLAIDA');
                
            };
            // await page.screenshot({ path: 'image.jpg', type: 'jpeg' });
    })
};

const cvBankas = (raktinisCvBankas,miestas,id,socketId) => {
    return new Promise((resolve, reject) => {
        (async () => {
            let jobsArr = [];
            if(miestas === 'Visa Lietuva'){miestas= ''};
            let pirmasPaieskosPsl;
            let puslapiuSkaicius;
            let adNumber = {adNumb:0}; //ad number is object and not primitive so that it would not be copied (only need a reference) so that its value could be changed in helper functions
            try {
                //CHROMIUMO IR CV BANKO ATIDARYMAS 
                const browser = await puppeteer.launch({ headless: true});
                const page = await browser.newPage();
                page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36");

                await page.goto('https://www.cvbankas.lt/');
                //LAUKIAMAS INPUT SELEKTORIAUS UZKROVIMAS
                await page.waitForSelector(raktinioZodzioInputID);
                //EVALUATE ATLIEKA VEIKSMUS PUSLAPIO KNONTEKSTE 
                await page.$eval(raktinioZodzioInputID, (el, raktinisCvBankas) => el.value = raktinisCvBankas, raktinisCvBankas);
                await page.select('select#filter_city',miestas);
                const ieskojimoBtn = await page.$(ieskojimoBtnID);
                await ieskojimoBtn.click();
                //TIKRINIMAS AR RASTA REZULTATU
                try {
                    await page.waitForSelector(afterSearch,{timeout: 5000}); //jei rasta tesia koda uz catch bloko
                    
                } catch (error) {
                    // UZDAROMAS PUSLAPIS PO SKELBIMU NEBUVIMO
                await page.waitForSelector('.message_err_list',{timeout: 4000});
                await page.close()
                await browser.close();
                console.log('cv bankas rezultatu nera');//galima io sockets data siuntimo vieta i frontenda
                return resolve('cv bankas rezultatu nera');
                }

                pirmasPaieskosPsl = page.url();
                //PUSLAPIU SKAICIAUS TIKRINIMAS
                try {
                    puslapiuSkaicius =  await page.$eval('.pages_ul_inner',list =>list.lastElementChild.innerText);
                } catch (error) {
                    puslapiuSkaicius = 1;
                } 

                //LOOPAS EINANTIS PER REZULTATU PUSLAPIUS
                for(let i=1; i<=puslapiuSkaicius;i++){
                    await dataLoop(page,pirmasPaieskosPsl,i,jobsArr,adNumber);
                }
                await page.close()
                await browser.close();
                await storage.addAdList(jobsArr,id);
                return resolve(`cv bankas rado ${adNumber.adNumb} darbo ${adNumber.adNumb>9 ? 'skelbimu' : 'skelbimus'}`);
            } catch (error) {
                //PASITAIKIUS KLAIDAI
                console.log(error);
            }
        })();
    }
    ).then(data=>{socket.getIo().to(`${socketId}`).emit('cvbankas',data); return new Promise((resolve, reject) => {return resolve(data)})})
};
module.exports = cvBankas;
