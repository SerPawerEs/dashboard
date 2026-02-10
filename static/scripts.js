const buscador = document.getElementById('buscador')
const enlaces = document.querySelectorAll('.content')
const lupa = document.getElementById('lupa')
const searchbar = document.getElementById('search-bar')
const borrar = document.getElementById('borrar');


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