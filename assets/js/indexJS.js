const form = document.querySelector('#paieska');
const socket = io.connect('/');


form.addEventListener('submit',(event)=>{
    event.preventDefault();
    const raktinisZodis = form.raktinisZodis.value;
    const miestas = form.miestas.value;
    const cvBCheck = form.cvBankas;
    const cvMCheck = form.cvMarket;
    const cvCheck = form.cv;
    const cvKCheck = form.cvKodas;
    const checkboxesArr = [cvBCheck,cvMCheck,cvCheck,cvKCheck]
     let checkedArr =[];
     checkboxesArr.forEach(checkbox => {
         if(checkbox.checked){
             checkedArr.push(checkbox.name)
         }
     });
    $.ajax({
        method:'POST',
        url: '/paieska',
        data: {raktinis: raktinisZodis,
        miestas: miestas,
        pasirinktiPuslapiai: checkedArr},
        success: function(data){
            console.log(data);
        }
    })
});