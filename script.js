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

function renderProjects() {
  const projectsContainer = document.getElementById("projects-container");
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
    externalLink.textContent = "↗";
    card.appendChild(externalLink);

    projectsContainer.appendChild(card);
  });
}

const socialLinks = [
  { href: "https://github.com/ammar-io", name: "GitHub" },
  { href: "https://www.linkedin.com/in/ammar-io/", name: "LinkedIn" },
  { href: "https://www.ammaralt.com", name: "Personal Website" },
];

function renderSocials() {
  const socialContainers = document.querySelectorAll(".social-links");
  socialContainers.forEach((socialsContainer) => {
    socialLinks.forEach((link) => {
      const linkElement = document.createElement("a");
      linkElement.href = link.href;
      linkElement.textContent = link.name;
      socialsContainer.appendChild(linkElement);
    });
  });
}

renderProjects();
renderSocials();