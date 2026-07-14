// MyGuru Central Supabase Client Engine Configuration
const SUPABASE_URL = "https://iaaetymxqyjrgwrzrimp.supabase.co";
const SUPABASE_KEY = "Sb_publishable_YwOJUt0JVvWlpf01eV5y6Q_t3LYbQqy"; 

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
