const router = require('express').Router();
const fs = require('fs');
const path = require('path');

router.get('/cards', (req, res) => {
  const dataPath = path.join(__dirname, '../data/cards.json');
  fs.readFile(dataPath, { encoding: 'utf-8' }, (err, data) => {
    if (err) {
      return res.send(err);
    }
    return res.send(JSON.parse(data));
  });
});

module.exports = router;
