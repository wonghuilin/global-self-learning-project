document.addEventListener('DOMContentLoaded', function () {
  const API_URL = "http://localhost:8081/course";
  let allCourses = [];
  let filteredCourses = [];
  let currentPage = 1;
  const coursesPerPage = 9;

  const courseContainer = document.getElementById("courseContainer");
  const paginationContainer = document.getElementById("paginationContainer");
  const schoolFilter = document.getElementById("schoolFilter");
  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");
  const toggleFilter = document.getElementById("toggleFilter");
  const filterSection = document.getElementById("filterSection");

  // Toggle filter panel
  toggleFilter.addEventListener('click', () => {
    filterSection.classList.toggle('d-none');
  });

  // Load all courses
  async function loadCourses() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to fetch courses");
      const data = await response.json();

      // Support both { courses: [...] } and plain [...]
      allCourses = Array.isArray(data) ? data : data.courses;
      filteredCourses = allCourses;

      populateSchoolFilter(allCourses);
      renderCourses();
    } catch (error) {
      courseContainer.innerHTML = "<p>Error loading courses.</p>";
      console.error(error);
    }
  }
  
  // Populate school filter dropdown
  function populateSchoolFilter(courses) {
    const schools = [...new Set(courses.map(course => course.school))].sort();
    schools.forEach(school => {
      const option = document.createElement("option");
      option.value = school;
      option.textContent = school;
      schoolFilter.appendChild(option);
    });
  }

  // Render paginated course cards
  function renderCourses() {
    const start = (currentPage - 1) * coursesPerPage;
    const end = start + coursesPerPage;
    const paginatedCourses = filteredCourses.slice(start, end);

    courseContainer.innerHTML = "";

    if (!filteredCourses.length) {
      courseContainer.innerHTML = "<p>No courses found.</p>";
      paginationContainer.innerHTML = "";
      return;
    }

    paginatedCourses.forEach(course => {
      const card = `
        <div class="col-md-4 mb-4">
          <div class="card h-100 shadow-sm">
            <img src="../img/course.png" class="card-img-top" alt="${course.name}" />
            <div class="card-body">
              <h5 class="card-title">
                <span class="text-primary">${course.code}</span> ${course.name}
              </h5>
              <p><strong>School:</strong> ${course.school}</p>
              <p class="card-text">${course.description}</p>
            </div>
          </div>
        </div>
      `;
      courseContainer.innerHTML += card;
    });

    renderPagination();
  }

  // Render pagination buttons
  function renderPagination() {
    const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
    paginationContainer.innerHTML = "";

    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
      const li = document.createElement("li");
      li.className = `page-item ${i === currentPage ? 'active' : ''}`;
      li.innerHTML = `<button class="page-link">${i}</button>`;

      li.addEventListener("click", () => {
        currentPage = i;
        renderCourses(); // Now works with filteredCourses
      });

      paginationContainer.appendChild(li);
    }
  }

  // Apply search and filter together
  function applyFilters() {
    const keyword = searchInput.value.toLowerCase().trim();
    const selectedSchool = schoolFilter.value;

    filteredCourses = allCourses.filter(course => {
      const name = (course.name || "").toLowerCase();
      const code = (course.code || "").toLowerCase();
      const description = (course.description || "").toLowerCase();
      const school = (course.school || "");

      const matchesKeyword =
        name.includes(keyword) ||
        code.includes(keyword) ||
        description.includes(keyword);

      const matchesSchool = selectedSchool === "" || school === selectedSchool;

      return matchesKeyword && matchesSchool;
    });

    currentPage = 1;
    renderCourses();
  }

  // Search submit
  if (searchForm) {
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      applyFilters();
    });
  }

  // Filter by school
  if (schoolFilter) {
    schoolFilter.addEventListener("change", function () {
      applyFilters();
    });
  }

  // Start
  loadCourses();
});
