// MyGuru Teacher Dashboard Engine & Job Matching Controller

async function initTeacherDashboard() {
    // 1. auth.js లోని సెషన్ గేట్ క్రాస్ వెరిఫికేషన్
    const currentTeacher = await checkLiveUserSession('Teacher');
    if (!currentTeacher) return; 

    // 2. స్క్రీన్ పై బేసిక్ ప్రొఫైల్ డేటా అప్‌డేట్ చేయడం
    const profile = currentTeacher.profileData || {};
    document.getElementById('welcome-msg').innerText = `స్వాగతం, ${profile.full_name || 'ఉపాధ్యాయులు'} గారు`;
    
    // స్టేటస్ బ్యాడ్జ్ అప్‌డేట్ (profile_status కాలమ్ కి లింక్ చేశాం)
    const statusBadge = document.getElementById('profile-status');
    if (statusBadge) {
        const currentStatus = profile.profile_status || 'pending';
        statusBadge.innerText = currentStatus.toUpperCase();
        if (currentStatus === 'approved') statusBadge.style.color = '#18bc9c';
        if (currentStatus === 'rejected') statusBadge.style.color = '#e74c3c';
    }

    // 3. టోటల్ అప్లికేషన్ల కౌంట్ లోడ్ చేయడం (`job_applications` నుండి)
    await loadTotalApplicationsCount(currentTeacher.id);

    // 4. సబ్జెక్ట్ ఆధారంగా జాబ్ మ్యాచింగ్ ఇంజన్ ని రన్ చేయడం 🎯
    // సబ్జెక్ట్స్ కమా సెపరేటెడ్ స్ట్రింగ్ లేదా అరే అయినా హ్యాండిల్ చేస్తుంది
    let teacherSubjects = [];
    if (profile.subjects) {
        teacherSubjects = Array.isArray(profile.subjects) 
            ? profile.subjects 
            : profile.subjects.split(',').map(s => s.trim());
    }

    if (teacherSubjects.length > 0) {
        await matchAndLoadJobs(teacherSubjects);
    } else {
        console.log("⚠️ ప్రొఫైల్‌లో సబ్జెక్టులు ఇంకా సెట్ చేయలేదు.");
    }
}

/**
 * 🎯 మీ 'school_jobs' టేబుల్ నుండి సబ్జెక్ట్ మ్యాచ్ చేయడం
 */
async function matchAndLoadJobs(subjectsArray) {
    try {
        const { data: matchedJobs, error } = await _supabase
            .from('school_jobs') // 🎯 మీ టేబుల్ పేరుకి మార్చాం
            .select('*')
            .in('subject', subjectsArray) 
            .eq('status', 'open'); // కేవలం ఓపెన్ లో ఉన్న జాబ్స్

        if (error) throw error;

        const matchedJobsCount = matchedJobs ? matchedJobs.length : 0;
        const countDisplay = document.getElementById('matched-jobs');
        if (countDisplay) {
            countDisplay.innerText = matchedJobsCount;
        }
    } catch (err) {
        console.error("Job Matching Outage:", err.message);
    }
}

/**
 * 📊 'job_applications' నుండి ఈ టీచర్ అప్లై చేసిన కౌంట్ తేవడం
 */
async function loadTotalApplicationsCount(teacherId) {
    try {
        const { count, error } = await _supabase
            .from('job_applications')
            .select('*', { count: 'exact', head: true })
            .eq('teacher_id', teacherId);

        if (error) throw error;

        const countDisplay = document.getElementById('total-apps');
        if (countDisplay) {
            countDisplay.innerText = count || 0;
        }
    } catch (err) {
        console.error("Applications Count Error:", err.message);
    }
}

// లాగ్ అవుట్ ఈవెంట్ లిజనర్ బైండింగ్
document.getElementById('logout-btn').addEventListener('click', async (e) => {
    e.preventDefault();
    await logoutSessionRouter();
});

// పేజీ లోడ్ కాగానే ఇంజన్ స్టార్ట్ అవ్వాలి
window.onload = initTeacherDashboard;
