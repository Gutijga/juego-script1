require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

// Configuración de CORS
const corsOptions = {
  origin: "https://juegoscript.netlify.app", // Solo permite solicitudes desde Netlify
  methods: "GET,POST",
  allowedHeaders: "Content-Type",
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Permitir preflight

app.use(express.json());

// Configurar conexión a la BD de Clever Cloud
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

// Ruta para guardar el código de la sala
app.post("/crear-sala", (req, res) => {
  const { codigo_sala } = req.body;

  const query = "INSERT INTO salas (codigo) VALUES (?)";
  db.query(query, [codigo_sala], (err) => {
    if (err) {
      console.error("❌ Error al insertar en la BD:", err);
      res.status(500).send("Error en el servidor");
    } else {
      res.status(200).send("✅ Sala creada correctamente");
    }
  });
});

// Iniciar el servidor en Clever Cloud
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
