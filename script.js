// Project Data
const projects = [
  {
    title: "Project 1",
    status: "Completed",
    category: "Personal",
    description: "Description for Project 1.",
    url: "https://www.example.com/project1",
  },
  {
    title: "Project 2",
    status: "Prototyped",
    category: "Club Project",
    description: "Description for Project 2.",
    url: "https://www.example.com/project2",
  },
  {
    title: "Project 3",
    status: "In Progress",
    category: "Internship",
    description: "Description for Project 3.",
    url: "https://www.example.com/project3",
  },
];

// Render Projects
function renderProjects() {
  const projectsContainer = document.getElementById("projects-container");
  if (projectsContainer) {
    projects.forEach((project) => {
      const card = document.createElement("div");
      card.classList.add("project-card");

      const titleLink = document.createElement("a");
      titleLink.href = project.url;
      titleLink.classList.add("project-title");
      titleLink.textContent = project.title;
      card.appendChild(titleLink);

      const statusBadge = document.createElement("span");
      statusBadge.classList.add("status-badge");
      statusBadge.textContent = project.status;
      card.appendChild(statusBadge);

      const categoryTag = document.createElement("span");
      categoryTag.classList.add("category-tag");
      categoryTag.textContent = project.category;
      card.appendChild(categoryTag);

      const description = document.createElement("p");
      description.classList.add("project-description");
      description.textContent = project.description;
      card.appendChild(description);

      const externalLink = document.createElement("a");
      externalLink.href = project.url;
      externalLink.classList.add("external-link");
      externalLink.textContent = "↗"; // Placeholder icon, can be replaced with SVG
      card.appendChild(externalLink);

      projectsContainer.appendChild(card);
    });
  }
}

// Footer Socials
function renderSocials() {
  const socialLinks = [
    { href: "https://github.com/ammar-io", icon: "github" }, // Replace 'github' with appropriate SVG or icon class
    { href: "https://www.linkedin.com/in/ammar-io/", icon: "linkedin" }, // Replace 'linkedin' with appropriate SVG or icon class
    { href: "https://www.ammaralt.com", icon: "personal" }, // Replace 'personal' with appropriate SVG or icon class
  ];

  const socialsContainer = document.querySelector(".social-links");
  if (socialsContainer) {
    socialLinks.forEach((link) => {
      const linkElement = document.createElement("a");
      linkElement.href = link.href;
      linkElement.innerHTML = `<svg></svg>`; // Add your SVG icon here or use a class name for an icon font
      socialsContainer.appendChild(linkElement);
    });
  }
}

renderProjects();
renderSocials();