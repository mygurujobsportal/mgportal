const SUPABASE_URL = "https://sugomkzvytuncybafngf.supabase.co";

const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1Z29ta3p2eXR1bmN5YmFmbmdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1NjM5ODQsImV4cCI6MjA5OTEzOTk4NH0.JNwUYVXdqj0hyVhf1ZjL-YDvY_AekJg9sZE9fuDH9q0";

window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

console.log("Supabase Connected");
