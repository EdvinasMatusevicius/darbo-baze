const form = document.querySelector('.search-js');
const loading = document.querySelector('#loading');

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const raktinisZodis = form.raktinisZodis.value;
    const miestas = form.miestas.value;
    const cvBCheck = form.cvBankas;
    const cvMCheck = form.cvMarket;
    const cvCheck = form.cv;
    const cvKCheck = form.cvKodas;
    const checkboxesArr = [cvBCheck, cvMCheck, cvCheck, cvKCheck]
    let checkedArr = [];
    checkboxesArr.forEach(checkbox => {
        if (checkbox.checked) {
            checkedArr.push(checkbox.name)
        }
    });
    if (checkedArr.length > 0) {
        initLoading(checkedArr);
        $.ajax({
            method: 'POST',
            url: '/paieska',
            data: {
                raktinis: raktinisZodis,
                miestas: miestas,
                pasirinktiPuslapiai: checkedArr,
                socket:userSocket
            },
            success: function (id) {
                const resultsPage = window.location.href + `results/?id=${id}&site=all&page=1`;

                socket.on('async',()=>{
                    window.location.href = resultsPage;
                })

            }
        })
    }else{
        console.log('turite pasirinkti bent viena paieskos puslapi');
    }
});
function initLoading(checkedArr){
    form.innerHTML='';
    checkedArr.forEach(site => {
        let fullName;
        if(site.length>2){
            fullName=site.substring(0,2)+' '+site.substring(2);
        }else{
            fullName = site+' Lt'
        }
       fullName= fullName[0].toUpperCase() + fullName.substring(1)

        loading.innerHTML +=`<div class="loading__site ${site}">${fullName} <span class='warning'>&nbsp;iesko&nbsp;</span> rezultatu ${loadingSvg}</div>`
    });
}