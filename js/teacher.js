// MyGuru Teacher Dashboard Engine & Job Matching Controller

/**
 * 🚀 initialization Engine
 * పేజీ లోడ్ అవ్వగానే టీచర్ సెషన్ ని వెరిఫై చేసి, ప్రొఫైల్ వివరాలు మరియు మ్యాచ్ అయిన జాబ్స్ ని లోడ్ చేస్తుంది.
 */
async function initTeacherDashboard() {
    // 1. auth.js లోని సెషన్ గేట్ క్రాస్ వెరిఫికేషన్ (Security Check)
    const currentTeacher = await checkLiveUserSession('Teacher');
    if (!currentTeacher) return; // సెషన్ లేకపోతే రూటర్ ఇండెక్స్ కి పంపేస్తుంది.

    // 2. స్క్రీన్ పై బేసిక్ ప్రొఫైల్ డేటా అప్‌డేట్ చేయడం
    const profile = currentTeacher.profileData || {};
    document.getElementById('welcome-msg').innerText = `స్వాగతం, ${currentTeacher.full_name || 'ఉపాధ్యాయులు'} గారు`;
    
    // స్టేటస్ బ్యాడ్జ్ అప్‌డేట్
    const statusBadge = document.getElementById('profile-status');
    if (statusBadge) {
        statusBadge.innerText = (currentTeacher.account_status || 'PENDING').toUpperCase();
        if (currentTeacher.account_status === 'approved') statusBadge.style.color = '#18bc9c';
    }

    // 3. సబ్జెక్ట్ ఆధారంగా జాబ్ మ్యాచింగ్ ఇంజన్ ని రన్ చేయడం 🎯
    const teacherSubjects = profile.subjects || []; // ఇది ఒక Array రూపంలో ఉంటుంది: ['Zoology', 'Biology']
    if (teacherSubjects.length > 0) {
        await matchAndLoadJobs(teacherSubjects);
    } else {
        console.log("⚠️ ప్రొఫైల్‌లో సబ్జెక్టులు ఇంకా సెట్ చేయలేదు.");
    }
}

/**
 * 🎯 Dynamic Subject Matching Query Engine
 * టీచర్ సబ్జెక్టుల లిస్ట్ ఆధారంగా jobs టేబుల్ ని క్వెరీ చేస్తుంది.
 */
async function matchAndLoadJobs(subjectsArray) {
    try {
        // Supabase Query: 'in' ఫిల్టర్ వాడి టీచర్ సబ్జెక్టులు మరియు జాబ్ సబ్జెక్ట్ ని మ్యాచ్ చేయడం
        const { data: matchedJobs, error } = await _supabase
            .from('jobs')
            .select('*')
            .in('subject', subjectsArray) // PostgreSQL: subject IN ('Zoology', 'Biology')
            .order('posted_at', { ascending: false });

        if (error) throw error;

        // డాష్‌బోర్డులో మ్యాచ్ అయిన జాబ్స్ కౌంట్ అప్‌డేట్ చేయడం
        const matchedJobsCount = matchedJobs ? matchedJobs.length : 0;
        const countDisplay = document.getElementById('matched-jobs');
        if (countDisplay) {
            countDisplay.innerText = matchedJobsCount;
        }

        console.log("🎯 మ్యాచ్ అయిన జాబ్స్ డేటా ప్యాకెట్:", matchedJobs);
        
        // భవిష్యత్తులో ఈ 'matchedJobs' డేటాను UI లో టేబుల్ లేదా కార్డ్స్ రూపంలో చూపించడానికి ఇక్కడ ఫంక్షన్ రాసుకోవచ్చు.

    } catch (err) {
        console.error("Job Matching Outage:", err.message);
    }
}

// పేజీ లోడ్ కాగానే ఇంజన్ స్టార్ట్ అవ్వాలి
window.onload = initTeacherDashboard;
