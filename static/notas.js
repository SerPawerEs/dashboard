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

const fecha = new Date()
const hoy = `${fecha.getUTCDate()}/${fecha.getUTCMonth()+1}/${fecha.getFullYear()}`
//Acces
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('sesion') == hoy){
        console.log('Registered')
    }else{
        window.location.href = 'inicio.html'
    }
})
//Functions

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
        const contentDivs = details.querySelectorAll('p'); // todos los <div> dentro

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


//Lupa
borrar.addEventListener('click', () => {
    buscador.value = ''
    buscarTexto()
})

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
    Alternar(addnote, editdiv)
})


function Alternar(pantalla, pantalla2){
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
        if (pantalla2.style.display == 'flex') {
            pantalla2.style.animation = 'outro2 0.3s ease'
            setTimeout(() => {
                pantalla2.style.animation = 'none'
                pantalla2.style.display = 'none'
            }, 200);
        }
    }
}

salir.addEventListener('click', () => {
    window.location.href = 'inicio.html'
})

//Database
const dbURL = 'https://database-3c232-default-rtdb.firebaseio.com/'
firebase.initializeApp({databaseURL:dbURL})
const db = firebase.database()


db.ref('notas').on('value', (data) => {
    list.innerHTML = ""
    const datos = data.val()
    if(datos){
        Object.entries(datos).toReversed().forEach(([key, val]) => {
            const cont = document.createElement('details')
            const txttit = document.createElement('summary')
            txttit.style = 'text-decoration: underline;'
            const txtmd = document.createElement('p')
            const strong = document.createElement('strong')
            cont.className = 'content-note'

            const delbtn = document.createElement('button')
            delbtn.textContent = 'Eliminar'
            delbtn.style = 'border-radius: 20px; padding: 5px; margin: 5px; background: linear-gradient(135deg, rgb(255, 0, 0), rgb(255, 255, 255), rgb(255, 0, 0));'
            delbtn.onclick = function() {
                if(confirm('Vas a eliminar este elemento para siempre, ¿Continuar?')){
                    db.ref('/notas/' + key).remove()
                    console.log('btn', key, 'presonado')
                }
            }

            const editbtn = document.createElement('button')
            editbtn.textContent = 'Editar'
            editbtn.style = 'border-radius: 20px; padding: 5px; margin: 5px; background: linear-gradient(135deg, rgb(38, 0, 255), rgb(255, 255, 255), rgb(38, 0, 255));'
            editbtn.onclick = function() {
                // Agrega val.imagenes como cuarto parámetro
                editar(key, val.title, val.note, val.imagenes || [])
            }
            strong.textContent = `${val.title}`
            txtmd.textContent = `${val.note}`

            list.appendChild(cont)
            cont.appendChild(txttit)
            cont.appendChild(txtmd)
            
            // ==========================================
            // NUEVO: MOSTRAR IMÁGENES (DEBAJO DEL TEXTO)
            // ==========================================
            if(val.imagenes && val.imagenes.length > 0) {
                const imgContainer = document.createElement('div')
                imgContainer.style = 'display: flex; flex-wrap: wrap; gap: 10px; margin: 10px 0;'
                
                val.imagenes.forEach(imgSrc => {
                    const img = document.createElement('img')
                    img.src = imgSrc
                    img.style = 'max-width: 200px; max-height: 200px; border-radius: 10px; border: 1px solid #ddd; cursor: pointer; transition: transform 0.2s;'
                    img.onclick = function() {
                        window.open(imgSrc, '_blank')
                    }
                    img.onmouseover = function() {
                        this.style.transform = 'scale(1.05)'
                    }
                    img.onmouseout = function() {
                        this.style.transform = 'scale(1)'
                    }
                    imgContainer.appendChild(img)
                })
                
                cont.appendChild(imgContainer)
            }
            // ==========================================
            
            cont.appendChild(delbtn)
            cont.appendChild(editbtn)
            txttit.appendChild(strong)
        })
    }
})

// EDITAR -----------------------------------------


// ==========================================
// VARIABLES GLOBALES
// ==========================================
let archivosParaEnviar = [];
let imagenesExistentes = [];
let keyActual = null;

// ==========================================
// FUNCIÓN EDITAR (SE LLAMA DESDE EL BOTÓN EDITAR)
// ==========================================
function editar(key, titulo, texto, imagenes = []) {
    Alternar(editdiv, addnote)

    document.getElementById('edittitulo').value = titulo
    document.getElementById('edittext').value = texto
    
    // Guardar key y imágenes existentes
    keyActual = key
    imagenesExistentes = [...imagenes] // Copia del array
    archivosParaEnviar = [] // Nuevas imágenes vacías
    
    // Limpiar y mostrar galería de edición
    const galeriaEdit = document.getElementById('galeriaEdit')
    galeriaEdit.innerHTML = ''
    
    // Mostrar imágenes existentes
    if(imagenes && imagenes.length > 0) {
        imagenes.forEach((imgSrc, index) => {
            mostrarImagenExistente(imgSrc, index)
        })
    }
    
    editdiv.className = key
}

// ==========================================
// MOSTRAR IMÁGEN EXISTENTE (CON BOTÓN ELIMINAR)
// ==========================================
function mostrarImagenExistente(imgSrc, index) {
    const galeriaEdit = document.getElementById('galeriaEdit')
    
    const card = document.createElement('div')
    card.style.cssText = 'position: relative; width: 100px; height: 120px; border: 1px solid #ddd; border-radius: 5px; overflow: hidden; display: inline-block; margin: 5px; background: #fff;'
    
    const img = document.createElement('img')
    img.src = imgSrc
    img.style.cssText = 'width: 100%; height: 100px; object-fit: cover; display: block;'
    
    const nombre = document.createElement('div')
    nombre.innerText = 'imagen_' + (index + 1) + '.png'
    nombre.style.cssText = 'font-size: 10px; text-align: center; color: #666; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%; padding: 2px 0;'
    
    const btnDelete = document.createElement('button')
    btnDelete.innerHTML = '&times;'
    btnDelete.type = 'button'
    btnDelete.style.cssText = 'position: absolute; top: 5px; right: 5px; background: rgba(255, 0, 0, 0.9); color: white; border: none; border-radius: 50%; width: 22px; height: 22px; cursor: pointer; font-size: 16px; line-height: 1; z-index: 10;'
    
    btnDelete.onclick = () => {
        galeriaEdit.removeChild(card)
        // Eliminar de imagenesExistentes
        imagenesExistentes = imagenesExistentes.filter((_, i) => i !== index)
    }

    card.appendChild(btnDelete)
    card.appendChild(img)
    card.appendChild(nombre)
    galeriaEdit.appendChild(card)
}

// ==========================================
// GUARDAR EDICIÓN
// ==========================================
function seditar() {
    const key = editdiv.className
    const title = document.getElementById('edittitulo').value.trim()
    const note = document.getElementById('edittext').value.trim()
    
    if (title && note) {
        // Si hay nuevas imágenes, convertirlas a Base64
        if (archivosParaEnviar.length > 0) {
            convertirImagenesYEditar(key, title, note)
        } else {
            // Solo actualizar texto y imágenes existentes
            guardarEdicionEnFirebase(key, title, note, imagenesExistentes)
        }
    } else {
        alert('Por favor escribe un título y un mensaje')
    }
}

// ==========================================
// CONVERTIR NUEVAS IMÁGENES A BASE64
// ==========================================
function convertirImagenesYEditar(key, title, note) {
    const nuevasImagenesBase64 = []
    
    const promesas = archivosParaEnviar.map(archivo => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            
            reader.onload = (e) => {
                nuevasImagenesBase64.push(e.target.result)
                resolve(e.target.result)
            }
            
            reader.onerror = (error) => {
                console.error('Error al convertir imagen:', error)
                reject(error)
            }
            
            reader.readAsDataURL(archivo)
        })
    })

    Promise.all(promesas)
        .then(() => {
            // Combinar imágenes existentes + nuevas
            const todasLasImagenes = [...imagenesExistentes, ...nuevasImagenesBase64]
            guardarEdicionEnFirebase(key, title, note, todasLasImagenes)
        })
        .catch((error) => {
            console.error('Error en la conversión:', error)
            alert('Error al procesar las imágenes')
        })
}

// ==========================================
// GUARDAR EDICIÓN EN FIREBASE
// ==========================================
function guardarEdicionEnFirebase(key, title, note, imagenesBase64) {
    db.ref('/notas/' + key).update({
        title: title,
        note: note,
        imagenes: imagenesBase64,
        cantidadImagenes: imagenesBase64.length
    })
    .then(() => {
        // Limpiar formulario
        document.getElementById('edittitulo').value = ''
        document.getElementById('edittext').value = ''
        document.getElementById('inputFileEdit').value = ''
        archivosParaEnviar = []
        imagenesExistentes = []
        document.getElementById('galeriaEdit').innerHTML = ''
        
        Alternar(editdiv)
        alert('¡Nota actualizada exitosamente!')
    })
    .catch((error) => {
        console.error('Error al actualizar nota:', error)
        alert('Error al actualizar la nota')
    })
}

// ==========================================
// AGREGAR IMAGEN AL ARRAY (NUEVAS IMÁGENES)
// ==========================================
function agregarImagen(blob) {
    archivosParaEnviar.push(blob)
    mostrarVistaPreviaNueva(blob)
}

// ==========================================
// MOSTRAR VISTA PREVIA DE NUEVA IMAGEN
// ==========================================
function mostrarVistaPreviaNueva(blob) {
    const reader = new FileReader()
    reader.onload = (e) => {
        const card = document.createElement('div')
        card.style.cssText = 'position: relative; width: 100px; height: 120px; border: 1px solid #007bff; border-radius: 5px; overflow: hidden; display: inline-block; margin: 5px; background: #fff;'
        
        const img = document.createElement('img')
        img.src = e.target.result
        img.style.cssText = 'width: 100%; height: 100px; object-fit: cover; display: block;'
        
        const nombre = document.createElement('div')
        nombre.innerText = 'NUEVA'
        nombre.style.cssText = 'font-size: 10px; text-align: center; color: #007bff; font-weight: bold; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%; padding: 2px 0;'
        
        const btnDelete = document.createElement('button')
        btnDelete.innerHTML = '&times;'
        btnDelete.type = 'button'
        btnDelete.style.cssText = 'position: absolute; top: 5px; right: 5px; background: rgba(255, 0, 0, 0.9); color: white; border: none; border-radius: 50%; width: 22px; height: 22px; cursor: pointer; font-size: 16px; line-height: 1; z-index: 10;'
        
        btnDelete.onclick = () => {
            document.getElementById('galeriaEdit').removeChild(card)
            archivosParaEnviar = archivosParaEnviar.filter(archivo => archivo !== blob)
        }

        card.appendChild(btnDelete)
        card.appendChild(img)
        card.appendChild(nombre)
        document.getElementById('galeriaEdit').appendChild(card)
    }
    reader.readAsDataURL(blob)
}

// ==========================================
// EVENTO PASTE (Ctrl + V) - EN EL TEXTAREA DE EDICIÓN
// ==========================================
document.getElementById('edittext').addEventListener('paste', function(e) {
    const items = e.clipboardData.items
    
    for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
            e.preventDefault()
            const blob = items[i].getAsFile()
            agregarImagen(blob)
        }
    }
})

// ==========================================
// EVENTO INPUT FILE (Seleccionar archivos) - EDICIÓN
// ==========================================
document.getElementById('inputFileEdit').addEventListener('change', function(e) {
    const files = e.target.files
    
    for (let i = 0; i < files.length; i++) {
        if (files[i].type.indexOf('image') !== -1) {
            agregarImagen(files[i])
        }
    }
    
    e.target.value = ''
})


//IMAGENES Y SUBIR --------------------------



// script.js

// Array global para almacenar las imágenes

// ==========================================
// FUNCIÓN SUBIR (LLAMADA DESDE EL FORMULARIO)
// ==========================================
function subir() {
    const title = document.getElementById('txttitulo').value.trim();
    const note = document.getElementById('txttext').value.trim();

    if (title && note) {
        if (archivosParaEnviar.length > 0) {
            convertirImagenesYGuardarNota(title, note);
        } else {
            guardarNotaEnFirebase(title, note, []);
        }
    } else {
        alert('Por favor escribe un título y un mensaje');
    }
}

// ==========================================
// CONVERTIR IMÁGENES A BASE64 (SIN STORAGE)
// ==========================================
function convertirImagenesYGuardarNota(title, note) {
    const imagenesBase64 = [];
    
    const promesas = archivosParaEnviar.map(archivo => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                imagenesBase64.push(e.target.result);
                resolve(e.target.result);
            };
            
            reader.onerror = (error) => {
                console.error('Error al convertir imagen:', error);
                reject(error);
            };
            
            reader.readAsDataURL(archivo);
        });
    });

    Promise.all(promesas)
        .then(() => {
            guardarNotaEnFirebase(title, note, imagenesBase64);
        })
        .catch((error) => {
            console.error('Error en la conversión:', error);
            alert('Error al procesar las imágenes');
        });
}

// ==========================================
// GUARDAR NOTA EN FIREBASE DATABASE
// ==========================================
function guardarNotaEnFirebase(title, note, imagenesBase64) {
    db.ref('notas').push({
        title: title,
        note: note,
        imagenes: imagenesBase64,
        fecha: firebase.database.ServerValue.TIMESTAMP,
        cantidadImagenes: imagenesBase64.length
    })
    .then(() => {
        // Limpiar formulario y galería
        document.getElementById('txttitulo').value = '';
        document.getElementById('txttext').value = '';
        document.getElementById('inputFile').value = '';
        archivosParaEnviar = [];
        document.getElementById('galeria').innerHTML = '';
        
        // Tu función original
        Alternar(addnote);
        
        alert('¡Nota guardada exitosamente!');
    })
    .catch((error) => {
        console.error('Error al guardar nota:', error);
        alert('Error al guardar la nota');
    });
}

// ==========================================
// AGREGAR IMAGEN AL ARRAY
// ==========================================
function agregarImagen(blob) {
    archivosParaEnviar.push(blob);
    mostrarVistaPrevia(blob);
}

// ==========================================
// MOSTRAR VISTA PREVIA (CON X ARRIBA Y NOMBRE)
// ==========================================
function mostrarVistaPrevia(blob) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const card = document.createElement('div');
        // Contenedor relativo para que la X se posicione absolutamente
        card.style.cssText = 'position: relative; width: 100px; height: 120px; border: 1px solid #ddd; border-radius: 5px; overflow: hidden; display: inline-block; margin: 5px; background: #fff;';
        
        const img = document.createElement('img');
        img.src = e.target.result;
        // Imagen ocupa la parte superior
        img.style.cssText = 'width: 100%; height: 100px; object-fit: cover; display: block;';
        
        const nombre = document.createElement('div');
        nombre.innerText = blob.name || 'imagen.png';
        // Nombre debajo de la imagen
        nombre.style.cssText = 'font-size: 10px; text-align: center; color: #666; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%; padding: 2px 0;';
        
        const btnDelete = document.createElement('button');
        btnDelete.innerHTML = '&times;';
        btnDelete.type = 'button';
        // X posicionada absolutamente sobre la imagen
        btnDelete.style.cssText = 'position: absolute; top: 5px; right: 5px; background: rgba(255, 0, 0, 0.9); color: white; border: none; border-radius: 50%; width: 22px; height: 22px; cursor: pointer; font-size: 16px; line-height: 1; z-index: 10;';
        
        btnDelete.onclick = () => {
            document.getElementById('galeria').removeChild(card);
            archivosParaEnviar = archivosParaEnviar.filter(archivo => archivo !== blob);
        };

        card.appendChild(btnDelete);
        card.appendChild(img);
        card.appendChild(nombre);
        document.getElementById('galeria').appendChild(card);
    };
    reader.readAsDataURL(blob);
}

// ==========================================
// EVENTO PASTE (Ctrl + V) - EN EL TEXTAREA
// ==========================================
document.getElementById('txttext').addEventListener('paste', function(e) {
    const items = e.clipboardData.items;
    
    for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
            e.preventDefault();
            const blob = items[i].getAsFile();
            agregarImagen(blob);
        }
    }
});

// ==========================================
// EVENTO INPUT FILE (Seleccionar archivos)
// ==========================================
document.getElementById('inputFile').addEventListener('change', function(e) {
    const files = e.target.files;
    
    for (let i = 0; i < files.length; i++) {
        if (files[i].type.indexOf('image') !== -1) {
            agregarImagen(files[i]);
        }
    }
    
    e.target.value = '';
});