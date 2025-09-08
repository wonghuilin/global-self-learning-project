document.addEventListener("DOMContentLoaded", function() {
  const submitBtn = document.getElementById("createSupplier");
  if (!submitBtn) return;

  submitBtn.addEventListener("click", function(event) {
    event.preventDefault();

    const fields = document.getElementsByClassName("form-control");
    const errorBox = document.getElementsByClassName("mt-2")[0];
    errorBox.innerHTML = ""; 

    // Check if all fields are filled
    let allFilled = true;
    for (let i = 0; i < fields.length; i++) {
      if (fields[i].value.trim() === "") {
        allFilled = false;
        const errorMsg = document.createElement("div");
        errorMsg.className = "alert alert-warning";
        errorMsg.role = "alert";
        errorMsg.textContent = "Please fill in all fields before submitting.";
        errorBox.appendChild(errorMsg);
        break; 
      }
    }

    if (!allFilled) return; 

    const idToken = sessionStorage.getItem("id_token");

    // Submit the form data
    fetch(`https://y4ljikf327.execute-api.us-east-1.amazonaws.com/prod/student`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        name: fields[0].value,
        address: fields[1].value,
        city: fields[2].value,
        state: fields[3].value,
        email: fields[4].value,
        phone: fields[5].value,
      }),
    })
    .then(response => response.json().then(results => ({ status: response.status, body: results })))
    .then(({ status, body }) => {
      errorBox.innerHTML = ""; 

      if (status === 400) {
        body.errors.forEach(err => {
          const errorMsg = document.createElement("div");
          errorMsg.className = "alert alert-warning";
          errorMsg.role = "alert";
          errorMsg.textContent = err.msg;
          errorBox.appendChild(errorMsg);
        });
      } else if (status === 500) {
        window.location.href = `/500.html?error=${body.message}`;
      } else {
        alert("Student successfully created");
        window.location.href = "supplier-list-all.html";
      }
    })
    .catch(error => {
      console.error(error);
    });
  });
});
