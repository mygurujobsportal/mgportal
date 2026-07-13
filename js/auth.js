alert("auth.js loaded");
alert("Auth Step 1");
alert("Auth Step 2");
document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const role = document.getElementById("role").value;
  const fullname = document.getElementById("fullname").value.trim();
  const mobile = document.getElementById("mobile").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  
  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }
  
  // Create Auth User
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password
  });
  
  if (error) {
    alert(error.message);
    return;
  }
  
  const auth_id = data.user.id;
  
  let result;
  
  if (role === "teacher") {
    
    result = await supabase
      .from("teacher_profiles")
      .insert({
        auth_id: auth_id,
        full_name: fullname,
        mobile: mobile,
        email: email
      });
    
  } else if (role === "school") {
    
    result = await supabase
      .from("school_profiles")
      .insert({
        auth_id: auth_id,
        school_name: fullname,
        principal_name: "",
        mobile: mobile,
        email: email
      });
    
  } else if (role === "parent") {
    
    result = await supabase
      .from("parent_profiles")
      .insert({
        auth_id: auth_id,
        parent_name: fullname,
        mobile: mobile,
        email: email
      });
    
  }
  
  if (result.error) {
    alert(result.error.message);
    return;
  }
  
  alert("Registration Successful!");
  
  window.location.href = "login.html";
  
});
