alert("auth.js loaded");

document.addEventListener("DOMContentLoaded", () => {

    alert("DOM Loaded");

    const form = document.getElementById("registerForm");

    alert(form);

    if (!form) {
        alert("Form NOT Found");
        return;
    }

    alert("Form Found");

    form.addEventListener("submit", function(e){

        e.preventDefault();

        alert("Register Clicked");

    });

});
