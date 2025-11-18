const mongoose = require('mongoose');

const FornecedoresSchema = new mongoose.Schema({
    RazãpSocial: { type: String, required: true },
    email: String,
    telefone: Number,
    endereco: String,
    CNPJ: String,
    dataCadastro: {
        type: Date,
        default: Date.now
    },
    
    lojaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Loja',
        required: true
    }
});

const Fornecedores = mongoose.model('Fornecedores', clienteSchema);

module.exports = Fornecedores;