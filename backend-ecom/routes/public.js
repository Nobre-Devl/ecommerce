const express = require('express');
const router = express.Router();
const Produto = require('../models/produto'); 

router.get('/produtos', async (req, res) => {
    try {
        const produtos = await Produto.find()
            .populate('lojaId', 'nome nomeFantasia email'); 
            
        res.json(produtos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao buscar produtos' });
    }
});

module.exports = router;