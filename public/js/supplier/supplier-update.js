const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const studentId = urlParams.get("id");
const idToken = sessionStorage.getItem("id_token");

window.addEventListener("DOMContentLoaded", function () {
  fetch(`/form-fields`)
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("form-fields-placeholder").innerHTML = data;
      fetchStudent();
    })
    .catch((err) => console.error("Error loading form fields:", err));

  // Fetch existing student data
  function fetchStudent() {
    fetch(`https://y4ljikf327.execute-api.us-east-1.amazonaws.com/prod/student/${studentId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
    })
      .then((response) => response.json())
      .then((student) => {
        document.getElementById("id").value = student.id || "";
        document.getElementById("name").value = student.name || "";
        document.getElementById("address").value = student.address || "";
        document.getElementById("city").value = student.city || "";
        document.getElementById("state").value = student.state || "";
        document.getElementById("email").value = student.email || "";
        document.getElementById("phone").value = student.phone || "";
        document.getElementById(
          "modal-body-text"
        ).textContent = `Are you sure you want to delete student ${student.name}?`;
      })
      .catch((error) => console.error("Error fetching student:", error));
  }
});

//  Delete Student
document.getElementById("deleteStudent").addEventListener("click", function (event) {
  event.preventDefault();

  const deleteUser = async () => {
    try {
      const response = await fetch(
        `https://y4ljikf327.execute-api.us-east-1.amazonaws.com/prod/student/${studentId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        window.location.href = `/500.html?error=${errorBody.message || 'Delete failed'}`;
        return;
      }

      // Success
      alert("Student successfully deleted");
      window.location.href = "supplier-list-all.html"; 

    } catch (error) {
      console.error(error);
      window.location.href = `/500.html?error=${error}`;
    }
  };

  deleteUser();
});

// Upadate student
document.getElementById("updateStudent").addEventListener("click", function (event) {
  event.preventDefault();

  const fields = document.getElementsByClassName("form-control");
  const errorBox = document.getElementsByClassName("mt-2")[0];
  errorBox.innerHTML = "";

  // Validate all fields are filled
  for (let i = 0; i < fields.length; i++) {
    if (fields[i].value.trim() === "") {
      const errorMsg = document.createElement("div");
      errorMsg.className = "alert alert-warning";
      errorMsg.role = "alert";
      errorMsg.textContent = "Please fill in all fields before submitting.";
      errorBox.appendChild(errorMsg);
      return; 
    }
  }

  // Send update request
  const updateUser = async () => {
    try {
      const response = await fetch(
        `https://y4ljikf327.execute-api.us-east-1.amazonaws.com/prod/student/${studentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            id: studentId,
            name: fields[0].value,
            address: fields[1].value,
            city: fields[2].value,
            state: fields[3].value,
            email: fields[4].value,
            phone: fields[5].value,
          }),
        }
      );

      const results = await response.json();

      if (response.status === 400) {
        results.errors.forEach(err => {
          const errorMsg = document.createElement("div");
          errorMsg.className = "alert alert-warning";
          errorMsg.role = "alert";
          errorMsg.textContent = err.msg;
          errorBox.appendChild(errorMsg);
        });
      } else if (response.status === 500 || response.status === 404) {
        window.location.href = `/500.html?error=${results.message}`;
      } else {
        alert("Student successfully updated");
        window.location.href = "supplier-list-all.html";
      }

    } catch (error) {
      console.error(error);
      const errorMsg = document.createElement("div");
      errorMsg.className = "alert alert-danger";
      errorMsg.role = "alert";
      errorMsg.textContent = "An error occurred while updating the student.";
      errorBox.appendChild(errorMsg);
    }
  };

  updateUser();
});
