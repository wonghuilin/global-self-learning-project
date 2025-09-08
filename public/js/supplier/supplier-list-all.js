let allStudents = []; 

window.addEventListener("DOMContentLoaded", function () {
  function renderTable(students) {
    const tbody = document.querySelector("#students");
    tbody.innerHTML = "";

    students.forEach((student) => {
      const row = document.createElement("tr");

      // Create cells
      const nameCell = document.createElement("td");
      const addressCell = document.createElement("td");
      const cityCell = document.createElement("td");
      const stateCell = document.createElement("td");
      const emailCell = document.createElement("td");
      const phoneCell = document.createElement("td");
      const actionsCell = document.createElement("td");

      // Fill data
      nameCell.textContent = student.name;
      addressCell.textContent = student.address;
      cityCell.textContent = student.city;
      stateCell.textContent = student.state;
      emailCell.textContent = student.email;
      phoneCell.textContent = student.phone;

      // Edit button
      const editBtn = document.createElement("a");
      editBtn.className = "btn btn-sm btn-info";
      editBtn.href = `/supplier/supplier-update.html?id=${student.id}`;
      editBtn.textContent = "Edit";

      // Append only Edit button
      actionsCell.appendChild(editBtn);

      // Append row
      row.appendChild(nameCell);
      row.appendChild(addressCell);
      row.appendChild(cityCell);
      row.appendChild(stateCell);
      row.appendChild(emailCell);
      row.appendChild(phoneCell);
      row.appendChild(actionsCell);

      tbody.appendChild(row);
    });
  }

  function fetchAllStudents() {
    const idToken = sessionStorage.getItem("id_token");

    fetch("https://y4ljikf327.execute-api.us-east-1.amazonaws.com/prod/student", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
    })
      .then((response) => response.json())
      .then((results) => {
        allStudents = results.students || [];
        renderTable(allStudents);
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
      });
  }

  // Add search filter
  document.getElementById("search").addEventListener("input", function (e) {
    const query = e.target.value.toLowerCase();
    const filtered = allStudents.filter((student) =>
      student.name.toLowerCase().includes(query) ||
      student.address.toLowerCase().includes(query) ||
      student.email.toLowerCase().includes(query)
    );
    renderTable(filtered);
  });

  fetchAllStudents();
});
