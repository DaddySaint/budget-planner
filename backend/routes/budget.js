const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

// Rate limit: max 10 requests per minute per IP
const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    message: 'Too many requests, please try again later.',
});

router.use(limiter);

module.exports = (supabase) => {
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
            res.status(500).json({ message: 'Server error' });
        }
    });

    // Save a new budget
    router.post('/', async (req, res) => {
        try {
            const { data, error } = await supabase.from('budgets').insert([req.body]).select();
            if (error) throw error;
            res.status(201).json(data[0]);
        } catch (error) {
            res.status(400).json({ message: 'Invalid data' });
        }
    });

    // Delete a budget
    router.delete('/:id', async (req, res) => {
        try {
            const { error } = await supabase.from('budgets').delete().eq('id', req.params.id);
            if (error) throw error;
            res.json({ message: 'Budget deleted' });
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    });

    return router;
};