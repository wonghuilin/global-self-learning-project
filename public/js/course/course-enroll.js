document.addEventListener("DOMContentLoaded", function () {
  const courseOptions = [
    { code: "S01", name: "Diploma in Electrical & Electronic Engineering" },
    { code: "S02", name: "Diploma in Computer Engineering" },
    { code: "S03", name: "Diploma in Business Administration" },
    { code: "S04", name: "Diploma in Data Science" },
    { code: "S05", name: "Diploma in Cybersecurity" },
    { code: "S06", name: "Diploma in Digital Media Design" },
    { code: "S07", name: "Diploma in Mechanical Engineering" },
    { code: "S08", name: "Diploma in Hospitality Management" },
    { code: "S09", name: "Diploma in Applied AI and Analytics" },
    { code: "S10", name: "Diploma in Financial Technology (FinTech)" },
    { code: "S11", name: "Diploma in Media, Arts and Design" },
    { code: "S12", name: "Diploma in Common Engineering Programme" },
  ];

  // Populate dropdowns
  document.querySelectorAll(".course-select").forEach(select => {
    courseOptions.forEach(course => {
      const opt = document.createElement("option");
      opt.value = course.code;
      opt.textContent = `${course.code} - ${course.name}`;
      select.appendChild(opt);
    });
  });

  document.getElementById("enrollForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const studentName = document.getElementById("studentName").value.trim();
    const email = document.getElementById("email").value.trim();
    const selectedCourses = [
      document.getElementById("courseCode1").value,
      document.getElementById("courseCode2").value,
      document.getElementById("courseCode3").value,
    ];

    // Check for duplicate selections
    const uniqueCourses = new Set(selectedCourses);
    const messageEl = document.getElementById("message");
    if (uniqueCourses.size < 3) {
      messageEl.innerText = "Please select three different courses.";
      messageEl.style.color = "red";
      return;
    }

    const enrollDate = new Date().toISOString().split("T")[0];

    // Submit each course enrollment
    Promise.all(
      selectedCourses.map(courseCode => {
        return fetch("http://localhost:8081/course/enroll", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ studentName, email, courseCode, enrollDate }),
        });
      })
    )
      .then(responses => Promise.all(responses.map(r => r.json())))
      .then(results => {
        const hasError = results.some(r => r.message !== "Enrolled successfully.");
        if (hasError) {
          messageEl.innerText = "Some enrollments failed. Please try again.";
          messageEl.style.color = "red";
        } else {
          messageEl.innerText = "Enrolled in all 3 courses successfully!";
          messageEl.style.color = "green";
          document.getElementById("enrollForm").reset();
        }
      })
      .catch(err => {
        console.error("Enrollment error:", err);
        messageEl.innerText = "Server error occurred.";
        messageEl.style.color = "red";
      });
  });
});
