const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'mydb.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al abrir la base de datos:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite.');
    db.run(`CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      imageUrl TEXT,
      projectUrl TEXT
    )`, (err) => {
      if (err) {
        console.error('Error al crear la tabla projects:', err.message);
      } else {
        console.log('Tabla projects creada o ya existe.');
        // Opcional: Insertar algunos datos de ejemplo
        db.run(`INSERT OR IGNORE INTO projects (id, title, description, imageUrl, projectUrl) VALUES
          (1, 'Mi Primer Proyecto', 'Una descripción de mi primer proyecto.', '/images/pic01.jpg', 'https://ejemplo.com/proyecto1'),
          (2, 'Proyecto de Desarrollo Web', 'Un proyecto full-stack con React y Node.js.', '/images/pic02.jpg', 'https://ejemplo.com/proyecto2')
        `, (err) => {
          if (err) {
            console.error('Error al insertar datos de ejemplo:', err.message);
          } else {
            console.log('Datos de ejemplo insertados o ya existen.');
          }
        });
      }
    });
  }
});

db.close((err) => {
  if (err) {
    console.error('Error al cerrar la base de datos:', err.message);
  } else {
    console.log('Base de datos cerrada.');
  }
});
