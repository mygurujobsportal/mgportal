// MyGuru Teacher Dashboard Engine & Job Matching Controller

async function initTeacherDashboard() {
    // 1. Session check
    const currentTeacher = await checkLiveUserSession('teacher');
    if (!currentTeacher) return; 

    // 2. Fetch fresh teacher profile from DB
    try {
        const { data: profile, error } = await _supabase
            .from('teacher_profiles')
            .select('*')
            .eq('id', currentTeacher.id)
            .maybeSingle();

        // Welcome Greeting
        const welcomeEl = document.getElementById('welcome-msg') || document.getElementById('lblGreeting');
        if (welcomeEl) {
            welcomeEl.innerText = `స్వాగతం, ${profile?.full_name || currentTeacher.name || 'ఉపాధ్యాయులు'} గారు`;
        }
        
        // Status Badge
        const statusBadge = document.getElementById('profile-status') || document.getElementById('valAccountStatus');
        if (statusBadge) {
            const currentStatus = currentTeacher.account_status || 'pending';
            statusBadge.innerText = currentStatus.toUpperCase();
            if (currentStatus === 'active' || currentStatus === 'approved') statusBadge.style.color = '#22c55e';
            if (currentStatus === 'pending') statusBadge.style.color = '#f59e0b';
        }

        // 3. Applications Count
        await loadTotalApplicationsCount(currentTeacher.id);

        // 4. Match Jobs based on teacher's subjects
        if (profile && profile.subjects) {
            let teacherSubjects = profile.subjects.split(',').map(s => s.trim());
            await matchAndLoadJobs(teacherSubjects);
        }
    } catch (err) {
        console.error("Teacher Profile Init Error:", err);
    }
}

/**
 * 🎯 Match jobs from 'jobs' table
 */
async function matchAndLoadJobs(subjectsArray) {
    try {
        const { data: matchedJobs, error } = await _supabase
            .from('jobs')
            .select('*')
            .eq('status', 'open');

        if (error) throw error;

        // Filter matched by subject keywords
        const filtered = (matchedJobs || []).filter(j => 
            subjectsArray.some(sub => j.subject && j.subject.toLowerCase().includes(sub.toLowerCase()))
        );

        const countDisplay = document.getElementById('matched-jobs') || document.getElementById('valInterviewsCount');
        if (countDisplay) {
            countDisplay.innerText = filtered.length;
        }
    } catch (err) {
        console.error("Job Matching Outage:", err.message);
    }
}

/**
 * 📊 Total applications count from 'job_applications'
 */
async function loadTotalApplicationsCount(teacherId) {
    try {
        const { count, error } = await _supabase
            .from('job_applications')
            .select('*', { count: 'exact', head: true })
            .eq('teacher_id', teacherId);

        if (error) throw error;

        const countDisplay = document.getElementById('total-apps') || document.getElementById('valAppliedCount');
        if (countDisplay) {
            countDisplay.innerText = count || 0;
        }
    } catch (err) {
        console.error("Applications Count Error:", err.message);
    }
}

// Global Event Binding
window.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            await logoutSessionRouter();
        });
    }
    initTeacherDashboard();
});
