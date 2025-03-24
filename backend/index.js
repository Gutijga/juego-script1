require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

// Configuración de CORS
const corsOptions = {
  origin: "https://juegoscript.netlify.app", // Sin "/frontend/"
  methods: "GET,POST,OPTIONS",
  allowedHeaders: "Content-Type,Authorization",
};
app.use(cors(corsOptions));
app.use(express.json());

// Configurar conexión a la BD de Clever Cloud
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: true } // Importante para conexiones seguras en Clever Cloud
});

// Manejo de errores en la conexión
function conectarDB() {
  db.connect((err) => {
    if (err) {
      console.error("❌ Error al conectar la BD:", err);
      setTimeout(conectarDB, 5000); // Intentar reconectar en 5s
    } else {
      console.log("✅ Conectado a la base de datos.");
    }
  });
}

conectarDB(); // Iniciar conexión

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
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
