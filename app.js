// Load records when the page opens
window.onload = loadRecords;

function saveRecord() {
    let name = document.getElementById("studentName").value;
    let grade = document.getElementById("gradeLevel").value;
    let type = document.getElementById("recordType").value;
    let description = document.getElementById("description").value;

    if (!name || !grade || !description) {
        alert("All fields are required!");
        return;
    }

    // Record object
    let record = {
        name: name,
        grade: grade,
        type: type,
        description: description,
        date: new Date().toLocaleString()
    };

    // Save to localStorage
    let records = JSON.parse(localStorage.getItem("records")) || [];
    records.push(record);
    localStorage.setItem("records", JSON.stringify(records));

    loadRecords();

    // Clear fields
    document.getElementById("studentName").value = "";
    document.getElementById("gradeLevel").value = "";
    document.getElementById("description").value = "";
}

function loadRecords() {
    let records = JSON.parse(localStorage.getItem("records")) || [];
    let tableBody = document.querySelector("#recordTable tbody");
    tableBody.innerHTML = "";

    records.forEach((r, index) => {
        let row = `
            <tr>
                <td>${r.name}</td>
                <td>${r.grade}</td>
                <td>${r.type}</td>
                <td>${r.description}</td>
                <td>${r.date}</td>
                <td><button class="delete-btn" onclick="deleteRecord(${index})">Delete</button></td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

function deleteRecord(index) {
    let records = JSON.parse(localStorage.getItem("records")) || [];
    records.splice(index, 1);
    localStorage.setItem("records", JSON.stringify(records));
    loadRecords();
}