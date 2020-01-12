const puppeteer = require('puppeteer');
const storage = require('../../mongoDB/storage');
//after receving city name  number value needs to be used to select websites options
const miestuNumeriuComboArr = [

    {miestas: 'Vilnius', number: '134'},
    {miestas: 'Kaunas', number: '135'},
    {miestas: 'Klaipėda', number: '136'},
    {miestas: 'Šiauliai', number: '137'},
    {miestas: 'Panevėžys', number: '138'},
    {miestas: 'Alytus', number: '282'},
    {miestas: 'Akmenė', number: '139'},
    {miestas: 'Anykščiai', number: '140'},
    {miestas: 'Birštonas', number: '998'},
    {miestas: 'Biržai', number: '141'},
    {miestas: 'Druskininkai', number: '142'},
    {miestas: 'Elektrėnai', number: '283'},
    {miestas: 'Gargždai', number: '1005'},
    {miestas: 'Ignalina', number: '999'},
    {miestas: 'Jonava', number: '143'},
    {miestas: 'Jurbarkas', number: '145'},
    {miestas: 'Kaišiadorys', number: '146'},
    {miestas: 'Kalvarija', number: '1242'},
    {miestas: 'Kazlų Rūda', number: '1057'},
    {miestas: 'Kėdainiai', number: '147'},
    {miestas: 'Kelmė', number: '148'},
    {miestas: 'Krekenava', number: '1236'},
    {miestas: 'Kretinga', number: '149'},
    {miestas: 'Kupiškis', number: '150'},
    {miestas: 'Kuršėnai', number: '1000'},
    {miestas: 'Lazdijai', number: '151'},
    {miestas: 'Lentvaris', number: '1006'},
    {miestas: 'Marijampolė', number: '152'},
    {miestas: 'Mažeikiai', number: '153'},
    {miestas: 'Molėtai', number: '285'},
    {miestas: 'Palanga', number: '233'},
    {miestas: 'Pasvalys', number: '234'},
    {miestas: 'Plungė', number: '235'},
    {miestas: 'Prienai', number: '236'},
    {miestas: 'Radviliškis', number: '237'},
    {miestas: 'Raseiniai', number: '238'},
    {miestas: 'Rietavas', number: '1235'},
    {miestas: 'Rokiškis', number: '239'},
    {miestas: 'Skuodas', number: '988'},
    {miestas: 'Šakiai', number: '240'},
    {miestas: 'Šilalė', number: '242'},
    {miestas: 'Šilutė', number: '243'},
    {miestas: 'Širvintos', number: '244'},
    {miestas: 'Tauragė', number: '246'},
    {miestas: 'Telšiai', number: '247'},
    {miestas: 'Trakai', number: '248'},
    {miestas: 'Ukmergė', number: '249'},
    {miestas: 'Utena', number: '250'},
    {miestas: 'Varėna', number: '1003'},
    {miestas: 'Vievis', number: '284'},
    {miestas: 'Vilkaviškis', number: '251'},
    {miestas: 'Visaginas', number: '987'},
    {miestas: 'Zarasai', number: '252'},
    {miestas: 'Visa Lietuva', number: '371'}
]

const convertCityToNumb = (city)=>{
    return miestuNumeriuComboArr.find((cityPora)=>{
        return cityPora.miestas === city;
    })
};
async function checkActiveButton (page){
    const puslapiai = await page.$$('.pagination > li:not(.hidden-xs-down)');
    const lastBtn = await puslapiai[puslapiai.length - 3].$eval('a',link=>link.className);
    return lastBtn;
}
async function dataLoop (page,jobsArr,adNumber){
    await page.waitForSelector('.mobile_search_count');
    const adList= await page.$$('.f_job_row2');
    adNumber.adNumb+=adList.length;//on every loop adds adList items to adNumber object for total ads count
    for(const ad of adList){
        const algaFn = async ()=>{
            //TRY CATCH BLOCK JEI ALGOS NERA
            try {
                let algosKiekis = await ad.$eval('.salary-mobile>b',element=>element.innerText);
                let algosPeriodas;

                //READS STRING AROUND ELEMENT IN WHICH SALARY NUMBERS ARE WRITEN  
                const textAplinkAlgosKieki = await ad.$eval('.salary-mobile',element=>{
                    text = [];
                    let child = element.firstChild;
                    while(child){
                        if(child.nodeType === 3) { text.push(child.data); }
                        child = child.nextSibling;
                    }
                    return text;
                });
                // IF TWO STRINGS ARE FOUND ONE IS ADDED INFRONNT OF SALARY NUMB LIKE: nuo 800. THE OTHER IS EUR/MEN
                 
                if(textAplinkAlgosKieki.length === 2){
                    algosKiekis = textAplinkAlgosKieki[0]+algosKiekis;
                    algosPeriodas = textAplinkAlgosKieki[1];
                }else{
                    algosPeriodas = textAplinkAlgosKieki[0];
                }
                

                const algosSkaiciavimas = await ad.$eval('.salary-type',(element)=>{
                    const textLenght = element.innerText.length;
                    if(textLenght===45){
                        return 'Į rankas';
                    }else if(textLenght===58){
                        return 'Neatskaičius mokesčių';
                    }else{return '-'}
                });// 45 length = Į rankas, 58 = Neatskaičius mokesčių

                return { alga: algosKiekis, algosPeriodas: algosPeriodas, algosSkaiciavimas: algosSkaiciavimas };
            } catch (error) {
                return '-'
            }

        }

        const jobName  = await ad.$eval('.f_job_title',title=>title.innerText);
        const miestas  = (await ad.$eval('.f_job_city',title=>title.innerText)).replace(/\s/g,''); //removes ne line \n leftover expresion using regex
        const alga  = await algaFn();
        const galiojimas  = await ad.$eval('.time-left-block',textElement=> textElement.innerText);
        const linkToAd  = await ad.$eval('.main_job_link',link=>link.getAttribute('href'))

        const darboInfo = {
            jobName: jobName, alga: alga, miestas: miestas, adGaliojimas: galiojimas, nuoroda: 'https://www.cvmarket.lt'+linkToAd, source: 'cv market'
        };
        jobsArr.push(darboInfo);
    }
}
//MAIN FUNCTION THAT GETS EXPORTED <><><><><><><><><><><><><><><>
const cvMarket = (raktinisCvMarket,miestas,id)=>{
 return new Promise ((resolve,reject)=>{
    let adNumber = {adNumb:0}; //ad number is object and not primitive so that it would not be copied (only need a reference) so that its value could be changed in helper functions
    let jobsArr = [];
     (async()=>{
         try {
             const browser = await puppeteer.launch({headless: true});
             const page = await browser.newPage();
             page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36");

             //changed to mobile version for easier option selection
             await page.setViewport({
                width: 550,
                height: 1080
            })
             await page.goto('https://www.cvmarket.lt/');
             await page.waitForSelector('#mobile_search');
            
            const inputs = await page.$$('.search_fields');
            await page.evaluate((el,raktinis) => el.querySelector('[placeholder="Įrašykite raktažodį"]').value = raktinis,inputs[1],raktinisCvMarket);
            const miestoVal = convertCityToNumb(miestas);
            await page.select('select[name="mobile_search[locations]"]',miestoVal.number);//option selection with city number
            const ieskojimoBtn = await page.$('#mobile_search');
            ieskojimoBtn.click();

            //AR YRA PAIESKOS REZULTATU TRY BLOKAS
            try {
                await page.waitForSelector('.mobile_search_count',{timeout: 4000});
            } catch (error) {
                // console.log(error);
                await page.waitForSelector('.fail');
                await page.close()
                await browser.close();
                console.log('cv market rezultatu nera');//galima io sockets data siuntimo vieta i frontenda
                return resolve('cv market rezultatu nera  resolve info');

            }
            //-------------------------------------
            //reads first page results and checks if next page buttons are present. If they are presses next page and calls dataLoop FN
            await dataLoop(page,jobsArr,adNumber);
            console.log(adNumber.adNumb);
            const puslapiai = await page.$$('.pagination > li:not(.hidden-xs-down)');
            console.log('cv market ir id yra =',id);
            if(puslapiai.length === 0){  //page navigation not present meaning all results fit on one page.
                await page.close();
                await browser.close();
                await storage.addAdList(jobsArr,id);
                return resolve(`cv market rado ${adNumber.adNumb} darbo skelbimus`);
            }else{
                do {
                    const puslapiaiInNewEnviroment = await page.$$('.pagination > li:not(.hidden-xs-down)');
                    const nextBtn= puslapiaiInNewEnviroment[puslapiaiInNewEnviroment.length-2];
                    await nextBtn.click();
                    await dataLoop(page,jobsArr,adNumber);
                    console.log(adNumber);
                } while (await checkActiveButton(page) !== 'act');
                await page.close();
                await browser.close();
                await storage.addAdList(jobsArr,id);
                return resolve(`cv market rado ${adNumber.adNumb} darbo skelbimus`);
            }

         } catch (error) {
             console.log(error);
         }
     })()
 })
}

module.exports = cvMarket;