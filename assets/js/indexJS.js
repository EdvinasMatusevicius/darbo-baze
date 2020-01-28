const form = document.querySelector('#paieska');


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
     console.log(checkedArr);
    // $.ajax({
    //     method:'POST',
    //     url: '/paieska',
    //     data: {raktinis: raktinisZodis,
    //     miestas: miestas},
    //     success: function(data){
    //         console.log(data);
    //     }
    // })
});