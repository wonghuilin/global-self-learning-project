const fileInput = document.getElementById("file");
const preview = document.getElementById("imagePreview");
const uploadBtn = document.getElementById("uploadBtn");
const idToken = sessionStorage.getItem("id_token");

// Preview the image
fileInput.addEventListener("change", function () {
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
      preview.style.display = "block";
    };
    reader.readAsDataURL(file);
  }
});

// Handle Upload
uploadBtn.addEventListener("click", async () => {
  const file = fileInput.files[0];
  if (!file) {
    alert("Please select a file first.");
    return;
  }

  const sub = sessionStorage.getItem("sub");
  if (!sub) {
    alert("User not authenticated.");
    return;
  }

  const reader = new FileReader();
  reader.onloadend = async () => {
    const base64Image = reader.result.split(",")[1];

    try {
      const response = await fetch(
        "https://cu4okz78g1.execute-api.us-east-1.amazonaws.com/dev/upload",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({ base64Image, sub }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        alert("Upload successful!");
        window.location.href = "/profile/profile.html";
      } else {
        alert("Upload failed.");
        console.error(result);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Upload error.");
    }
  };

  reader.readAsDataURL(file);
});
