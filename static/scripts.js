const buscador = document.getElementById('buscador')
const enlaces = document.querySelectorAll('.content')
const lupa = document.getElementById('lupa')
const searchbar = document.getElementById('search-bar')
const borrar = document.getElementById('borrar')
const contraseña = document.getElementById('contraseña')
const joinform = document.getElementById('joinform')
const container = document.getElementById('container')
const salir = document.getElementById('salir')
const notas = document.getElementById('notas')
const pwsa = '25565'
const version = '1.0.1'


console.log('version: ', version)
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('sesion') == 'open'){
        container.style.display = 'flex'
        joinform.style.display = 'none'
    }

    enlaces.forEach(enlace => {
        enlace.target = '_blank'
    })
})

function acces(event) {
    event.preventDefault()
    const contenido = contraseña.value.toLowerCase().trim()
    if (contenido == pwsa){
        container.style.display = 'flex'
        joinform.style.display = 'none'
        localStorage.setItem('sesion', 'open')
    }else{
        alert('Contraseña incorrecta')
        window.location.href = window.location.href
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
        setTimeout(() => {
            searchbar.style.animation = 'none'
        }, 200);
    }
})
