const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const produtoRoutes = require('./routes/produtos');
const clientesRoutes = require('./routes/clientes');

const app = express();
const PORT = process.env.PORT || 2024;

app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect('mongodb+srv://admin:senhaadmin@cluster0.5tidptg.mongodb.net/ecommerce')
  .then(() => console.log('✅ MongoDB conectado ao banco ecommerce!'))
  .catch(err => console.error('❌ Erro ao conectar:', err));

app.use('/produtos', produtoRoutes);
app.use('/clientes', clientesRoutes);
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));



