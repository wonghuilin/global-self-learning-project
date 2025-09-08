window.addEventListener("DOMContentLoaded", async function () {
  const idToken = sessionStorage.getItem("id_token");
  const userSub = sessionStorage.getItem("sub");

  if (!idToken || !userSub) {
    alert("You are not logged in.");
    window.location.href = "/";
    return;
  }

  try {
    const response = await fetch(
      `https://k1r42qm6ti.execute-api.us-east-1.amazonaws.com/prod/students/sub/${userSub}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
      }
    );

    const student = await response.json();

    document.getElementById("student-id").textContent = student.id;
    document.getElementById("student-name").textContent = student.name;
    document.getElementById("student-email").textContent = student.email;
    document.getElementById("student-address").textContent = student.address;
    document.getElementById("student-city").textContent = student.city;
    document.getElementById("student-state").textContent = student.state;
    document.getElementById("student-phone").textContent = student.phone;

    document.getElementById("profile-img").src = student.profile_img || "/img/Profile/profile-icon.png";
    document.getElementById("update-image-btn").href = `/profile/upload-image.html`;
  } catch (err) {
    console.error("Error loading profile:", err);
    alert("Failed to load profile.");
  }
});
