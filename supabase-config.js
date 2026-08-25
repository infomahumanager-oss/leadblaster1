// =========================================================
// Supabase connection config
// The anon/publishable key below is SAFE to expose in
// client-side code — it only allows what your Row Level
// Security policies permit (here: inserting new leads).
// =========================================================
const SUPABASE_URL = 'https://inaufcdbzabskcqwzlwh.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_R14bWSUjCVMStzYkbQ2Z_Q_aeBFEGbb';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
