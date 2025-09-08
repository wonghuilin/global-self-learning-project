document.getElementById("withdrawForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const data = {
    studentName: document.getElementById("studentName").value.trim(),
    courseCode: document.getElementById("courseCode").value.trim(),
    email: document.getElementById("email").value.trim(),
    reason: document.getElementById("reason").value.trim(),
  };

  fetch("http://localhost:8081/course/withdraw", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((res) => {
      const messageEl = document.getElementById("message");
      if (res.message) {
        messageEl.innerText = res.message;
        messageEl.style.color = "green";
        document.getElementById("withdrawForm").reset();
      } else {
        messageEl.innerText = "Something went wrong.";
        messageEl.style.color = "red";
      }
    })
    .catch((err) => {
      console.error("Error:", err);
      const messageEl = document.getElementById("message");
      messageEl.innerText = "Server error occurred.";
      messageEl.style.color = "red";
    });
});
