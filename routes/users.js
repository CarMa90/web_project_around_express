const router = require('express').Router();
const fs = require('fs');
const path = require('path');

router.get('/users', (req, res) => {
  const dataPath = path.join(__dirname, '../data/users.json');
  fs.readFile(dataPath, { encoding: 'utf-8' }, (err, data) => {
    if (err) {
      res.send(err);
    }
    return res.send(JSON.parse(data));
  });
});

router.get('/users/:id', (req, res) => {
  const { id } = req.params;
  const dataPath = path.join(__dirname, '../data/users.json');
  fs.readFile(dataPath, { encoding: 'utf-8' }, (err, data) => {
    if (err) {
      res.send(err);
    }
    const users = JSON.parse(data);
    const user = users.find((u) => u._id === id);
    if (user) {
      return res.send(user);
    }
    return res.status(404).send({ message: 'ID de usuario no encontrado' });
  });
});

module.exports = router;
