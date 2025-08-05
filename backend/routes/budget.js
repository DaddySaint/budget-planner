const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const rateLimit = require('express-rate-limit');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Rate limit: max 10 requests per minute per IP
const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    message: 'Too many requests, please try again later.'
});
router.use(limiter);

// Get budgets for a user
router.get('/:userId', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('budgets')
            .select('*')
            .eq('user_id', req.params.userId)
            .limit(10);
        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Save a new budget
router.post('/', async (req, res) => {
    try {
        const { data, error } = await supabase.from('budgets').insert([req.body]).select();
        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a budget
router.delete('/:id', async (req, res) => {
    try {
        const { error } = await supabase.from('budgets').delete().eq('id', req.params.id);
        if (error) throw error;
        res.json({ message: 'Budget deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;