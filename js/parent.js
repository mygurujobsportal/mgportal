/**
 * MyGuru Portal - Parent Support Module
 * Manages Home Tutor inquiries, children matrix, and helpdesk interaction loops
 */

// 1. హోం ట్యూటర్ కావాలని రిక్వెస్ట్ పెట్టే ఫంక్షన్
async function submitHomeTutorRequest(parentData) {
    try {
        const { data, error } = await _supabase
            .from('support_tickets')
            .insert([
                {
                    user_id: parentData.userId,
                    category: 'Parent Support',
                    subject: `Tutor Needed for Class: ${parentData.studentClass}`,
                    message: `Required Subject: ${parentData.subject}. Budget Range: ${parentData.budget}. Details: ${parentData.requirements}`,
                    status: 'open',
                    created_at: new Date().toISOString()
                }
            ]);

        if (error) throw error;
        alert("✓ Tutor requirement registered successfully! MyGuru advisors will contact you shortly.");
        return true;
    } catch (err) {
        console.error("Tutor request post crashed:", err.message);
        alert("Submission failed: " + err.message);
        return false;
    }
}
