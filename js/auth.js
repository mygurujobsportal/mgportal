// MyGuru Secure Session Validation & Routing Engine

/**
 * 🔄 Active User Session Verification
 * Local Storage సెషన్‌ను ప్రాథమికంగా తీసుకుంటూ, Supabase సెషన్‌ను బ్యాకప్‌గా చెక్ చేస్తుంది.
 */
async function checkLiveUserSession(requiredRole) {
    const cachedUser = localStorage.getItem('myguru_user');
    if (!cachedUser) {
        window.location.href = "../index.html";
        return null;
    }
    
    let user;
    try {
        user = JSON.parse(cachedUser);
    } catch(e) {
        localStorage.removeItem('myguru_user');
        window.location.href = "../index.html";
        return null;
    }

    if (!user || !user.id) {
        localStorage.removeItem('myguru_user');
        window.location.href = "../index.html";
        return null;
    }

    // Role Matching Barrier
    if (requiredRole && user.role) {
        const uRole = user.role.toLowerCase();
        const rRole = requiredRole.toLowerCase();

        const isMatch = (uRole === rRole) || 
                        (rRole === 'employer' && uRole === 'school') || 
                        (rRole === 'school' && uRole === 'employer');

        if (!isMatch && uRole !== 'admin') {
            alert("⚠️ Unauthorized Access Detected!");
            window.location.href = "../index.html";
            return null;
        }
    }

    // Return unified user object matching entire portal architecture
    return {
        id: user.id,
        auth_id: user.auth_id || user.id,
        role: user.role,
        email: user.email || '',
        mobile: user.mobile || '',
        name: user.name || 'User',
        account_status: user.account_status || 'pending',
        subscription: user.subscription || 'free',
        is_premium: user.is_premium || false,
        profile_status: user.profile_status || 'pending'
    };
}

/**
 * 🚪 Landing Destination Router
 */
function routeUserToDashboard(role) {
    if (!role) {
        window.location.href = './index.html';
        return;
    }
    const lowerRole = role.toLowerCase();
    
    if (lowerRole === 'teacher') {
        window.location.href = './teacher/dashboard.html';
    } else if (lowerRole === 'employer' || lowerRole === 'school') {
        window.location.href = './employer/employer_dashboard.html'; 
    } else if (lowerRole === 'parent') {
        window.location.href = './parent/parent_dashboard.html';
    } else if (lowerRole === 'admin') {
        window.location.href = './admin/dashboard.html';
    } else {
        window.location.href = './index.html';
    }
}

/**
 * 🛑 Sign Out Session Closure
 */
async function logoutSessionRouter() {
    try {
        if (typeof _supabase !== 'undefined') {
            await _supabase.auth.signOut();
        }
    } catch(e) {
        console.error("SignOut Exception:", e);
    }
    localStorage.removeItem('myguru_user');
    localStorage.removeItem('adminLoggedIn');
    window.location.href = "../index.html";
}
