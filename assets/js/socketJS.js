const socket = io.connect('http://localhost:3000/');
let userSocket;

socket.on('handshake', (data) => {
    console.log('handshake', data);
    userSocket = data;

    socket.on('cvkodas',(data)=>{
        const site = document.querySelector('.cvKodas');
        site.innerHTML= data.site?messageBuilder(data.site,data.numb):data;
    })
    socket.on('cvbankas',(data)=>{
        const site = document.querySelector('.cvBankas');
        site.innerHTML=data.site?messageBuilder(data.site,data.numb):data;
    })
    socket.on('cvmarket',(data)=>{
        const site = document.querySelector('.cvMarket');
        site.innerHTML=data.site?messageBuilder(data.site,data.numb):data;
    })
    socket.on('cv',(data)=>{
        const site = document.querySelector('.cv');
        site.innerHTML=data.site?messageBuilder(data.site,data.numb):data;
    })
});
// {site:'Cv bankas',numb:adNumber.adNumb}
function messageBuilder(site,ad){
    if(ad!==0){
    return `${site} rado <span class="success">&nbsp;${ad}&nbsp;</span> darbo ${ad>9 ? 'skelbimu' : 'skelbimus'}`;
}else{
    return `${site} <span class="danger">&nbsp;nerado&nbsp;</span> skelbimu`;
}
}
