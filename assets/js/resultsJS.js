function initBtnEListeners(){
    const buttons = document.querySelectorAll('.paginate-btn-js');
    buttons.forEach(button => {
        button.addEventListener('click',function(e){
            e.preventDefault;
            goToPage(button.value);
        })
    });

}
function goToPage(page){
    const currentUrl = window.location.href;
    const urlSplit = currentUrl.split('?');
    const urlPage = urlSplit[0];
    let urlParams = new URLSearchParams(urlSplit[1]);
    urlParams.set('page',page);
    let newUrl = urlPage +"?"+ urlParams;
    window.location.href = newUrl;

}
initBtnEListeners();