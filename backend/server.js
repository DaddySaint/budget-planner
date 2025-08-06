const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const budgetRoutes = require('./routes/budgets');

dotenv.config();
const app = express();

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
    console.error('Error: SUPABASE_URL and SUPABASE_KEY must be set in .env');
    process.exit(1);
}

app.use(cors());
app.use(express.json());

app.use('/api/budgets', budgetRoutes);

module.exports = app;