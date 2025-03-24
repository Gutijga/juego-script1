require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

// Permitir solo solicitudes desde tu frontend en Netlify
const corsOptions = {
  origin: "https://juegoscript.netlify.app", // Reemplaza con la URL de tu frontend
  methods: "GET,POST",
  allowedHeaders: "Content-Type",
};
app.use(cors(corsOptions));
app.use(express.json());

// Configurar conexión a la BD de Clever Cloud
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// Verificar la conexión antes de iniciar el servidor
db.connect((err) => {
  if (err) {
    console.error("❌ Error al conectar la BD:", err);
    process.exit(1); // Salir si la BD no está conectada
  } else {
    console.log("✅ Conectado a la base de datos.");

    // Iniciar el servidor solo si la BD está conectada
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
    });
  }
});

// Ruta para guardar el código de la sala
app.post("/crear-sala", (req, res) => {
  const { codigo_sala } = req.body;

  if (!codigo_sala) {
    return res.status(400).json({ error: "❌ Código de sala requerido" });
  }

  const query = "INSERT INTO salas (codigo) VALUES (?)";
  db.query(query, [codigo_sala], (err) => {
    if (err) {
      console.error("❌ Error al insertar en la BD:", err);
      res.status(500).json({ error: "Error en el servidor" });
    } else {
      res.status(200).json({ message: "✅ Sala creada correctamente" });
    }
  });
});
