const Usuario = require("../models/Usuario");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.crearUsuario = async (req, res) => {
  //console.log(req.body); // get json

  // revisamos si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  // extraer email y password
  const { email, password } = req.body;

  try {
    // revisar que el usuario registrado sea unico
    let usuario = await Usuario.findOne({ email });

    if (usuario) {
      return res.status(400).json({ msg: "El usuario ya existe" });
    }

    //crear nuevo usuario
    usuario = new Usuario(req.body);

    // hashear password
    const salt = await bcryptjs.genSalt(10); //salt = unique hash if different users write same pass
    usuario.password = await bcryptjs.hash(password, salt);

    // guardar usuarios
    await usuario.save();

    // crear y firmas el jwt
    const payload = {
      usuario: {
        id: usuario.id,
      },
    };

    // firmar el JWT, expires in 1 hour(3600 secs)
    jwt.sign(
      payload,
      process.env.SECRETA,
      {
        expiresIn: 3600,
      },
      (error, token) => {
        if (error) throw error;

        // Mensaje de confirmación
        res.json({
          token,
        });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(400).send("Hubo un error");
  }
};
