const form = document.querySelector('#paieska');


form.addEventListener('submit',(event)=>{
    event.preventDefault();
    const raktinisZodis = form.raktinisZodis.value;
    const miestas = form.miestas.value;

    $.ajax({
        method:'POST',
        url: '/paieska',
        data: {raktinis: raktinisZodis,
        miestas: miestas},
        success: function(data){
            console.log(data);
        }
    })
});