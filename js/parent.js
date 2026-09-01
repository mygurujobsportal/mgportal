/**
 * MyGuru Portal - Parent Module Controller
 */

// 1. Post Tuition Requirement
async function submitHomeTutorRequest(parentData) {
    try {
        const { data, error } = await _supabase
            .from('parent_tuitions')
            .insert([
                {
                    parent_id: parentData.userId,
                    student_class: parentData.studentClass,
                    subject: parentData.subject,
                    budget: parentData.budget,
                    location: parentData.location || parentData.address,
                    requirements: parentData.requirements || '',
                    status: 'open',
                    created_at: new Date().toISOString()
                }
            ]);

        if (error) throw error;
        alert("✓ Home tuition requirement posted successfully! Verified teachers will apply.");
        return true;
    } catch (err) {
        console.error("Tutor request post failed:", err.message);
        alert("Submission failed: " + err.message);
        return false;
    }
}
