const mongoose = require('mongoose');

const lojaSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true 
  },
  password: {
    type: String,
    required: true
  },
  dataCadastro: {
    type: Date,
    default: Date.now
  }
});

const Loja = mongoose.model('Loja', lojaSchema);

module.exports = Loja;