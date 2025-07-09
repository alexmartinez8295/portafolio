const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'mydb.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al abrir la base de datos:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite.');

    db.serialize(() => {
      // Tabla de Proyectos
      db.run(`CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        imageUrl TEXT,
        projectUrl TEXT
      )`, (err) => {
        if (err) console.error('Error al crear la tabla projects:', err.message);
        else console.log('Tabla projects creada o ya existe.');
      });

      // Tabla de Blog Posts
      db.run(`CREATE TABLE IF NOT EXISTS blog_posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT,
        author TEXT,
        date TEXT
      )`, (err) => {
        if (err) console.error('Error al crear la tabla blog_posts:', err.message);
        else console.log('Tabla blog_posts creada o ya existe.');
      });

      // Tabla de Experiencia
      db.run(`CREATE TABLE IF NOT EXISTS experience (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        company TEXT,
        startDate TEXT,
        endDate TEXT,
        description TEXT
      )`, (err) => {
        if (err) console.error('Error al crear la tabla experience:', err.message);
        else console.log('Tabla experience creada o ya existe.');
      });

      // Tabla de Forum Posts
      db.run(`CREATE TABLE IF NOT EXISTS forum_posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT,
        author TEXT,
        date TEXT
      )`, (err) => {
        if (err) console.error('Error al crear la tabla forum_posts:', err.message);
        else console.log('Tabla forum_posts creada o ya existe.');
      });

      // Tabla de Mensajes de Contacto
      db.run(`CREATE TABLE IF NOT EXISTS contact_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        message TEXT,
        date TEXT
      )`, (err) => {
        if (err) console.error('Error al crear la tabla contact_messages:', err.message);
        else console.log('Tabla contact_messages creada o ya existe.');
      });

      // Nueva Tabla para Contenido del Home
      db.run(`CREATE TABLE IF NOT EXISTS home_content (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        section_name TEXT UNIQUE NOT NULL,
        content TEXT,
        imageUrl TEXT,
        videoUrl TEXT
      )`, (err) => {
        if (err) console.error('Error al crear la tabla home_content:', err.message);
        else console.log('Tabla home_content creada o ya existe.');
      });

      // Opcional: Insertar algunos datos de ejemplo para las nuevas tablas
      db.run(`INSERT OR IGNORE INTO blog_posts (id, title, content, author, date) VALUES
        (1, 'Mi Primer Post', 'Este es el contenido de mi primer post de blog.', 'Alexis Martínez', '2025-07-08')
      `);
      db.run(`INSERT OR IGNORE INTO experience (id, title, company, startDate, endDate, description) VALUES
        (1, 'Desarrollador Full-Stack', 'Tech Solutions Inc.', '2022-01-01', 'Presente', 'Desarrollo de aplicaciones web con React y Node.js.')
      `);
      db.run(`INSERT OR IGNORE INTO forum_posts (id, title, content, author, date) VALUES
        (1, 'Pregunta sobre Next.js', '¿Cuál es la mejor forma de manejar el estado global en Next.js?', 'Usuario123', '2025-07-08 10:00:00')
      `);
      db.run(`INSERT OR IGNORE INTO contact_messages (id, name, email, message, date) VALUES
        (1, 'Jane Doe', 'jane.doe@example.com', 'Me gustaría contactarte para un proyecto.', '2025-07-08 11:00:00')
      `);
      db.run(`INSERT OR IGNORE INTO home_content (section_name, content, imageUrl, videoUrl) VALUES
        ('hero_title', 'Alexis Martínez(alx.is.dev)', NULL, NULL),
        ('hero_subtitle', 'Full-Stack Developer', NULL, NULL),
        ('about_me', 'Desde que tuve mi primer contacto con una computadora, supe que quería entender cómo funcionaba todo lo que había detrás de la pantalla. Mi pasión por la programación me ha llevado a explorar diversos lenguajes, frameworks y arquitecturas, siempre con la curiosidad como motor.', NULL, NULL),
        ('hero_image', NULL, '/images/dev1.jpeg', NULL),
        ('hero_video', NULL, NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ')
      `);

    });

    db.close((err) => {
      if (err) {
        console.error('Error al cerrar la base de datos:', err.message);
      } else {
        console.log('Base de datos cerrada.');
      }
    });
  }
});
