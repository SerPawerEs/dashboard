//Elements
const titulo = document.getElementById('txttitulo')
const msg = document.getElementById('txttext')
const list = document.getElementById('note-container')

const lupa = document.getElementById('lupa')
const searchbar = document.getElementById('search-bar')
const borrar = document.getElementById('borrar')
const textos = document.querySelectorAll('.content-note')
const salir = document.getElementById('salir')

const notas = document.getElementById('notas')
const addnote = document.getElementById('addnote')
const editdiv = document.getElementById('editnote')
const wtitulo = document.getElementById('edittitulo')
const wtexto = document.getElementById('edittext')
//Acces
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('sesion') == 'open'){
        console.log('Registered')
    }else{
        window.location.href = 'inicio.html'
    }
})
//Functions
borrar.addEventListener('click', () => {
    buscador.value = ''
    buscarTexto()
})

//Buscar
document.addEventListener('DOMContentLoaded', () => {
    const inputBuscador = document.getElementById('buscador');
    const form = inputBuscador ? inputBuscador.closest('form') : null;

    // Evitar envío del formulario al presionar Enter
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            buscarTexto();
        });
    }

    // Buscar en tiempo real mientras se escribe
    if (inputBuscador) {
        inputBuscador.addEventListener('input', buscarTexto);
    }
});

function buscarTexto() {
    const input = document.getElementById('buscador');
    if (!input) return;

    const filter = input.value.trim().toLowerCase();
    const container = document.getElementById('note-container');
    if (!container) return;

    const detailsList = container.querySelectorAll('details.content-note');

    detailsList.forEach(details => {
        const summary = details.querySelector('summary');
        const contentDivs = details.querySelectorAll('div'); // todos los <div> dentro

        let summaryText = '';
        let contentText = '';

        if (summary) summaryText = summary.textContent.toLowerCase();
        contentDivs.forEach(div => {
            // Ignoramos el div que contiene la fecha si quieres, pero por ahora lo incluimos
            contentText += div.textContent.toLowerCase();
        });

        if (summaryText.includes(filter) || contentText.includes(filter)) {
            details.style.display = '';
        } else {
            details.style.display = 'none';
        }
    });
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

//Fin Buscar

notas.addEventListener('click', () => {
    Alternar(addnote)
})


function Alternar(pantalla){
    if (pantalla.style.display == 'flex'){
        pantalla.style.animation = 'outro2 0.3s ease'
        setTimeout(() => {
            pantalla.style.animation = 'none'
            pantalla.style.display = 'none'
        }, 200);
    }else{
        pantalla.style.animation = 'intro2 0.3s ease'
        pantalla.style.display = 'flex'
        setTimeout(() => {
            pantalla.style.animation = 'none'
        }, 200);
    }
}

salir.addEventListener('click', () => {
    window.location.href = 'inicio.html'
})

//Database
const dbURL = 'https://database-3c232-default-rtdb.firebaseio.com/'
firebase.initializeApp({databaseURL:dbURL})
const db = firebase.database()

function subir(){
    const title = titulo.value.trim()
    const note = msg.value.trim()
    if (title && note) {
        db.ref('notas').push({title, note})
        titulo.value = ''
        msg.value = ''
    }
}

db.ref('notas').on('value', (data) => {
    list.innerHTML = ""
    const datos = data.val()
    if(datos){
        Object.entries(datos).forEach(([key, val]) => {
            const cont = document.createElement('details')
            const txttit = document.createElement('summary')
            const txtmd = document.createElement('p')
            const strong = document.createElement('strong')
            cont.className = 'content-note'
            const delbtn = document.createElement('button')
            delbtn.textContent = 'Eliminar'
            delbtn.style = 'border-radius: 20px; padding: 5px; margin: 5px;'
            delbtn.onclick = function() {
                db.ref('/notas/' + key).remove()
                console.log('btn', key, 'presonado')
            }

            const editbtn = document.createElement('button')
            editbtn.textContent = 'Editar'
            editbtn.style = 'border-radius: 20px; padding: 5px; margin: 5px;'
            editbtn.onclick = function() {
                editar(key, val.title, val.note)
            }
            strong.textContent = `${val.title}`
            txtmd.textContent = `${val.note}`

            list.appendChild(cont)
            cont.appendChild(txttit)
            cont.appendChild(txtmd)
            cont.appendChild(delbtn)
            cont.appendChild(editbtn)
            txttit.appendChild(strong)
        })
    }
})

function editar(key, titulo, texto){
    Alternar(editdiv)

    wtitulo.value = titulo
    wtexto.value = texto
    editdiv.className = key
}

function seditar() {
    const key = editdiv.className
    db.ref('/notas/' + key).update({
        title: wtitulo.value.trim(),
        note: wtexto.value.trim()
    })
}