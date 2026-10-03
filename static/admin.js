import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDOHimOH-Tew8I62OrIfh-aHlE1juOZ2NA",
    authDomain: "database-3c232.firebaseapp.com",
    databaseURL: "https://database-3c232-default-rtdb.firebaseio.com",
    projectId: "database-3c232",
    storageBucket: "database-3c232.firebasestorage.app",
    messagingSenderId: "591401839388",
    appId: "1:591401839388:web:14afcbc9f38fa52e1468d9",
    measurementId: "G-T8KEKD4QJH"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const usersCol = collection(db, "dashusers");

// Elementos del DOM
const form = document.getElementById('user-form');
const userInput = document.getElementById('admin-user');
const passInput = document.getElementById('admin-pass');
const idInput = document.getElementById('user-id');
const list = document.getElementById('users-list');
const btnSave = document.getElementById('btn-save-user');

const salir = document.getElementById('salir');
const lupa = document.getElementById('lupa');
const searchbar = document.getElementById('search-bar');
const buscador = document.getElementById('buscador');
const borrar = document.getElementById('borrar');

// Proteger acceso: Redirigir si no es Admin
document.addEventListener('DOMContentLoaded', () => {
    const rol = localStorage.getItem('rol');
    if (rol !== 'admin') {
        window.location.href = 'index.html';
        return;
    }
    loadUsers();
});

// Redirigir al Inicio mediante el botón de la flecha / salir
if (salir) {
    salir.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
}

// Cargar y Renderizar Usuarios
async function loadUsers() {
    list.innerHTML = '';
    try {
        const snapshot = await getDocs(usersCol);
        snapshot.forEach(docSnap => {
            const data = docSnap.data();
            const div = document.createElement('div');
            div.className = 'user-card';
            div.dataset.username = data.usuario.toLowerCase();
            div.style.cssText = 'display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 8px; background: rgba(255,255,255,0.15); border-radius: var(--radius-sm); border: 1px solid var(--glass-border); color: white;';
            
            div.innerHTML = `
                <div style="display: flex; flex-direction: column; text-align: left; overflow: hidden; max-width: 60%;">
                    <span style="font-weight: 600; text-overflow: ellipsis; overflow: hidden;">${data.usuario}</span>
                    <span style="font-size: 11px; opacity: 0.7; text-overflow: ellipsis; overflow: hidden;">🔑 ${data.contraseña}</span>
                </div>
                <div style="display: flex; gap: 4px;">
                    <button class="btn-edit" style="background: rgba(255,255,255,0.2); border: none; color: white; border-radius: 6px; padding: 4px 8px; cursor: pointer;">✏️</button>
                    <button class="btn-delete" style="background: rgba(255,60,60,0.6); border: none; color: white; border-radius: 6px; padding: 4px 8px; cursor: pointer;">🗑️</button>
                </div>
            `;

            div.querySelector('.btn-edit').addEventListener('click', () => {
                idInput.value = docSnap.id;
                userInput.value = data.usuario;
                passInput.value = data.contraseña;
                btnSave.textContent = 'Actualizar Usuario';
            });

            div.querySelector('.btn-delete').addEventListener('click', async () => {
                if (confirm(`¿Eliminar al usuario "${data.usuario}"?`)) {
                    await deleteDoc(doc(db, "dashusers", docSnap.id));
                    loadUsers();
                }
            });

            list.appendChild(div);
        });
        buscar();
    } catch (e) {
        console.error("Error cargando usuarios:", e);
    }
}

// Crear o Modificar Usuario
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = idInput.value;
    const usuario = userInput.value.trim();
    const contraseña = passInput.value.trim();

    if (id) {
        await updateDoc(doc(db, "dashusers", id), { usuario, contraseña });
    } else {
        await addDoc(usersCol, { usuario, contraseña });
    }

    form.reset();
    idInput.value = '';
    btnSave.textContent = 'Guardar Usuario';
    loadUsers();
});

// Control de Barra de Búsqueda
if (lupa) {
    lupa.addEventListener('click', () => {
        if (searchbar.style.display === 'flex') {
            searchbar.style.animation = 'outro1 0.3s ease';
            setTimeout(() => {
                searchbar.style.animation = 'none';
                searchbar.style.display = 'none';
            }, 200);
        } else {
            searchbar.style.animation = 'intro1 0.3s ease';
            searchbar.style.display = 'flex';
            buscador.focus();
            setTimeout(() => {
                searchbar.style.animation = 'none';
            }, 200);
        }
    });
}

if (buscador) {
    buscador.addEventListener('input', buscar);
}

if (borrar) {
    borrar.addEventListener('click', () => {
        buscador.value = '';
        buscar();
    });
}

// Búsqueda en vivo filtrando tarjetas de usuario
function buscar() {
    if (!buscador) return;
    const termino = buscador.value.toLowerCase().trim();
    const userCards = document.querySelectorAll('.user-card');

    userCards.forEach(card => {
        const username = card.dataset.username || '';
        if (username.includes(termino)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}