/* ==========================================
   MyGuru Jobs Portal
   Authentication Script
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("registerForm");

    if (!form) return;

    form.addEventListener("submit", registerUser);

});

async function registerUser(e){

    e.preventDefault();

    const role = document.getElementById("role").value.trim();
    const fullname = document.getElementById("fullname").value.trim();
    const mobile = document.getElementById("mobile").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    const message = document.getElementById("message");

    message.innerHTML="";
    message.style.color="red";

    if(role===""){
        message.innerHTML="Please select user type.";
        return;
    }

    if(password!==confirmPassword){
        message.innerHTML="Passwords do not match.";
        return;
    }

    try{

        const {data,error}=await window.supabaseClient.auth.signUp({

            email:email,
            password:password

        });

        if(error){

            message.innerHTML=error.message;
            return;

        }

        if(!data.user){

            message.innerHTML="Registration failed.";
            return;

        }

        const auth_id=data.user.id;

        let table="";
        let profile={};

        switch(role){

            case "teacher":

                table="teacher_profiles";

                profile={

                    auth_id:auth_id,
                    full_name:fullname,
                    mobile:mobile,
                    email:email

                };

            break;

            case "school":

                table="school_profiles";

                profile={

                    auth_id:auth_id,
                    school_name:fullname,
                    principal_name:"",
                    mobile:mobile,
                    email:email

                };

            break;

            case "parent":

                table="parent_profiles";

                profile={

                    auth_id:auth_id,
                    parent_name:fullname,
                    mobile:mobile,
                    email:email

                };

            break;

        }

        const {error:profileError}=await window.supabaseClient

            .from(table)

            .insert(profile);

        if(profileError){

            message.innerHTML=profileError.message;
            return;

        }

        message.style.color="green";

        message.innerHTML="Registration Successful! Please verify your email.";

        setTimeout(()=>{

            window.location.href="login.html";

        },2000);

    }

    catch(err){

        message.innerHTML=err.message;

    }

}
