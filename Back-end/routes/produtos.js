const express = require('express');
const router = express.Router();

const Produto = require('../models/produto');

router.post('/', async (req, res) => {
    try {
        const novoProduto = new Produto(req.body);
        const savedProduto = await novoProduto.save();
        res.status(201).json(savedProduto);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const produtos = await Produto.find();
        res.json(produtos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedProduto = await Produto.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedProduto);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Produto.findByIdAndDelete(req.params.id);
        res.json({ message: 'Produto removido!' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;