const buscador = document.getElementById('buscador');
const enlaces = document.querySelectorAll('.content');
const lupa = document.getElementById('lupa')
const searchbar = document.getElementById('search-bar');


buscador.addEventListener('input', function() {
    const termino = this.value.toLowerCase().trim();
    
    enlaces.forEach(enlace => {
        const texto = enlace.textContent.toLowerCase();
        
        if (texto.includes(termino)) {
            enlace.style.display = 'flex';
        } else {
            enlace.style.display = 'none';
        }
    })
})


lupa.addEventListener('click', () => {
    if (searchbar.style.visibility == 'visible'){
        searchbar.style.visibility = 'hidden'
    }else{
        searchbar.style.visibility = 'visible'
    }
})