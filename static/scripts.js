const buscador = document.getElementById('buscador')
const enlaces = document.querySelectorAll('a')
const lupa = document.getElementById('lupa')
const searchbar = document.getElementById('search-bar')
const borrar = document.getElementById('borrar')
const contraseña = document.getElementById('contraseña')
const joinform = document.getElementById('joinform')
const container = document.getElementById('container')
const salir = document.getElementById('salir')
const notas = document.getElementById('notas')
const pwsa = '25565'
const fecha = new Date()
const hoy = `${fecha.getUTCDate()}/${fecha.getUTCMonth()+1}/${fecha.getFullYear()}`


document.addEventListener('DOMContentLoaded', () => {
    verify()
    enlaces.forEach(enlace => {
        enlace.target = '_blank'
    })
})

function verify(){
    if (localStorage.getItem('sesion') == hoy){
        document.querySelector('header').style.display = 'flex'
        container.style.display = 'flex'
        joinform.style.display = 'none'
    }else{
        document.querySelector('header').style.display = 'none'
    }
}


function acces(event) {
    event.preventDefault()
    const contenido = contraseña.value.toLowerCase().trim()
    if (contenido == pwsa){
        localStorage.setItem('sesion', hoy)
        sendNoti('✔️ Acceso')
        verify()
    }else{
        sendNoti('✖️ Contraseña Incorrecta')
        contraseña.value = ''
    }
}

notas.addEventListener('click', () => {
    window.location.href = 'notas.html'
})

salir.addEventListener('click', () => {
    window.location.href = window.location.href
    localStorage.setItem('sesion', 'none')
})

function toggle() {
    if (contraseña.type == 'text'){
        contraseña.type = 'password'
    }else{
        contraseña.type = 'text'
    }
}

buscador.addEventListener('input', function() {
    buscar()
})
borrar.addEventListener('click', () => {
    buscador.value = ''
    buscar()
})
function buscar() {
    const termino = buscador.value.toLowerCase().trim();
    enlaces.forEach(enlace => {
        const texto = enlace.textContent.toLowerCase();
        
        if (texto.includes(termino)) {
            enlace.style.display = 'flex';
        } else {
            enlace.style.display = 'none';
        }
    })
}

lupa.addEventListener('click', () => {
    if (searchbar.style.display == 'flex'){
        searchbar.style.animation = 'outro1 0.3s ease'
        setTimeout(() => {
            searchbar.style.animation = 'none'
            searchbar.style.display = 'none'
        }, 200);
    }else{
        searchbar.style.animation = 'intro1 0.3s ease'
        searchbar.style.display = 'flex'
        document.getElementById('buscador').focus()
        setTimeout(() => {
            searchbar.style.animation = 'none'
        }, 200);
    }
})
