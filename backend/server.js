const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const budgetRoutes = require('./routes/budget');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/budgets', budgetRoutes);

module.exports = app;