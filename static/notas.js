// Elements
const titulo = document.getElementById('txttitulo');
const msg = document.getElementById('txttext');
const list = document.getElementById('note-container');

const lupa = document.getElementById('lupa');
const searchbar = document.getElementById('search-bar');
const borrar = document.getElementById('borrar');
const salir = document.getElementById('salir');
const adminbtn = document.getElementById('adminbtn');

const notas = document.getElementById('notas');
const addnote = document.getElementById('addnote');
const editdiv = document.getElementById('editnote');
const permisosModal = document.getElementById('permisosnote');
const loading = document.getElementById('loading');
const cargademensajes = document.getElementById('cargademensajes');

const preview = document.getElementById('preview');
const previewimg = document.getElementById('previewimg');

const fecha = new Date();
const hoy = `${fecha.getUTCDate()}/${fecha.getUTCMonth()+1}/${fecha.getFullYear()}`;

// Determinar el usuario y rol actual desde la sesión
const currentUser = localStorage.getItem('usuario') || (localStorage.getItem('rol') === 'admin' ? 'admin' : 'invitado');
const currentRol = localStorage.getItem('rol') || 'user';

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('sesion') === hoy){
        console.log('Registered');
    } else {
        window.location.href = 'inicio.html';
    }

    // Mostrar el botón de gestión de usuarios ÚNICAMENTE si es admin
    if (currentRol === 'admin' && adminbtn) {
        adminbtn.style.display = 'flex';
        adminbtn.addEventListener('click', () => {
            window.location.href = 'admin.html';
        });
    }

    if (cargademensajes) {
        loading.style.display = 'flex';
    }
});

// Realtime Database y Firestore Config
const firebaseConfig = {
    apiKey: "AIzaSyDOHimOH-Tew8I62OrIfh-aHlE1juOZ2NA",
    authDomain: "database-3c232.firebaseapp.com",
    databaseURL: "https://database-3c232-default-rtdb.firebaseio.com",
    projectId: "database-3c232",
    storageBucket: "database-3c232.firebasestorage.app",
    messagingSenderId: "591401839388",
    appId: "1:591401839388:web:14afcbc9f38fa52e1468d9"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const firestore = firebase.firestore();

let notaActualPermisosKey = null;

// Escuchar notas en tiempo real
db.ref('notas').on('value', (data) => {
    list.innerHTML = "";
    const datos = data.val();
    if (datos) {
        Object.entries(datos).toReversed().forEach(([key, val]) => {
            const cont = document.createElement('details');
            const txttit = document.createElement('summary');
            txttit.style = 'text-decoration: underline;';
            const txtmd = document.createElement('p');
            const strong = document.createElement('strong');
            cont.className = 'content-note';

            // Arreglo de permisos: si no existe, es []
            const usuariosPermitidos = val.permisos || [];

            // RESTRICCIÓN ESTRICTA:
            // Solo tiene acceso si es 'admin' o si su nombre de usuario está explícitamente listado.
            const tieneAcceso = (currentRol === 'admin') || usuariosPermitidos.includes(currentUser);

            if (tieneAcceso) {
                // ================= ACCESO PERMITIDO =================
                strong.textContent = `${val.title}`;
                txtmd.textContent = `${val.note}`;

                cont.appendChild(txttit);
                txttit.appendChild(strong);
                cont.appendChild(txtmd);

                // Mostrar imágenes
                if (val.imagenes && val.imagenes.length > 0) {
                    const imgContainer = document.createElement('div');
                    imgContainer.style = 'display: flex; flex-wrap: wrap; gap: 10px; margin: 10px 0;';

                    val.imagenes.forEach(imgSrc => {
                        const img = document.createElement('img');
                        img.src = imgSrc;
                        img.style = 'max-width: 200px; max-height: 200px; border-radius: 10px; border: 1px solid #ddd; cursor: pointer; transition: transform 0.2s;';
                        img.onclick = function() {
                            preview.style.display = 'flex';
                            previewimg.src = imgSrc;
                        };
                        imgContainer.appendChild(img);
                    });
                    cont.appendChild(imgContainer);
                }

                // Botones de acción
                const actionsContainer = document.createElement('div');
                actionsContainer.style = 'display: flex; gap: 6px; margin-top: 8px; flex-wrap: wrap;';

                const delbtn = document.createElement('button');
                delbtn.textContent = 'Eliminar';
                delbtn.className = 'btn-tarjeta-eliminar';
                delbtn.onclick = function() {
                    if (confirm('Vas a eliminar este elemento para siempre, ¿Continuar?')) {
                        db.ref('/notas/' + key).remove();
                    }
                };

                const editbtn = document.createElement('button');
                editbtn.textContent = 'Editar';
                editbtn.className = 'btn-tarjeta-editar';
                editbtn.onclick = function() {
                    editar(key, val.title, val.note, val.imagenes || []);
                };

                actionsContainer.appendChild(delbtn);
                actionsContainer.appendChild(editbtn);

                // Botón Administrador
                if (currentRol === 'admin') {
                    const permBtn = document.createElement('button');
                    permBtn.textContent = '🔑 Permisos';
                    permBtn.className = 'btn-tarjeta-editar';
                    permBtn.style.background = "linear-gradient(135deg, rgba(255, 183, 0, 0.6), rgba(255, 255, 255, 0.2), rgba(255, 130, 0, 0.6))";
                    permBtn.style.border = "1px solid rgba(255, 145, 0, 0.4)";
                    permBtn.onclick = function() {
                        abrirGestorPermisos(key, usuariosPermitidos);
                    };
                    actionsContainer.appendChild(permBtn);
                }

                cont.appendChild(actionsContainer);

            } else {
                // ================= ACCESO DENEGADO =================
                strong.textContent = `⛔ Acceso denegado`;
                txtmd.textContent = `No tienes permisos para ver el contenido de esta nota.`;
                cont.appendChild(txttit);
                txttit.appendChild(strong);
                cont.appendChild(txtmd);
            }

            list.appendChild(cont);
        });
        if (loading) loading.style.display = 'none';
    } else {
        if (loading) loading.style.display = 'none';
    }
});

// Función de creación del checkbox ajustada al nuevo diseño CSS
function crearCheckboxUsuario(nombreUsuario, marcado) {
    const label = document.createElement('label');
    label.className = 'permisos-user-label';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = nombreUsuario;
    checkbox.checked = marcado;
    checkbox.className = 'chk-permiso-user permisos-user-checkbox';

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(nombreUsuario));
    return label;
}

// ==========================================
// GESTIÓN DE PERMISOS (SOLO ADMIN)
// ==========================================
// Listener para filtrar usuarios en el modal de permisos
document.getElementById('buscar-usuario-permiso')?.addEventListener('input', (e) => {
    const filtro = e.target.value.toLowerCase().trim();
    const labels = document.querySelectorAll('#permisos-lista-usuarios .permisos-user-label');

    labels.forEach(label => {
        const nombreUsuario = label.textContent.toLowerCase();
        if (nombreUsuario.includes(filtro)) {
            label.style.display = 'flex';
        } else {
            label.style.display = 'none';
        }
    });
});

async function abrirGestorPermisos(noteKey, permisosActuales) {
    notaActualPermisosKey = noteKey;
    const listaDiv = document.getElementById('permisos-lista-usuarios');
    const inputBuscar = document.getElementById('buscar-usuario-permiso');
    
    if (inputBuscar) inputBuscar.value = ''; // Limpiar campo de búsqueda
    listaDiv.innerHTML = '<span>Cargando usuarios...</span>';
    permisosModal.style.display = 'flex';

    try {
        const snapshot = await firestore.collection('dashusers').get();
        listaDiv.innerHTML = '';

        let contadorUsuarios = 0;

        snapshot.forEach(doc => {
            const uData = doc.data();
            const uName = uData.usuario;
            // Solo carga usuarios reales existentes en Firestore
            if (uName) {
                const item = crearCheckboxUsuario(uName, permisosActuales.includes(uName));
                listaDiv.appendChild(item);
                contadorUsuarios++;
            }
        });

        if (contadorUsuarios === 0) {
            listaDiv.innerHTML = '<span style="color: rgba(255,255,255,0.6); font-size: 13px;">No hay usuarios registrados.</span>';
        }
    } catch (e) {
        console.error("Error al obtener lista de usuarios:", e);
        listaDiv.innerHTML = '<span style="color: #ff6b6b;">Error al cargar usuarios</span>';
    }
}

document.getElementById('btn-guardar-permisos')?.addEventListener('click', async () => {
    if (!notaActualPermisosKey) return;
    const checkboxes = document.querySelectorAll('.chk-permiso-user');
    const seleccionados = [];

    checkboxes.forEach(chk => {
        if (chk.checked) seleccionados.push(chk.value);
    });

    try {
        await db.ref('/notas/' + notaActualPermisosKey).update({
            permisos: seleccionados
        });
        cerrarPermisos();
    } catch (e) {
        console.error("Error al guardar permisos:", e);
        alert("Error al actualizar permisos");
    }
});

function cerrarPermisos() {
    permisosModal.style.display = 'none';
    notaActualPermisosKey = null;
    const inputBuscar = document.getElementById('buscar-usuario-permiso');
    if (inputBuscar) inputBuscar.value = '';
}

// Preview Functions
function delPreview() {
    previewimg.src = '';
    preview.style.display = 'none';
}

async function descargarImagen() {
    const img = document.getElementById('previewimg');
    const src = img.src;

    try {
        const response = await fetch(src);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const enlace = document.createElement('a');
        enlace.href = url;
        enlace.download = 'descarga.jpg';
        document.body.appendChild(enlace);
        enlace.click();
        document.body.removeChild(enlace);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error al descargar:', error);
        alert('No se pudo descargar la imagen');
    }
}

// Búsqueda de Notas
document.addEventListener('DOMContentLoaded', () => {
    const inputBuscador = document.getElementById('buscador');
    const form = inputBuscador ? inputBuscador.closest('form') : null;

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            buscarTexto();
        });
    }

    if (inputBuscador) {
        inputBuscador.addEventListener('input', buscarTexto);
    }
});

function buscarTexto() {
    const input = document.getElementById('buscador');
    if (!input) return;

    const filter = input.value.trim().toLowerCase();
    const container = list;
    if (!container) return;

    const detailsList = container.querySelectorAll('details.content-note');

    detailsList.forEach(details => {
        const summary = details.querySelector('summary');
        const contentDivs = details.querySelectorAll('p');

        let summaryText = summary ? summary.textContent.toLowerCase() : '';
        let contentText = '';

        contentDivs.forEach(div => {
            contentText += div.textContent.toLowerCase();
        });

        if (summaryText.includes(filter) || contentText.includes(filter)) {
            details.style.display = '';
        } else {
            details.style.display = 'none';
        }
    });
}

// Lupa
borrar?.addEventListener('click', () => {
    if (document.getElementById('buscador')) document.getElementById('buscador').value = '';
    buscarTexto();
});

lupa?.addEventListener('click', () => {
    if (searchbar.style.display === 'flex') {
        searchbar.style.animation = 'outro1 0.3s ease';
        setTimeout(() => {
            searchbar.style.animation = 'none';
            searchbar.style.display = 'none';
        }, 200);
    } else {
        searchbar.style.animation = 'intro1 0.3s ease';
        searchbar.style.display = 'flex';
        document.getElementById('buscador')?.focus();
        setTimeout(() => {
            searchbar.style.animation = 'none';
        }, 200);
    }
});

notas?.addEventListener('click', () => {
    Alternar(addnote, editdiv);
});

function Alternar(pantalla, pantalla2) {
    if (pantalla.style.display === 'flex') {
        pantalla.style.animation = 'outro2 0.3s ease';
        setTimeout(() => {
            pantalla.style.animation = 'none';
            pantalla.style.display = 'none';
        }, 200);
    } else {
        pantalla.style.animation = 'intro2 0.3s ease';
        pantalla.style.display = 'flex';
        setTimeout(() => {
            pantalla.style.animation = 'none';
        }, 200);
        if (pantalla2 && pantalla2.style.display === 'flex') {
            pantalla2.style.animation = 'outro2 0.3s ease';
            setTimeout(() => {
                pantalla2.style.animation = 'none';
                pantalla2.style.display = 'none';
            }, 200);
        }
    }
}

salir?.addEventListener('click', () => {
    window.location.href = 'inicio.html';
});

// Editar Nota
let archivosEditar = [];
let imagenesExistentes = [];

function editar(key, titulo, texto, imagenes = []) {
    Alternar(editdiv, addnote);

    document.getElementById('edittitulo').value = titulo;
    document.getElementById('edittext').value = texto;

    editdiv.className = key;
    imagenesExistentes = imagenes || [];

    archivosEditar = [];
    document.getElementById('editgaleria').innerHTML = '';

    if (imagenesExistentes.length > 0) {
        imagenesExistentes.forEach((imgSrc, index) => {
            mostrarImagenExistente(imgSrc, index);
        });
    }
}

function mostrarImagenExistente(imgSrc, index) {
    const card = document.createElement('div');
    card.style.cssText = 'position: relative; width: 100px; height: 120px; border: 1px solid #ddd; border-radius: 5px; overflow: hidden; display: inline-block; margin: 5px; background: #fff;';

    const img = document.createElement('img');
    img.src = imgSrc;
    img.style.cssText = 'width: 100%; height: 100px; object-fit: cover; display: block;';

    const nombre = document.createElement('div');
    nombre.innerText = 'imagen_' + (index + 1) + '.png';
    nombre.style.cssText = 'font-size: 10px; text-align: center; color: #666; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%; padding: 2px 0;';

    const btnDelete = document.createElement('button');
    btnDelete.innerHTML = '&times;';
    btnDelete.type = 'button';
    btnDelete.style.cssText = 'position: absolute; top: 5px; right: 5px; background: rgba(255, 0, 0, 0.9); color: white; border: none; border-radius: 50%; width: 22px; height: 22px; cursor: pointer; font-size: 16px; line-height: 1; z-index: 10;';

    btnDelete.onclick = () => {
        document.getElementById('editgaleria').removeChild(card);
        imagenesExistentes = imagenesExistentes.filter((_, i) => i !== index);
    };

    card.appendChild(btnDelete);
    card.appendChild(img);
    card.appendChild(nombre);
    document.getElementById('editgaleria').appendChild(card);
}

function agregarImagenEditar(blob) {
    archivosEditar.push(blob);
    mostrarVistaPreviaEditar(blob);
}

function mostrarVistaPreviaEditar(blob) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const card = document.createElement('div');
        card.style.cssText = 'position: relative; width: 100px; height: 120px; border: 1px solid #00ff00; border-radius: 5px; overflow: hidden; display: inline-block; margin: 5px; background: #fff;';

        const img = document.createElement('img');
        img.src = e.target.result;
        img.style.cssText = 'width: 100%; height: 100px; object-fit: cover; display: block;';

        const nombre = document.createElement('div');
        nombre.innerText = 'NUEVA: ' + (blob.name || 'imagen.png');
        nombre.style.cssText = 'font-size: 10px; text-align: center; color: #00aa00; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%; padding: 2px 0;';

        const btnDelete = document.createElement('button');
        btnDelete.innerHTML = '&times;';
        btnDelete.type = 'button';
        btnDelete.style.cssText = 'position: absolute; top: 5px; right: 5px; background: rgba(255, 0, 0, 0.9); color: white; border: none; border-radius: 50%; width: 22px; height: 22px; cursor: pointer; font-size: 16px; line-height: 1; z-index: 10;';

        btnDelete.onclick = () => {
            document.getElementById('editgaleria').removeChild(card);
            archivosEditar = archivosEditar.filter(archivo => archivo !== blob);
        };

        card.appendChild(btnDelete);
        card.appendChild(img);
        card.appendChild(nombre);
        document.getElementById('editgaleria').appendChild(card);
    };
    reader.readAsDataURL(blob);
}

function seditar() {
    if (loading) loading.style.display = 'flex';
    const key = editdiv.className;
    const title = document.getElementById('edittitulo').value.trim();
    const note = document.getElementById('edittext').value.trim();

    if (title && note) {
        if (archivosEditar.length > 0) {
            convertirImagenesEditar(key, title, note);
        } else {
            actualizarNotaFirebase(key, title, note, imagenesExistentes);
        }
    }
}

function convertirImagenesEditar(key, title, note) {
    const nuevasImagenesBase64 = [];

    const promesas = archivosEditar.map(archivo => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                nuevasImagenesBase64.push(e.target.result);
                resolve(e.target.result);
            };
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(archivo);
        });
    });

    Promise.all(promesas)
        .then(() => {
            const todasImagenes = [...imagenesExistentes, ...nuevasImagenesBase64];
            actualizarNotaFirebase(key, title, note, todasImagenes);
        })
        .catch((error) => {
            console.error('Error en la conversión:', error);
            alert('Error al procesar las imágenes');
        });
}

function actualizarNotaFirebase(key, title, note, imagenes) {
    db.ref('/notas/' + key).update({
        title: title,
        note: note,
        imagenes: imagenes,
        cantidadImagenes: imagenes.length
    })
    .then(() => {
        document.getElementById('edittitulo').value = '';
        document.getElementById('edittext').value = '';
        document.getElementById('editinputFile').value = '';
        archivosEditar = [];
        imagenesExistentes = [];
        document.getElementById('editgaleria').innerHTML = '';

        Alternar(editdiv);
        if (loading) loading.style.display = 'none';
    })
    .catch((error) => {
        console.error('Error al actualizar nota:', error);
        alert('Error al actualizar la nota');
    });
}

document.getElementById('edittext')?.addEventListener('paste', function(e) {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
            e.preventDefault();
            const blob = items[i].getAsFile();
            agregarImagenEditar(blob);
        }
    }
});

document.getElementById('editinputFile')?.addEventListener('change', function(e) {
    const files = e.target.files;
    for (let i = 0; i < files.length; i++) {
        if (files[i].type.indexOf('image') !== -1) {
            agregarImagenEditar(files[i]);
        }
    }
    e.target.value = '';
});

// Crear Nota Nueva
let archivosParaEnviar = [];

function subir() {
    if (loading) loading.style.display = 'flex';
    const title = document.getElementById('txttitulo').value.trim();
    const note = document.getElementById('txttext').value.trim();

    if (title && note) {
        if (archivosParaEnviar.length > 0) {
            convertirImagenesYGuardarNota(title, note);
        } else {
            guardarNotaEnFirebase(title, note, []);
        }
    }
}

function convertirImagenesYGuardarNota(title, note) {
    const imagenesBase64 = [];
    const promesas = archivosParaEnviar.map(archivo => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagenesBase64.push(e.target.result);
                resolve(e.target.result);
            };
            reader.onerror = (error) => reject(error);
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

function guardarNotaEnFirebase(title, note, imagenesBase64) {
    // Asignar permisos iniciales al creador de la nota
    const permisosIniciales = currentUser !== 'admin' && currentUser !== 'invitado' ? [currentUser] : [];

    db.ref('notas').push({
        title: title,
        note: note,
        imagenes: imagenesBase64,
        fecha: firebase.database.ServerValue.TIMESTAMP,
        cantidadImagenes: imagenesBase64.length,
        permisos: permisosIniciales
    })
    .then(() => {
        document.getElementById('txttitulo').value = '';
        document.getElementById('txttext').value = '';
        document.getElementById('inputFile').value = '';
        archivosParaEnviar = [];
        document.getElementById('galeria').innerHTML = '';

        Alternar(addnote);
        if (loading) loading.style.display = 'none';
    })
    .catch((error) => {
        console.error('Error al guardar nota:', error);
    });
}

function agregarImagen(blob) {
    archivosParaEnviar.push(blob);
    mostrarVistaPrevia(blob);
}

function mostrarVistaPrevia(blob) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const card = document.createElement('div');
        card.style.cssText = 'position: relative; width: 100px; height: 120px; border: 1px solid #ddd; border-radius: 5px; overflow: hidden; display: inline-block; margin: 5px; background: #fff;';

        const img = document.createElement('img');
        img.src = e.target.result;
        img.style.cssText = 'width: 100%; height: 100px; object-fit: cover; display: block;';

        const nombre = document.createElement('div');
        nombre.innerText = blob.name || 'imagen.png';
        nombre.style.cssText = 'font-size: 10px; text-align: center; color: #666; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%; padding: 2px 0;';

        const btnDelete = document.createElement('button');
        btnDelete.innerHTML = '&times;';
        btnDelete.type = 'button';
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

document.getElementById('txttext')?.addEventListener('paste', function(e) {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
            e.preventDefault();
            const blob = items[i].getAsFile();
            agregarImagen(blob);
        }
    }
});

document.getElementById('inputFile')?.addEventListener('change', function(e) {
    const files = e.target.files;
    for (let i = 0; i < files.length; i++) {
        if (files[i].type.indexOf('image') !== -1) {
            agregarImagen(files[i]);
        }
    }
    e.target.value = '';
});

// Hacer pública la función cerrarPermisos para invocaciones globales desde HTML
window.cerrarPermisos = cerrarPermisos;