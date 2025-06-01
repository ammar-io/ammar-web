let scene, camera, renderer;
let brain;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

// Physics-based movement parameters
let rotationVelocityX = 0;
let rotationVelocityY = 0;
const MOUSE_SENSITIVITY = 0.003; // Existing sensitivity
const ACCELERATION_FACTOR = 0.0002; // How quickly the sphere accelerates towards the mouse
const DAMPING_FACTOR = 0.95; // How quickly the rotation slows down

// Create circle texture for points
function createCircleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');

    // Draw a soft circle with a gradient
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.5, 'rgba(255,255,255,0.8)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');

    ctx.beginPath();
    ctx.arc(16, 16, 16, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    return new THREE.CanvasTexture(canvas);
}

// Initialize the scene
function init() {
    // Scene setup
    scene = new THREE.Scene();
    
    // Canvas element
    const canvas = document.querySelector('#canvas');
    
    // Check if canvas exists
    if (!canvas) {
        console.error("Canvas element not found!");
        return;
    }

    // Set a dark background (like on hys-inc.jp)
    renderer = new THREE.WebGLRenderer({ 
        canvas: canvas,
        alpha: true,  // allow transparency so CSS shows through
        antialias: true
    });
    renderer.setClearColor('#F5F5F5', 1); // Set to match background color
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    // Create brain-like geometry
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const radius = 5; // Slightly smaller for better proportion

    // Shape parameters
    const NUM_POINTS = 2000;

    // Create sphere geometry points
    for (let i = 0; i < NUM_POINTS; i++) {
        const theta = Math.random() * 2 * Math.PI;
        // Use random cosine for uniform distribution on a sphere
        const phi = Math.acos(2 * Math.random() - 1);

        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);

        vertices.push(x, y, z);
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    // After setting attributes on geometry, store a copy of the original positions:
    geometry.userData.originalPositions = geometry.attributes.position.array.slice();

    // Create circle texture (using a soft white circle)
    const circleTexture = createCircleTexture();

    // Use subtle points to match the minimalist aesthetic
    const pointMaterial = new THREE.PointsMaterial({
        map: circleTexture,
        alphaTest: 0.5,
        color: '#483D8B', // Keep the dark purple for dots
        size: 0.06, // smaller dots for cleaner look
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true,
        depthWrite: false
    });

    brain = new THREE.Points(geometry, pointMaterial);
    scene.add(brain);

    // Create connections between points with subtle lines
    const lineGeometry = new THREE.BufferGeometry();
    const lineVertices = [];
    
    // Track which nodes have connections
    const connectedNodes = new Set();
    
    // Parameters for connections
    const MAX_CONNECTIONS = 2000; // Increased for better connectivity
    const MIN_DISTANCE = 2;
    const MAX_DISTANCE = 6;
    let connectionCount = 0;
    
    // First pass: create randomized connections
    for (let i = 0; i < vertices.length; i += 3) {
        if (connectionCount >= MAX_CONNECTIONS) break;
        
        // Number of connections for this node (1-3)
        const numConnections = Math.floor(Math.random() * 3) + 1;
        let nodeConnections = 0;
        
        // Try to create the desired number of connections
        for (let attempt = 0; attempt < 10 && nodeConnections < numConnections; attempt++) {
            // Pick a random node to connect to
            const j = Math.floor(Math.random() * (vertices.length / 3)) * 3;
            
            // Skip self-connections
            if (i === j) continue;
            
            const dx = vertices[i] - vertices[j];
            const dy = vertices[i + 1] - vertices[j + 1];
            const dz = vertices[i + 2] - vertices[j + 2];
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
            
            if (distance > MIN_DISTANCE && distance < MAX_DISTANCE) {
                lineVertices.push(vertices[i], vertices[i + 1], vertices[i + 2]);
                lineVertices.push(vertices[j], vertices[j + 1], vertices[j + 2]);
                connectionCount++;
                nodeConnections++;
                
                // Mark both nodes as connected
                connectedNodes.add(Math.floor(i/3));
                connectedNodes.add(Math.floor(j/3));
                
                if (connectionCount >= MAX_CONNECTIONS) break;
            }
        }
    }
    
    // Second pass: ensure each node has at least one connection
    for (let i = 0; i < vertices.length / 3; i++) {
        if (!connectedNodes.has(i) && connectionCount < MAX_CONNECTIONS) {
            // Find the nearest node to connect to
            let minDistance = Infinity;
            let nearestNode = -1;
            
            const baseIndex = i * 3;
            for (let j = 0; j < vertices.length / 3; j++) {
                if (i === j) continue;
                
                const targetIndex = j * 3;
                const dx = vertices[baseIndex] - vertices[targetIndex];
                const dy = vertices[baseIndex + 1] - vertices[targetIndex + 1];
                const dz = vertices[baseIndex + 2] - vertices[targetIndex + 2];
                const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
                
                if (distance < minDistance && distance > MIN_DISTANCE) {
                    minDistance = distance;
                    nearestNode = j;
                }
            }
            
            if (nearestNode >= 0) {
                const targetIndex = nearestNode * 3;
                lineVertices.push(
                    vertices[baseIndex], vertices[baseIndex + 1], vertices[baseIndex + 2],
                    vertices[targetIndex], vertices[targetIndex + 1], vertices[targetIndex + 2]
                );
                connectionCount++;
                connectedNodes.add(i);
                connectedNodes.add(nearestNode);
            }
        }
    }

    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(lineVertices, 3));
    const lineMaterial = new THREE.LineBasicMaterial({
        color: '#483D8B',
        transparent: true,
        opacity: 0.05, // very subtle connections
        linewidth: 1,
    });
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    // Position camera
    camera.position.z = 12;

    // Event listeners
    document.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onWindowResize);
}

// Handle mouse movement
function onMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * MOUSE_SENSITIVITY; // Use constant
    mouseY = (event.clientY - windowHalfY) * MOUSE_SENSITIVITY; // Use constant
}

// Handle window resize
function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Physics-based rotation for smoother and more dynamic interaction
    if (brain) {
        // Calculate acceleration towards the target rotation (mouseX, mouseY are target offsets)
        const accelX = (mouseY - brain.rotation.x) * ACCELERATION_FACTOR; // Target is mouseY for x-rotation
        const accelY = (mouseX - brain.rotation.y) * ACCELERATION_FACTOR; // Target is mouseX for y-rotation

        // Update velocities
        rotationVelocityX += accelX;
        rotationVelocityY += accelY;

        // Apply damping to velocities
        rotationVelocityX *= DAMPING_FACTOR;
        rotationVelocityY *= DAMPING_FACTOR;

        // Update brain rotation
        brain.rotation.x += rotationVelocityX;
        brain.rotation.y += rotationVelocityY;
        
        // Subtle pulsing effect
        const scale = 1 + Math.sin(Date.now() * 0.001) * 0.03; // More subtle pulse
        brain.scale.set(scale, scale, scale);

        // Subtle shake effect
        const shakeAmplitude = 0.015; // Reduced amplitude
        const positions = brain.geometry.attributes.position.array;
        const originalPositions = brain.geometry.userData.originalPositions;
        const time = Date.now() * 0.003;
        for (let i = 0; i < positions.length; i++) {
            positions[i] = originalPositions[i] + shakeAmplitude * Math.sin(time + i * 0.1);
        }
        brain.geometry.attributes.position.needsUpdate = true;
    }

    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

// Update this section in your script.js file - Project Data
const projects = [
  {
    title: "MindSync",
    status: "Prototyping",
    statusColor: "blue",
    category: "Personal Project",
    description: "MindSync is an innovative project that uses EEG signals for real-time emotional state detection. It integrates with VR using C# and Unity, creating a closed-loop cognitive therapy experience that dynamically adjusts visual feedback to improve the user's attentional control and emotional regulation.",
    url: "https://github.com/ammar-io/MindSync",
    technologies: ["Unity-VR", "C#", "UDP", "Python", "Muse-EEG", "OpenBCI-EEG"]
  },
  {
    title: "KF Cursor Tracker",
    status: "Active",
    statusColor: "green",
    category: "Computer Vision",
    description: "An implementation of the Kalman Filter algorithm for accurate cursor prediction and tracking. This project demonstrates the application of state estimation techniques in computer vision, using OpenCV for visualization and real-time processing.",
    url: "https://github.com/ammar-io/kalman-cursor",
    technologies: ["Python", "OpenCV", "Kalman Filter"]
  },
  {
    title: "Recycling Detection System",
    status: "Completed",
    statusColor: "purple",
    category: "Computer Vision",
    description: "Developed an intelligent waste management system that uses YOLO-V8 computer vision models to automatically detect and sort recyclable materials. This project was implemented for the UIUC campus to improve recycling rates and reduce contamination in waste streams.",
    url: "https://github.com/ammar-io/RRR",
    technologies: ["YOLO-V8", "Python", "Computer Vision", "IoT"]
  },
  {
    title: "ZKP Auditing System",
    status: "Completed",
    statusColor: "purple",
    category: "Blockchain Research",
    description: "A cutting-edge blockchain auditing system that leverages Zero-Knowledge Proofs (ZKPs) for efficient and private digital asset validation. Built with Python, Circom, and Snark.js, this system provides a more efficient alternative to traditional blockchain auditing methods while maintaining security and privacy.",
    url: "https://github.com/ammar-io/Blockchain-Auditor",
    technologies: ["Zero-Knowledge Proofs", "Python", "Circom", "Snark.js"]
  }
];

// Project images using Google DeepMind related visuals
const projectImages = {
  "mindsync": "https://storage.googleapis.com/deepmind-media/DeepMind.com/Blog/understanding-agent-cooperation/img/understanding-agent-cooperation-1.png",
  "kalman-filter": "https://storage.googleapis.com/deepmind-media/DeepMind.com/images/alphastar/alphastar-social.jpg",
  "recycling": "https://storage.googleapis.com/deepmind-media/DeepMind.com/Images/learning-to-simulate-complex-physics-social.jpg",
  "blockchain": "https://storage.googleapis.com/deepmind-media/DeepMind.com/Images/ai-for-science-1.jpg"
};

// Map project titles to image keys
const getProjectImage = (title) => {
  const key = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  return projectImages[key] || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
};

// Render projects to the DOM
function renderProjects() {
  const projectsContainer = document.getElementById("projects-container");
  if (!projectsContainer) return;
  
  projectsContainer.innerHTML = ''; // Clear existing content
  
  projects.forEach((project) => {
    // Create card container
    const card = document.createElement("div");
    card.className = "project-card";
    
    // Create project image
    const projectImage = document.createElement("div");
    projectImage.className = "project-image";
    projectImage.style.backgroundImage = `url(${getProjectImage(project.title)})`;
    
    // Create project content container
    const projectContent = document.createElement("div");
    projectContent.className = "project-content";
    
    // Create header section (title + status)
    const header = document.createElement("div");
    header.className = "project-header";
    
    const titleLink = document.createElement("a");
    titleLink.href = project.url;
    titleLink.className = "project-title";
    titleLink.textContent = project.title;
    titleLink.target = "_blank";
    titleLink.rel = "noopener noreferrer";
    
    const statusBadge = document.createElement("span");
    statusBadge.className = `status-badge status-${project.statusColor || 'blue'}`;
    statusBadge.textContent = project.status;
    
    header.appendChild(titleLink);
    header.appendChild(statusBadge);
    
    // Create category tag
    const categoryTag = document.createElement("span");
    categoryTag.className = "project-category";
    categoryTag.textContent = project.category;
    
    // Create description
    const description = document.createElement("p");
    description.className = "project-description";
    description.textContent = project.description;
    
    // Create technologies container
    const techContainer = document.createElement("div");
    techContainer.className = "project-technologies";
    
    if (project.technologies && project.technologies.length > 0) {
      project.technologies.forEach(tech => {
        const techTag = document.createElement("span");
        techTag.className = "tech-tag";
        techTag.textContent = tech;
        techContainer.appendChild(techTag);
      });
    }
    
    // Create footer with external link
    const footer = document.createElement("div");
    footer.className = "project-footer";
    
    const externalLink = document.createElement("a");
    externalLink.href = project.url;
    externalLink.className = "external-link";
    externalLink.textContent = "View Project";
    externalLink.target = "_blank";
    externalLink.rel = "noopener noreferrer";
    
    // Add external link icon
    const externalIcon = document.createElement("span");
    externalIcon.innerHTML = '↗';
    externalLink.appendChild(externalIcon);
    
    footer.appendChild(externalLink);
    
    // Assemble the card
    projectContent.appendChild(header);
    projectContent.appendChild(categoryTag);
    projectContent.appendChild(description);
    projectContent.appendChild(techContainer);
    projectContent.appendChild(footer);
    
    card.appendChild(projectImage);
    card.appendChild(projectContent);
    
    projectsContainer.appendChild(card);
  });
}

// GitHub icon SVG data
const githubIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.98-.399 3.003-.404 1.022.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.654 1.653.246 2.874.12 3.176.77.84 1.233 1.91 1.233 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`;

// LinkedIn icon SVG data
const linkedinIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.231zM5.8 7.401a1.59 1.59 0 0 1-1.548-1.602 1.59 1.59 0 1 1 1.548 1.602zm-1.292 13.051H7.09v-13.5H4.508v13.5zM22 24H2V0h20v24z"/></svg>`;

// Social Links Data
const socialLinks = [
    { name: 'GitHub', href: 'https://github.com/ammar-io', icon: '<svg viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>' },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/in/aali02/', icon: '<svg viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>' },
    { name: 'Email', href: 'mailto:ammar.neuroai@gmail.com', icon: '<svg viewBox="0 0 24 24"><path d="M0 3v18h24v-18h-24zm21.518 2l-9.518 7.713-9.518-7.713h19.036zm-19.518 14v-11.817l10 8.104 10-8.104v11.817h-20z"/></svg>' }
];

// Render social links to the DOM
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

// Wait for DOM to be fully loaded before running
document.addEventListener('DOMContentLoaded', () => {
  // Initialize the 3D brain visualization
  try {
    init();
    animate();
    console.log("3D visualization initialized");
  } catch (e) {
    console.error("Error initializing 3D visualization:", e);
  }
  
  // Render projects and social links
  renderProjects();
  renderSocials();
});
