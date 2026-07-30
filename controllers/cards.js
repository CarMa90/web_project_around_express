const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .orFail(() => {
      const error = new NotFoundError(
        'No fue posible encontrar los elementos buscados',
      );
      throw error;
    })
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      next(err);
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
      }
      next(err);
    });
};

module.exports.deleteCardById = (req, res, next) => {
  Card.findByIdAndDelete(req.params.cardId)
    .orFail(() => {
      const error = new NotFoundError(
        'No se encontró ninguna tarjeta con ese ID',
      );
      throw error;
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('ID de tarjeta inválido'));
      }

      next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $addToSet: { likes: req.user._id },
    },
    { returnDocument: 'after' },
  )
    .orFail(() => {
      const error = new NotFoundError(
        `La tarjeta con id: ${req.params.cardId} no existe`,
      );
      throw error;
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(`El id: ${req.params.cardId} no es válido`));
      }

      next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $pull: { likes: req.user._id },
    },
    { returnDocument: 'after' },
  )
    .orFail(() => {
      const error = new NotFoundError(
        `La tarjeta con id: ${req.params.cardId} no existe`,
      );
      throw error;
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(`El id: ${req.params.cardId} no es válido`));
      }

      next(err);
    });
};
