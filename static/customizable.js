const configbtn = document.getElementById('configbtn')
const configdisplay = document.getElementById('configdisplay')

configbtn.addEventListener('click', () => {
    if(configdisplay.style.display == 'flex'){
        configdisplay.style.display = 'none'
    }else{
        configdisplay.style.display = 'flex'
    }
})