// MyGuru Central Supabase Client Engine Configuration
const SUPABASE_URL = "https://iaaetymxqyjrgwrzrimp.supabase.co";
const SUPABASE_KEY = "Sb_publishable_YwOJUt0JVvWlpf01eV5y6Q_t3LYbQqy"; 

// Initialize Supabase Client Connection Block
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * 🎯 Alpha-Numeric ID Sequence Generator
 * జాబ్ పోస్టింగ్ సమయంలోనే Capitalized ID క్రియేట్ చేస్తుంది.
 */
function generateAlphanumericID(type, incrementId) {
    const paddedId = String(incrementId).padStart(3, '0');
    if (type === 'school') {
        return `MGJOB${paddedId}`; // E.g., MGJOB001
    } else if (type === 'tuition') {
        return `MGTUT${paddedId}`; // E.g., MGTUT001
    }
    return `MGREF${paddedId}`;
}
