document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("registerForm");

    if (!form) return;

    form.addEventListener("submit", registerUser);

});

async function registerUser(e) {

    e.preventDefault();

    const role = document.getElementById("role").value;
    const fullname = document.getElementById("fullname").value.trim();
    const mobile = document.getElementById("mobile").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    const message = document.getElementById("message");

    message.style.color = "red";
    message.innerHTML = "";

    if (password !== confirmPassword) {

        message.innerHTML = "Passwords do not match.";

        return;

    }

    try {

        const { data, error } = await window.supabaseClient.auth.signUp({

            email: email,
            password: password

        });

        if (error) {

            message.innerHTML = error.message;

            return;

        }

        const auth_id = data.user.id;

        let table = "";
        let profile = {};

        if (role === "teacher") {

            table = "teacher_profiles";

            profile = {

                auth_id: auth_id,
                full_name: fullname,
                mobile: mobile,
                email: email

            };

        }

        else if (role === "school") {

            table = "school_profiles";

            profile = {

                auth_id: auth_id,
                school_name: fullname,
                principal_name: "",
                mobile: mobile,
                email: email

            };

        }

        else {

            table = "parent_profiles";

            profile = {

                auth_id: auth_id,
                parent_name: fullname,
                mobile: mobile,
                email: email

            };

        }

        const { error: profileError } = await window.supabaseClient

            .from(table)

            .insert(profile);

        if (profileError) {

            message.innerHTML = profileError.message;

            console.log(profileError);

            return;

        }

        message.style.color = "green";

        message.innerHTML = "Registration Successful.";

        setTimeout(() => {

            window.location.href = "login.html";

        }, 1500);

    }

    catch (err) {

        console.log(err);

        message.innerHTML = err.message;

    }

}
