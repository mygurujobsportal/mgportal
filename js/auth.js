// MyGuru Secure Session Validation & Dynamic Router Framework

/**
 * 🔄 Active Token Session Validator
 * బ్రౌజర్ స్టోరేజ్ మరియు సుపాబేస్ సర్వర్ టోకెన్ రెండింటినీ క్రాస్-చెక్ చేస్తుంది.
 */
async function checkLiveUserSession(requiredRole) {
    const cachedUser = localStorage.getItem('myguru_user');
    if (!cachedUser) {
        window.location.href = "index.html";
        return null;
    }
    
    const user = JSON.parse(cachedUser);

    try {
        // Validate actual authentication token existence from network
        const { data: { session }, error } = await _supabase.auth.getSession();
        
        if (error || !session) {
            localStorage.removeItem('myguru_user');
            window.location.href = "index.html";
            return null;
        }

        // Role-Based Boundary Check Protection Layer
        if (requiredRole && user.roleType !== requiredRole) {
            alert("⚠️ Access Node Denied: Unauthorized Classification!");
            window.location.href = "index.html";
            return null;
        }

        return user;
    } catch (e) {
        console.error("Session Verification Outage:", e);
        window.location.href = "index.html";
        return null;
    }
}

/**
 * 🚪 Dynamic Destination Landing Router
 */
function routeUserToDashboard(roleType) {
    if (roleType === 'Teacher') {
        window.location.href = 'teacher_dashboard.html';
    } else if (roleType === 'Employer') {
        window.location.href = 'employer_dashboard.html';
    } else if (roleType === 'Parent') {
        window.location.href = 'parent_dashboard.html';
    } else if (roleType === 'Admin') {
        window.location.href = 'admin_dashboard.html';
    }
}

/**
 * 🛑 Logout Router Execution Call
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
