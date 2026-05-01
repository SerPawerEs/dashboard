const configbtn = document.getElementById('configbtn')
const configdisplay = document.getElementById('configdisplay')

const version = '1.2.1'
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
