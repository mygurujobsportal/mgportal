async function initTeacherDashboard() {
    // 1. auth.js లోని ఫంక్షన్‌ని పిలిచి టీచర్ రోల్ వెరిఫై చేయడం
    const currentTeacher = await checkLiveUserSession('Teacher');
    
    if(!currentTeacher) return; // సెషన్ లేకపోతే లేదా రోల్ మారితే auth.js ఆటోమేటిక్‌గా ఇండెక్స్ కి పంపేస్తుంది!

    // 2. సెషన్ సక్సెస్ అయితే ప్రొఫైల్ డేటాను వాడుకోవడం
    console.log("Teacher ID (Foreign Key):", currentTeacher.id);
    console.log("Qualifications:", currentTeacher.profileData.qualifications);
    
    // ఇక్కడే మన సబ్జెక్ట్ బేస్డ్ జాబ్ మ్యాచింగ్ ఫంక్షన్‌ను రన్ చేస్తాం!
}

// పేజీ లోడ్ అవ్వగానే రన్ అవ్వాలి
window.onload = initTeacherDashboard;
