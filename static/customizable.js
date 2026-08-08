const configbtn = document.getElementById('configbtn')
const configdisplay = document.getElementById('configdisplay')

const version = '1.2.4'
const versionin = document.getElementById('version')

document.addEventListener('DOMContentLoaded', () => {
    console.log('version: ', version)
    versionin.innerHTML = version
})

configbtn.addEventListener('click', () => {
    if(configdisplay.style.display == 'flex'){
        configdisplay.style.display = 'none'
    }else{
        configdisplay.style.display = 'flex'
    }
})

function sendNoti(msg){
    const noti = document.createElement('span')
    noti.textContent = msg
    noti.className = 'notification'
    document.body.appendChild(noti)
    setTimeout(() => {
        noti.remove()
    }, 2000);
}