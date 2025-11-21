/* -----------------------------
        USER AUTHENTICATION
-------------------------------*/

// Load or initialize users
let users = JSON.parse(localStorage.getItem("users")) || [];

// Initialize default admin if no users exist
if (users.length === 0) {
    const defaultAdmin = { name: "Administrator", email: "admin@system.com", password: "admin123", role: "admin" };
    users.push(defaultAdmin);
    localStorage.setItem("users", JSON.stringify(users));
}

/* -----------------------------
            SIGN UP
-------------------------------*/
function signUp() {
    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value.trim();
    const role = document.getElementById("signupRole").value;

    if (!name || !email || !password) {
        alert("All fields are required.");
        return;
    }

    if (!validateEmail(email)) {
        alert("Invalid email format.");
        return;
    }

    if (password.length < 6) {
        alert("Password must be at least 6 characters.");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.find(u => u.email === email)) {
        alert("Email already registered!");
        return;
    }

    const newUser = { name, email, password, role };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    alert("Account created successfully!");
    window.location.href = "index.html";
}

/* -----------------------------
            LOGIN
-------------------------------*/
function login() {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (!email || !password) {
        alert("Please fill in all fields.");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.email === email);

    if (!user) {
        alert("Account not found.");
        return;
    }

    if (user.password !== password) {
        alert("Incorrect password.");
        return;
    }

    // Save current user
    localStorage.setItem("currentUser", JSON.stringify(user));

    // Redirect based on role
    if (user.role === "admin") {
        window.location.href = "admin_dashboard.html";
    } else {
        window.location.href = "user_dashboard.html";
    }
}

/* -----------------------------
        PASSWORD RESET
-------------------------------*/
function resetPassword() {
    const email = document.getElementById("resetEmail").value.trim();
    const newPassword = document.getElementById("resetNewPassword").value.trim();

    if (!email || !newPassword) {
        alert("All fields are required.");
        return;
    }

    if (newPassword.length < 6) {
        alert("Password must be at least 6 characters.");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = users.findIndex(u => u.email === email);

    if (userIndex === -1) {
        alert("Email not found.");
        return;
    }

    users[userIndex].password = newPassword;
    localStorage.setItem("users", JSON.stringify(users));

    alert("Password updated successfully!");
    window.location.href = "index.html";
}

/* -----------------------------
        LOGOUT
-------------------------------*/
function logout() {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
}
/* -----------------------------
        CHECK LOGIN
-------------------------------*/
function checkLogin() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
        window.location.href = "login.html";
        return;
    }

    // Optionally, show username somewhere
    const welcomeEl = document.getElementById("currentUser");
    if (welcomeEl) {
        welcomeEl.textContent = currentUser.name + " (" + currentUser.role + ")";
    }
}

/* -----------------------------
        HELPER FUNCTIONS
-------------------------------*/
function validateEmail(email) {
    // Simple email regex
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}