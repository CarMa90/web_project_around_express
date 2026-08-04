const express = require('express');
const mongoose = require('mongoose');
const cardsRoutes = require('./routes/cards');
const usersRoutes = require('./routes/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

mongoose
  .connect('mongodb://localhost:27017/aroundb')
  .catch((err) => console.error('Error de conexión a MongoDB:', err));

const { PORT = 3000 } = process.env;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '6a4f9f5b4cbad006f57f037d',
  };

  next();
});

app.use(requestLogger);

app.use('/users', usersRoutes);

app.use('/cards', cardsRoutes);

app.use((req, res) => {
  res.status(404).send({
    mensaje: 'Recurso solicitado no encontrado',
  });
});

app.use(errorLogger);

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message:
      statusCode === 500 ? 'Se ha producido un error en el servidor.' : message,
  });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
