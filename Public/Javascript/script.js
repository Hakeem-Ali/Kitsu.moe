function toggleDropdown() {
            let menu = document.getElementById("menu");
            menu.style.display = menu.style.display === "block" ? "none" : "block";
        }

        // Close dropdown when clicking outside
        document.addEventListener("click", function(event) {
            const dropdown = document.querySelector(".dropdown");
            const menu = document.getElementById("menu");

            if (dropdown && menu && !dropdown.contains(event.target)) {
                menu.style.display = "none";
            }
        });

//login script

document.addEventListener("DOMContentLoaded", function () {

    // 🛂 Firebase login function
    const signIn = (email, password) => {
        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
        console.log("User signed up:", userCredential.user);
        alert("Account created and signed in!");
    })
    .catch((error) => {
        console.error("Signup error:", error.message);
        alert("Signup failed: " + error.message);
    });
    };

    // 🧠 Check if user is logged in (boolean)
    const isUserLoggedIn = () => {
        const user = firebase.auth().currentUser;
        return user !== null;
    };

    // 💬 Attach to login form
    const loginForm = document.getElementById('login_form');
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault(); // prevent reload

            const email = document.getElementById('email')?.value;
            const password = document.getElementById('password')?.value;

            if (!email || !password) {
                alert('Please fill in both fields.');
                return;
            }

            signIn(email, password);
        });
    } else {
        console.error("Login form not found. Make sure the ID is 'login_form'");
    }
});