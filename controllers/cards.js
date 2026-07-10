const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Error' }));
};

module.exports.createCard = (req, res) => {
  // console.log(req.user._id);
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      console.log(err.name);
      if (err.name === 'ValidationError') {
        const ERROR_CODE = 400;
        return res.status(ERROR_CODE).send({
          message: err.message,
        });
      }
      return res.status(500).send({ message: 'Error' });
    });
};

module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndDelete(req.params.id)
    .orFail(() => {
      const error = new Error('No se encontró ninguna tarjeta con ese ID');
      error.statusCode = 404;
      throw error;
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      // console.log(err.statusCode, err.name, err.message);

      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'ID de tarjeta inválido' });
      }

      if (err.statusCode) {
        return res.status(err.statusCode).send({ message: err.message });
      }

      return res.status(500).send({ message: 'Error' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $addToSet: { likes: req.user._id },
    },
    { returnDocument: 'after' }
  )
    .orFail()
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      console.log(err.name);

      if (err.name === 'CastError') {
        const msg = `La tarjeta con id: ${req.params.cardId} no existe`;
        return res.status(404).send({ message: msg });
      }

      return res.status(500).send({ message: 'Error' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $pull: { likes: req.user._id },
    },
    { returnDocument: 'after' }
  )
    .orFail()
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      console.log(err.name);

      if (err.name === 'CastError') {
        const msg = `La tarjeta con id: ${req.params.cardId} no existe`;
        return res.status(404).send({ message: msg });
      }

      return res.status(500).send({ message: 'Error' });
    });
};
