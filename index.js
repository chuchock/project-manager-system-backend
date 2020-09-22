const express = require("express");
const conectarDB = require("./config/db");
const cors = require("cors");

// crear servidor
const app = express();

// conectar a la BD
conectarDB();

// Habilitar CORS
app.use(cors());

// Habilitar express.json(permite datos que el usuario mande) - header: application/json
app.use(express.json({ extended: true }));

// puerto de la app
const PORT = process.env.PORT || 4000;

// Definir la pagina principal
app.get("/", (req, res) => {
  res.send("Hola mundo");
});

// Importar rutas
app.use("/api/usuarios", require("./routes/usuarios"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/proyectos", require("./routes/proyectos"));
app.use("/api/tareas", require("./routes/tareas"));

// arrancar la app
app.listen(PORT, () => {
  console.log(`El servidor está funcionando en el puerto ${PORT}`);
});
