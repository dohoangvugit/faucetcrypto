require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)
async function connect() {
    try {
        await db.connect();
        console.log(' Kết nối Supabase PostgreSQL thành công');
    } catch (err) {
        console.error(' Kết nối thất bại:', err);
    }
}
connect()

module.exports = supabase