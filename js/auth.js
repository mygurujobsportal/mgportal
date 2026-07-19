// MyGuru Secure Session Validation & Routing Engine

/**
 * 🔄 Active User Session Verification
 * బ్రౌజర్ లోకల్ డేటాను మరియు సుపాబేస్ నెట్‌వర్క్ ఆథ్ సెషన్ ని క్రాస్-వెరిఫై చేస్తుంది.
 */
async function checkLiveUserSession(requiredRole) {
    const cachedUser = localStorage.getItem('myguru_user');
    if (!cachedUser) {
        window.location.href = "../index.html"; // ఒకవేళ ఫోల్డర్ లోపల ఉంటే వెనక్కి పంపడానికి
        return null;
    }
    
    const user = JSON.parse(cachedUser);

    try {
        // Validate native session from supabase server
        const { data: { session }, error } = await _supabase.auth.getSession();
        
        if (error || !session) {
            localStorage.removeItem('myguru_user');
            window.location.href = "../index.html";
            return null;
        }

        // Role Matching Barrier (toLowerCase వాడటం వల్ల కేస్-మిస్మ్యాచ్ సమస్య రాదు)
        if (requiredRole && user.role.toLowerCase() !== requiredRole.toLowerCase()) {
            alert("⚠️ Unauthorized Access Detected!");
            window.location.href = "../index.html";
            return null;
        }

        // 🎯 [SAFE FIX]: క్రాష్ అవ్వకుండా సుపాబేస్ ఆథ్ మరియు మెటాడేటా నుండి మొబైల్ నంబర్ లాగడం
        const liveMobile = session.user.phone || 
                           session.user.user_metadata?.mobile || 
                           session.user.user_metadata?.phone || 
                           user.mobile || '';

        return {
            id: session.user.id,
            role: user.role,
            email: session.user.email,
            mobile: liveMobile, // profileData బ్యాకప్ కోసమే కాకుండా నేరుగా యాక్సెస్ చేయడానికి
            phone: liveMobile,  // 🎯 ప్రొఫైల్ పేజీ లోని 'session.phone' కి మ్యాచ్ అవ్వడానికి ఇది కూడా ఇస్తున్నాం
            profileData: user.profileData || {}
        };
    } catch (e) {
        console.error("Auth Session Outage:", e);
        window.location.href = "../index.html";
        return null;
    }
}

/**
 * 🚪 Landing Destination Router
 * ఫోల్డర్ స్ట్రక్చర్ ప్రకారం పాత్‌లను ఇక్కడ సరిచేశాం 🛠️
 */
function routeUserToDashboard(role) {
    const lowerRole = role.toLowerCase();
    
    if (lowerRole === 'teacher') {
        window.location.href = '../teacher/dashboard.html';
    } else if (lowerRole === 'employer' || lowerRole === 'school') {
        // ⚠️ టాబ్‌లో లోకల్ ఫైల్స్ రన్ అవుతున్నప్పుడు ఒక అడుగు వెనక్కి (../) వెళ్లి employer ఫోల్డర్ వెతకాలి
        window.location.href = './employer/employer_dashboard.html'; 
    } else if (lowerRole === 'parent') {
        window.location.href = '../parent/parent_dashboard.html';
    } else if (lowerRole === 'admin') {
        window.location.href = '../admin/admin_dashboard.html';
    } else {
        window.location.href = '../index.html';
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
    window.location.href = "../index.html"; // రూట్ లాగిన్ పేజీకి రీడైరెక్ట్
}
