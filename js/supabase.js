// MyGuru Central Supabase Client Engine Configuration
const SUPABASE_URL = "https://iaaetymxqyjrgwrzrimp.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1Z29ta3p2eXR1bmN5YmFmbmdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1NjM5ODQsImV4cCI6MjA5OTEzOTk4NH0.JNwUYVXdqj0hyVhf1ZjL-YDvY_AekJg9sZE9fuDH9q0"; 

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * 🎯 Alpha-Numeric ID Formatter (For UI display only)
 * డేటాబేస్ లో UUID సేవ్ అయినా, యూజర్స్ కి చూపించేటప్పుడు MGJOB / MGTUT సిరీస్ లాగా మార్చడానికి.
 */
function formatAlphanumericDisplayID(type, rawUuid) {
    if(!rawUuid) return 'MG-REF-000';
    const shortHash = rawUuid.split('-')[0].toUpperCase();
    return type === 'school' ? `MGJOB-${shortHash}` : `MGTUT-${shortHash}`;
}
