// MyGuru Secure Session Validation & Routing Engine

/**
 * 🔄 Active User Session Verification
 * బ్రౌజర్ లోకల్ డేటాను మరియు సుపాబేస్ నెట్‌వర్క్ ఆథ్ సెషన్ ని క్రాస్-వెరిఫై చేస్తుంది.
 */
async function checkLiveUserSession(requiredRole) {
    const cachedUser = localStorage.getItem('myguru_user');
    if (!cachedUser) {
        window.location.href = "index.html";
        return null;
    }
    
    const user = JSON.parse(cachedUser);

    try {
        // Validate native session from supabase server
        const { data: { session }, error } = await _supabase.auth.getSession();
        
        if (error || !session) {
            localStorage.removeItem('myguru_user');
            window.location.href = "index.html";
            return null;
        }

        // Role Role Matching Barrier
        if (requiredRole && user.role !== requiredRole) {
            alert("⚠️ Unauthorized Access Detected!");
            window.location.href = "index.html";
            return null;
        }

        return user;
    } catch (e) {
        console.error("Auth Session Outage:", e);
        window.location.href = "index.html";
        return null;
    }
}

/**
 * 🚪 Landing Destination Router
 */
function routeUserToDashboard(role) {
    const lowerRole = role.toLowerCase();
    if (lowerRole === 'teacher') {
        window.location.href = 'teacher_dashboard.html';
    } else if (lowerRole === 'employer' || lowerRole === 'school') {
        window.location.href = 'employer_dashboard.html';
    } else if (lowerRole === 'parent') {
        window.location.href = 'parent_dashboard.html';
    } else if (lowerRole === 'admin') {
        window.location.href = 'admin_dashboard.html';
    }
}

/**
 * 🛑 Sign Out Session Closure
 */
async function logoutSessionRouter() {
    try {
        await _supabase.auth.signOut();
    } catch(e) {
        console.error("SignOut Exception:", e);
    }
    localStorage.removeItem('myguru_user');
    window.location.href = "index.html";
}
