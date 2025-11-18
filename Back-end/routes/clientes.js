const express = require('express');
const router = express.Router();

const Cliente = require('../models/cliente');

// Criar cliente
router.post('/', async (req, res) => {
    try {
        const novoCliente = new Cliente(req.body);
        const savedCliente = await novoCliente.save();
        res.status(201).json(savedCliente);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Listar todos os clientes
router.get('/', async (req, res) => {
    try {
        const clientes = await Cliente.find();
        res.json(clientes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Atualizar cliente
router.put('/:id', async (req, res) => {
    try {
        const updatedCliente = await Cliente.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedCliente);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Remover cliente
router.delete('/:id', async (req, res) => {
    try {
        await Cliente.findByIdAndDelete(req.params.id);
        res.json({ message: 'Cliente removido!' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
