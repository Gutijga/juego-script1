require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

// 🔹 Configurar CORS para permitir solicitudes desde Netlify
app.use(cors({ origin: "https://juegoscript.netlify.app", credentials: true }));

// 🔹 Configurar headers CORS manualmente
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://juegoscript.netlify.app");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(express.json()); // Middleware para procesar JSON

// 🔹 Configurar conexión a la BD de Clever Cloud
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("❌ Error al conectar la BD:", err);
  } else {
    console.log("✅ Conectado a la base de datos.");
  }
});

// 🔹 Ruta principal para comprobar que el servidor está activo
app.get("/", (req, res) => {
  res.send("🚀 Servidor funcionando correctamente");
});

// 🔹 Ruta para crear una sala en la base de datos
app.post("/crear-sala", (req, res) => {
  const { codigo_sala } = req.body;

  if (!codigo_sala) {
    return res.status(400).json({ error: "El código de sala es obligatorio" });
  }

  const query = "INSERT INTO salas (codigo) VALUES (?)";
  db.query(query, [codigo_sala], (err) => {
    if (err) {
      console.error("❌ Error al insertar en la BD:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    res.status(200).json({ mensaje: "✅ Sala creada correctamente" });
  });
});

// 🔹 Iniciar el servidor en Clever Cloud
const PORT = process.env.PORT || 3306;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
