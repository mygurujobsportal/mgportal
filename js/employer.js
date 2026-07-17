/**
 * MyGuru Portal - Employer Command Engine
 * Controls Job Postings, Applicant Audits, and Corporate Profiles
 */

// 1. కొత్త ఉద్యోగాన్ని పోస్ట్ చేసే ఫంక్షన్
async function createNewJobVacancy(jobData) {
    try {
        const { data, error } = await _supabase
            .from('jobs')
            .insert([
                {
                    school_id: jobData.schoolId,
                    title: jobData.title,
                    subject: jobData.subject,
                    experience_required: jobData.experience,
                    salary_range: jobData.salary,
                    location: jobData.location,
                    description: jobData.description,
                    status: 'open',
                    created_at: new Date().toISOString()
                }
            ]);

        if (error) throw error;
        alert("✓ Job vacancy posted successfully onto MyGuru network!");
        return data;
    } catch (err) {
        console.error("Job post failed:", err.message);
        alert("Error posting job: " + err.message);
    }
}

// 2. సదరు స్కూల్ పోస్ట్ చేసిన ఉద్యోగాలను లాగే ఫంక్షన్
async function fetchEmployerPostedJobs(schoolId) {
    try {
        const { data, error } = await _supabase
            .from('jobs')
            .select('*')
            .eq('school_id', schoolId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (err) {
        console.error("Fetch jobs failed:", err.message);
        return [];
    }
}

// 3. ఉద్యోగాల కోసం వచ్చిన అప్లికేషన్లను రివ్యూ చేసే ఫ明క్షన్
async function fetchApplicantsForEmployerJobs(schoolId) {
    try {
        const { data, error } = await _supabase
            .from('applications')
            .select(`
                id, job_id, teacher_id, status, created_at,
                jobs ( title, subject ),
                common_users ( full_name, email )
            `)
            .eq('jobs.school_id', schoolId);

        if (error) throw error;
        return data || [];
    } catch (err) {
        console.error("Fetch applicants failed:", err.message);
        return [];
    }
}
