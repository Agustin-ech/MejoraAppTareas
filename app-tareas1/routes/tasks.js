const express = require("express");
const router = express.Router();
const db = require("../database");

// Crear tarea
router.post("/", (req, res) => {
  const { title, user_id } = req.body;

  db.run(
    "INSERT INTO tasks(title, user_id) VALUES(?, ?)",
    [title, user_id],
    function(err) {
      if (err) return res.send(err);
      res.send({ id: this.lastID, title, user_id });
    }
  );
});

// Obtener tareas con usuario (JOIN)
router.get("/", (req, res) => {
  db.all(`
    SELECT tasks.id, tasks.title, users.name
    FROM tasks
    JOIN users ON tasks.user_id = users.id
  `, [], (err, rows) => {
    res.send(rows);
  });
});

// Editar tarea
router.put("/:id", (req, res) => {
  const { title } = req.body;
  const { id } = req.params;

  db.run(
    "UPDATE tasks SET title = ? WHERE id = ?",
    [title, id],
    function(err) {
      if (err) return res.send(err);
      res.send({ message: "Tarea actualizada" });
    }
  );
});
// Buscar tareas por id o título
router.get("/search", (req, res) => {
  const { id, title } = req.query; 
  let query = `
    SELECT tasks.id, tasks.title, users.name 
    FROM tasks 
    JOIN users ON tasks.user_id = users.id 
    WHERE 1=1
  `;
  let params = [];

  if (id) {
    query += " AND tasks.id = ?";
    params.push(id);
  }

  if (title) {
    query += " AND tasks.title LIKE ?";
    params.push(`%${title}%`);
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.send(rows);
  });
});
module.exports = router;