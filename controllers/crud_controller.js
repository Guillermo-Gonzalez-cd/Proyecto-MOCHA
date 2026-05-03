const db = require('../config/db');

exports.create = (tabla) => (req, res) => {
  db.query(`INSERT INTO ${tabla} SET ?`, req.body, (err) => {
    if (err) return res.status(500).send(err);
    res.send(`${tabla} creado`);
  });
};

exports.getAll = (tabla) => (req, res) => {
  db.query(`SELECT * FROM ${tabla}`, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

exports.update = (tabla) => (req, res) => {
  db.query(`UPDATE ${tabla} SET ? WHERE id=?`, [req.body, req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.send(`${tabla} actualizado`);
  });
};

exports.remove = (tabla) => (req, res) => {
  db.query(`DELETE FROM ${tabla} WHERE id=?`, [req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.send(`${tabla} eliminado`);
  });
};

exports.getById = (tabla) => (req, res) => {
  db.query(
    `SELECT * FROM ${tabla} WHERE id=?`,
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).send(err);
      if (results.length === 0) {
        return res.status(404).send('No encontrado');
      }
      res.json(results[0]);
    }
  );
};