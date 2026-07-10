const express = require('express');
const mongoose = require('mongoose');
const cardsRoutes = require('./routes/cards');
const usersRoutes = require('./routes/users');

const app = express();

mongoose.connect('mongodb://localhost:27017/aroundb');

const { PORT = 3000 } = process.env;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '6a4f9f5b4cbad006f57f037d',
  };

  next();
});

app.use('/', usersRoutes);

app.use('/', cardsRoutes);

app.use((req, res) => {
  res.status(404).send({
    mensaje: 'Recurso solicitado no encontrado',
  });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
