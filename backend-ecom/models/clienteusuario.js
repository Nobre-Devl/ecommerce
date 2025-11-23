const mongoose = require('mongoose');

const ClienteUsuarioSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  
  cpf: { 
    type: String, 
    unique: true, 
    sparse: true, 
    default: undefined 
  },

  telefone: String,
  endereco: {
    rua: String,
    numero: String,
    bairro: String,
    cidade: String,
    cep: String
  },
  dataCadastro: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ClienteUsuario', ClienteUsuarioSchema);