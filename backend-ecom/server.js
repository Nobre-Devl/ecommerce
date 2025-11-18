require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const produtoRoutes = require('./routes/produtos');
const authRoutes = require('./routes/auth');
const clientesRoutes = require('./routes/clientes');

const app = express();
const PORT = process.env.PORT || 2024;

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

mongoose
  .connect('mongodb+srv://admin:senhaadmin@cluster0.5tidptg.mongodb.net/ecommerce')
  .then(() => console.log('✅ MongoDB conectado ao banco ecommerce!'))
  .catch(err => console.error('❌ Erro ao conectar:', err));

app.use('/produtos', produtoRoutes);
app.use('/api/loja', authRoutes);
app.use('/clientes', clientesRoutes);

app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));