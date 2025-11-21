document.addEventListener("DOMContentLoaded", function () {

    // ----------- SIGN UP -----------
    const signupForm = document.getElementById("signupForm");
    if (signupForm) {
        signupForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const name = document.getElementById("signupName").value;
            const email = document.getElementById("signupEmail").value;
            const password = document.getElementById("signupPassword").value;
            const role = document.getElementById("signupRole").value;

            if (localStorage.getItem(email)) {
                document.getElementById("signupMessage").innerText = "Email already exists!";
                return;
            }

            const user = { name, email, password, role };
            localStorage.setItem(email, JSON.stringify(user));

            document.getElementById("signupMessage").innerText = "Account created!";
        });
    }


    // ----------- LOGIN -----------
 function login() {
    const email = document.getElementById("loginEmail").value.trim();
    const pass = document.getElementById("loginPassword").value.trim();
    const error = document.getElementById("error");

    error.innerText = "";

    if (email === "" || pass === "") {
        error.innerText = "Email and password are required.";
        return;
    }

    const userData = JSON.parse(localStorage.getItem(email));

    if (!userData) {
        error.innerText = "No account found with this email.";
        return;
    }

    if (userData.password !== pass) {
        error.innerText = "Incorrect password.";
        return;
    }

    // Save logged-in user
    localStorage.setItem("currentUser", email);

    // Redirect based on role
    if (userData.role === "admin") {
        window.location.href = "admin_dashboard.html";
    } else {
        window.location.href = "user_dashboard.html";
    }
}
    

    // ----------- PASSWORD RESET -----------
    const resetForm = document.getElementById("resetForm");
    if (resetForm) {
        resetForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const email = document.getElementById("resetEmail").value;
            const newPassword = document.getElementById("resetNewPassword").value;

            const user = localStorage.getItem(email);
            if (!user) {
                document.getElementById("resetMessage").innerText = "Email not found!";
                return;
            }

            const userData = JSON.parse(user);
            userData.password = newPassword;

            localStorage.setItem(email, JSON.stringify(userData));

            document.getElementById("resetMessage").innerText = "Password updated!";
        });
    }


    // ----------- USER DASHBOARD (SHOW USER'S OWN RECORDS) -----------
    if (document.getElementById("recordTable")) {
        const email = localStorage.getItem("currentUser");
        if (!email) window.location.href = "index.html";

        loadUserRecords(email);

        document.getElementById("recordForm").addEventListener("submit", function (e) {
            e.preventDefault();

            const student = document.getElementById("studentName").value;
            const violation = document.getElementById("violation").value;
            const action = document.getElementById("counselAction").value;

            const record = {
                student,
                violation,
                action,
                createdBy: email
            };

            let list = JSON.parse(localStorage.getItem("records") || "[]");
            list.push(record);
            localStorage.setItem("records", JSON.stringify(list));

            loadUserRecords(email);
            document.getElementById("recordMessage").innerText = "Record added!";
        });
    }


    // ----------- ADMIN DASHBOARD -----------
    if (document.getElementById("adminRecordTable")) {
        const email = localStorage.getItem("currentUser");
        if (!email) window.location.href = "index.html";

        const user = JSON.parse(localStorage.getItem(email));
        if (user.role !== "admin") {
            window.location.href = "index.html"; // block access
        }

        loadAdminRecords();
    }

});


// ============== FUNCTIONS ===============

// USER RECORDS
function loadUserRecords(email) {
    const tbody = document.querySelector("#recordTable tbody");
    tbody.innerHTML = "";

    const list = JSON.parse(localStorage.getItem("records") || "[]");
    const userRecords = list.filter(r => r.createdBy === email);

    userRecords.forEach(r => {
        const row = `<tr>
            <td>${r.student}</td>
            <td>${r.violation}</td>
            <td>${r.action}</td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

// ADMIN — CAN SEE EVERYTHING
function loadAdminRecords() {
    const tbody = document.querySelector("#adminRecordTable tbody");
    tbody.innerHTML = "";

    const list = JSON.parse(localStorage.getItem("records") || "[]");

    list.forEach(r => {
        const row = `<tr>
            <td>${r.student}</td>
            <td>${r.violation}</td>
            <td>${r.action}</td>
            <td>${r.createdBy}</td>
        </tr>`;
        tbody.innerHTML += row;
    });
}


// LOGOUT
function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
}
/* ---------- DELETE RECORD ---------- */
function deleteRecord(index) {
    let records = JSON.parse(localStorage.getItem("records") || "[]");
    records.splice(index, 1);
    localStorage.setItem("records", JSON.stringify(records));
    refreshDashboard();
}

/* ---------- EDIT RECORD ---------- */
function editRecord(index) {
    let records = JSON.parse(localStorage.getItem("records") || "[]");
    const record = records[index];

    // Populate form with existing data
    document.getElementById("studentName").value = record.student;
    document.getElementById("violation").value = record.violation;
    document.getElementById("counselAction").value = record.action;

    // Change button to Save Edit
    const formButton = document.querySelector("#recordForm button");
    formButton.textContent = "Save Changes";

    formButton.onclick = function(e) {
        e.preventDefault();

        // Update record
        record.student = document.getElementById("studentName").value;
        record.violation = document.getElementById("violation").value;
        record.action = document.getElementById("counselAction").value;

        records[index] = record;
        localStorage.setItem("records", JSON.stringify(records));

        // Reset form
        formButton.textContent = "Add Record";
        document.getElementById("recordForm").reset();

        refreshDashboard();
    };
}

/* ---------- REFRESH DASHBOARD ---------- */
function refreshDashboard() {
    const email = JSON.parse(localStorage.getItem("currentUser")).email;
    if (document.getElementById("recordTable")) {
        loadUserRecords(email);
    }
    if (document.getElementById("adminRecordTable")) {
        loadAdminRecords();
    }
}

/* ---------- LOAD USER RECORDS WITH ACTION BUTTONS ---------- */
function loadUserRecords(email) {
    const tbody = document.querySelector("#recordTable tbody");
    tbody.innerHTML = "";

    const records = JSON.parse(localStorage.getItem("records") || "[]");
    const userRecords = records.map((r, i) => ({ ...r, index: i })).filter(r => r.createdBy === email);

    userRecords.forEach(r => {
        const row = `<tr>
            <td>${r.student}</td>
            <td>${r.violation}</td>
            <td>${r.action}</td>
            <td>
                <button onclick="editRecord(${r.index})">Edit</button>
                <button onclick="deleteRecord(${r.index})">Delete</button>
            </td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

/* ---------- LOAD ADMIN RECORDS WITH ACTION BUTTONS ---------- */
function loadAdminRecords() {
    const tbody = document.querySelector("#adminRecordTable tbody");
    tbody.innerHTML = "";

    const records = JSON.parse(localStorage.getItem("records") || "[]");
    records.forEach((r, i) => {
        const row = `<tr>
            <td>${r.student}</td>
            <td>${r.violation}</td>
            <td>${r.action}</td>
            <td>${r.createdBy}</td>
            <td>
                <button onclick="editRecord(${i})">Edit</button>
                <button onclick="deleteRecord(${i})">Delete</button>
            </td>
        </tr>`;
        tbody.innerHTML += row;
    });
}
function signup() {
    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const pass = document.getElementById("password").value.trim();
    const pass2 = document.getElementById("password2").value.trim();
    const role = document.getElementById("role").value;

    const errorBox = document.getElementById("error");
    errorBox.innerText = "";

    // Validation
    if (fullName === "" || email === "" || pass === "" || pass2 === "" || role === "") {
        errorBox.innerText = "All fields are required.";
        return;
    }

    if (!email.includes("@") || !email.includes(".")) {
        errorBox.innerText = "Invalid email format.";
        return;
    }

    if (pass.length < 6) {
        errorBox.innerText = "Password must be at least 6 characters.";
        return;
    }

    if (pass !== pass2) {
        errorBox.innerText = "Passwords do not match.";
        return;
    }

    if (localStorage.getItem(email)) {
        errorBox.innerText = "An account with this email already exists.";
        return;
    }

    // Save user/admin account
    const userData = {
        name: fullName,
        email: email,
        password: pass,
        role: role
    };

    localStorage.setItem(email, JSON.stringify(userData));

    alert("Account created successfully!");
    window.location.href = "login.html";
}