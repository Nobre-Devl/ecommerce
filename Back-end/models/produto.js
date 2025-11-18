
const mongoose = require('mongoose');

const produtoSchema = new mongoose.Schema({
    nome: String,
    categoria: String,
    preco: Number,
    estoque: Number,
    desc: String,
    imagem: String,
    data: String
});

const Produto = mongoose.model('Produto', produtoSchema);

module.exports = Produto;
