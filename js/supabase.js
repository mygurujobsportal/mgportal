// MyGuru Central Database Connectivity System
// URL and Key must perfectly belong to the same project instance.
const SUPABASE_URL = "sb_publishable_YwOJUt0JVvWlpf01eV5y6Q_t3LYbQqy";

// 🎯 IMPORTANT: Replace this exact string with your long public 'anon' key (starts with eyJ...)
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1Z29ta3p2eXR1bmN5YmFmbmdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1NjM5ODQsImV4cCI6MjA5OTEzOTk4NH0.JNwUYVXdqj0hyVhf1ZjL-YDvY_AekJg9sZE9fuDH9q0";

// Standard Client Initialization Instance
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * 🎯 Display Utility Formatter for Alphanumeric Identifiers
 * Keeps database records securely referenced via UUIDs, while presenting structured IDs to users.
 */
function formatAlphanumericDisplayID(type, rawUuid) {
    if (!rawUuid) return 'MG-REF-000';
    const shortHash = rawUuid.split('-')[0].toUpperCase();
    return type === 'school' ? `MGJOB-${shortHash}` : `MGTUT-${shortHash}`;
}
