require('dotenv').config({ path: './.env' });
console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_KEY:', process.env.SUPABASE_KEY ? '[REDACTED]' : 'undefined');