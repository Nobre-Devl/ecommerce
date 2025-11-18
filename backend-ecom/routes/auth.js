const express = require('express');
const router = express.Router();
const Loja = require('../models/loja');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require('../config/cloudinary'); 

router.post('/register', async (req, res) => {
  try {
    const { 
      nome, 
      email, 
      password, 
      cnpj, 
      telefone, 
      imagem, 
      endereco 
    } = req.body;

    let imageUrl = ''; 

    if (imagem) {
      const uploadResponse = await cloudinary.uploader.upload(imagem, {
        folder: "lojas_logos",
        resource_type: "image" 
      });
      imageUrl = uploadResponse.secure_url;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const novaLoja = new Loja({
      nome,
      email,
      password: hashedPassword,
      cnpj,
      telefone,
      imagem: imageUrl, 
      endereco
    });

    const savedLoja = await novaLoja.save();
    res.status(201).json({ message: "Loja cadastrada!", id: savedLoja._id });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


router.post('/login', async (req, res) => {
  try {
    const loja = await Loja.findOne({ email: req.body.email });
    if (!loja) return res.status(400).send('Email ou senha inválidos.');

    const validPassword = await bcrypt.compare(req.body.password, loja.password);
    if (!validPassword) return res.status(400).send('Email ou senha inválidos.');

    const token = jwt.sign({ _id: loja._id }, 'SEGREDO_SUPER_SECRETO');
    res.header('auth-token', token).send({ token: token });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;