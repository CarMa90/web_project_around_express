const express = require('express');
const cardsRoutes = require('./routes/cards');
const usersRoutes = require('./routes/users');

const app = express();

const { PORT = 3000 } = process.env;

app.use('/', usersRoutes);

app.use('/', cardsRoutes);

app.use((req, res) => {
  res.status(404).send({
    error: 'Ruta no encontrada',
    mensaje: 'Recurso solicitado no encontrado',
  });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
