const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        const regex =
          /^http(s)?:\/\/(www\.)?[-a-zA-Z0-9@:%\._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+\.~#?&//=]*)$/i;
        return regex.test(v);
      },
      message: (props) => `Lo sentimos ${props.value} no es un enlace válido.`,
    },
  },
});

module.exports = mongoose.model('User', userSchema);
