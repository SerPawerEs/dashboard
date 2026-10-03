// Importaciones de Firebase desde CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Configuración de Firebase
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

// Credenciales fijas del Admin
const ADMIN_USER = "srgops";
const ADMIN_PASS = "sp25565";

// Elementos del DOM
const usuarioInput = document.getElementById('usuario');
const contraseñaInput = document.getElementById('contraseña');
const joinform = document.getElementById('joinform');
const container = document.getElementById('container');
const salir = document.getElementById('salir');
const notas = document.getElementById('notas');
const buscador = document.getElementById('buscador');
const borrar = document.getElementById('borrar');
const lupa = document.getElementById('lupa');
const searchbar = document.getElementById('search-bar');
const enlaces = document.querySelectorAll('a');

const fecha = new Date();
const hoy = `${fecha.getUTCDate()}/${fecha.getUTCMonth()+1}/${fecha.getFullYear()}`;

document.addEventListener('DOMContentLoaded', () => {
    verify();
    
    // Configurar enlaces para abrir en nueva pestaña
    enlaces.forEach(enlace => {
        enlace.target = '_blank';
    });

    // Escuchador formulario login
    if (joinform) {
        joinform.addEventListener('submit', acces);
    }

    // Escuchador cerrar sesión
    if (salir) {
        salir.addEventListener('click', () => {
            localStorage.removeItem('sesion');
            localStorage.removeItem('rol');
            if (usuarioInput) usuarioInput.value = '';
            if (contraseñaInput) contraseñaInput.value = '';
            verify();
        });
    }

    // Funcionalidad de la Lupa y Buscador de Enlaces
    if (lupa && searchbar) {
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
                if (buscador) buscador.focus();
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
            if (buscador) buscador.value = '';
            buscar();
        });
    }

    if (notas) {
        notas.addEventListener('click', () => {
            window.location.href = 'notas.html';
        });
    }
});

// Búsqueda de enlaces
function buscar() {
    if (!buscador) return;
    const termino = buscador.value.toLowerCase().trim();
    
    enlaces.forEach(enlace => {
        const texto = enlace.textContent.toLowerCase();
        if (texto.includes(termino)) {
            enlace.style.display = 'flex';
        } else {
            enlace.style.display = 'none';
        }
    });
}

// Verificación de estado de sesión
function verify() {
    const sesion = localStorage.getItem('sesion');
    const rol = localStorage.getItem('rol');
    const header = document.querySelector('header');
    const adminBtn = document.getElementById('adminbtn');

    if (sesion === hoy) {
        if (header) header.style.display = 'flex';
        if (container) container.style.display = 'flex';
        if (joinform) joinform.style.display = 'none';

        if (rol === 'admin' && adminBtn) {
            adminBtn.style.display = 'flex';
        } else if (adminBtn) {
            adminBtn.style.display = 'none';
        }
    } else {
        if (header) header.style.display = 'none';
        if (container) container.style.display = 'none';
        if (joinform) joinform.style.display = 'flex';
        if (adminBtn) adminBtn.style.display = 'none';
    }
}

// Acceso / Login
async function acces(event) {
    event.preventDefault();
    const userVal = usuarioInput.value.trim();
    const passVal = contraseñaInput.value.trim();

    if (userVal === ADMIN_USER && passVal === ADMIN_PASS) {
        localStorage.setItem('sesion', hoy);
        localStorage.setItem('rol', 'admin');
        verify();
        return;
    }

    try {
        const q = query(collection(db, "dashusers"), where("usuario", "==", userVal), where("contraseña", "==", passVal));
        const querySnapshot = await getDocs(q);

        // En static/scripts.js (dentro de acces):
        if (!querySnapshot.empty) {
            localStorage.setItem('sesion', hoy);
            localStorage.setItem('rol', 'user');
            localStorage.setItem('usuario', userVal); // <--- Guardar nombre de usuario
            verify();
        } else {
            alert('Usuario o contraseña incorrectos');
            contraseñaInput.value = '';
        }
    } catch (e) {
        console.error("Error al autenticar:", e);
        alert('Error de conexión con la base de datos');
    }
}

// Función global toggle para mostrar/ocultar contraseña
window.toggle = function() {
    if (contraseñaInput.type === 'text') {
        contraseñaInput.type = 'password';
    } else {
        contraseñaInput.type = 'text';
    }
};