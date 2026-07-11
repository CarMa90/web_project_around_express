const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Error' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      const error = new Error('No se encontró ningún usuario con ese ID');
      error.statusCode = 404;
      throw error;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      // console.log(err.name, err.message);

      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'ID de usuario invalido' });
      }

      if (err.statusCode) {
        return res.status(err.statusCode).send({ message: err.message });
      }

      return res.status(500).send({ message: 'Error' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  // console.log(req.body);

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
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

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { returnDocument: 'after', runValidators: true, upsert: false },
  )
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      // console.log(err.name, err.message);

      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: err.message });
      }

      if (err.name === 'DocumentNotFoundError') {
        return res.status(404).send({ message: err.message });
      }

      return res.status(500).send({ message: 'Error' });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { returnDocument: 'after', runValidators: true, upsert: false },
  )
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      // console.log(err.name);

      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: err.message });
      }

      if (err.name === 'DocumentNotFoundError') {
        return res.status(404).send({ message: err.message });
      }

      return res.status(500).send({ message: 'Error' });
    });
};
