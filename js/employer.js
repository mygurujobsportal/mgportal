/**
 * MyGuru Portal - Employer Command Engine
 */

// 1. Post New Job
async function createNewJobVacancy(jobData) {
    try {
        const { data, error } = await _supabase
            .from('jobs')
            .insert([
                {
                    school_id: jobData.schoolId,
                    title: jobData.title,
                    subject: jobData.subject,
                    experience_required: jobData.experience || 0,
                    salary_range: jobData.salary || 'Negotiable',
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

// 2. Fetch Jobs posted by School
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

// 3. Fetch Applicants for School Jobs from 'job_applications'
async function fetchApplicantsForEmployerJobs(schoolId) {
    try {
        const { data, error } = await _supabase
            .from('job_applications')
            .select(`
                id, job_id, teacher_id, status, created_at,
                jobs ( title, subject, school_id ),
                teacher_profiles ( full_name, qualifications, experience, district )
            `)
            .eq('jobs.school_id', schoolId);

        if (error) throw error;
        return data || [];
    } catch (err) {
        console.error("Fetch applicants failed:", err.message);
        return [];
    }
}
