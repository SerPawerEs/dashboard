require('dotenv').config();

const path = require('path');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
const APP_PASSWORD = process.env.APP_PASSWORD || '';

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(path.join(__dirname, 'static')));
app.use('/resources', express.static(path.join(__dirname, 'resources')));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/inicio', (req, res) => {
  res.render('inicio');
});

app.get('/notas', (req, res) => {
  res.render('notas');
});

app.get('/boards', (req, res) => {
  res.render('boards');
});

app.post('/auth', (req, res) => {
  const password = String(req.body.password || '').trim().toLowerCase();
  const expectedPassword = APP_PASSWORD.trim().toLowerCase();

  if (!expectedPassword) {
    return res.status(500).json({ ok: false, message: 'APP_PASSWORD no esta configurada' });
  }

  return res.json({ ok: password === expectedPassword });
});

const server = app.listen(PORT, () => {
  console.log(`Servidor listo en http://localhost:${PORT}`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`El puerto ${PORT} ya esta en uso. Cierra el servidor anterior o cambia PORT en .env.`);
    process.exit(1);
  }

  throw error;
});
