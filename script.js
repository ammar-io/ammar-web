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

// GitHub icon SVG data
const githubIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.98-.399 3.003-.404 1.022.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.654 1.653.246 2.874.12 3.176.77.84 1.233 1.91 1.233 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`;
// LinkedIn icon SVG data
const linkedinIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.231zM5.8 7.401a1.59 1.59 0 0 1-1.548-1.602 1.59 1.59 0 1 1 1.548 1.602zm-1.292 13.051H7.09v-13.5H4.508v13.5zM22 24H2V0h20v24z"/></svg>`;

const socialLinks = [
  {
    href: "https://github.com/ammar-io",
    icon: githubIcon,
  },
  {
    href: "https://www.linkedin.com/in/aali02/",
    icon: linkedinIcon,
  },
];

function renderSocials() {
  const socialContainers = document.querySelectorAll(".social-links");
  socialContainers.forEach((socialsContainer) => {
    socialLinks.forEach((link) => {
      const a = document.createElement("a");
      a.href = link.href;
      a.classList.add("social-icon-link");
      a.innerHTML = link.icon;
      socialsContainer.appendChild(a);
    });
  });
}

renderProjects();
renderSocials();