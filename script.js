// Global variables
let scene, camera, renderer, brain, connections;
let mouseX = 0, mouseY = 0;
let rotationVelocityX = 0, rotationVelocityY = 0;
let animationFrame;

// Animation parameters
const MOUSE_SENSITIVITY = 0.003;
const ACCELERATION_FACTOR = 0.003;
const DAMPING_FACTOR = 0.97;

// Enhanced Project Data with categorization and filtering
const projects = [
  {
    title: "MindSync",
    status: "Prototyping",
    statusColor: "blue",
    category: "neurotechnology",
    categoryLabel: "Neurotechnology",
    summary: "An immersive VR neurofeedback system using real-time EEG data to help users improve attentional control.",
    problem: "There's a need for more engaging, real-time feedback in cognitive therapy. Existing tools often lack direct, closed-loop interaction with a user's mental state.",
    solution: "Engineered a closed-loop system using EEG for real-time emotional state detection. I integrated this with a custom VR environment in Unity that dynamically adjusts visual feedback, creating an immersive neurofeedback experience.",
    impact: "The prototype successfully demonstrated the viability of using consumer-grade EEG hardware for real-time therapeutic feedback, laying the groundwork for future studies on attentional control.",
    tech: ["C#", "Unity", "EEG", "VR", "UDP"],
    url: "https://github.com/ammar-io/MindSync",
    github: "https://github.com/ammar-io/MindSync",
    featured: true
  },
  {
    title: "Kalman Filter Cursor Tracker",
    status: "Developing",
    statusColor: "green",
    category: "machine-learning",
    categoryLabel: "Machine Learning",
    summary: "A predictive cursor tracking system using a Kalman Filter to enhance human-computer interaction for accessibility.",
    problem: "Standard cursor tracking can be imprecise. Predictive algorithms are needed to enhance human-computer interaction, especially for accessibility applications.",
    solution: "Implemented a Kalman Filter using OpenCV and Python to predict cursor movement based on its current trajectory, smoothing motion and anticipating user intent.",
    impact: "This predictive tracking system can be integrated into assistive technologies to create more fluid and less frustrating user experiences for individuals with motor impairments.",
    tech: ["Python", "OpenCV", "Kalman Filter", "Computer Vision"],
    url: "https://github.com/ammar-io/kalman-cursor",
    github: "https://github.com/ammar-io/kalman-cursor",
    featured: false
  },
  {
    title: "Recycling Detection Bins",
    status: "Prototyped",
    statusColor: "purple",
    category: "computer-vision",
    categoryLabel: "Computer Vision",
    summary: "A smart waste bin that uses a YOLO-V8 model to automatically identify and sort recyclable materials.",
    problem: "Manual sorting of waste on the UIUC campus is inefficient and prone to error, leading to contamination in recycling streams.",
    solution: "Trained and deployed a YOLO-V8 computer vision model to accurately detect and classify recyclable materials. This model controls a physical sorting mechanism on a smart waste bin.",
    impact: "The system provides a low-cost, automated solution to improve recycling purity. It achieved 96% accuracy in tests and was presented at the university's engineering showcase.",
    tech: ["Python", "YOLO-V8", "Computer Vision", "IoT"],
    url: "https://github.com/ammar-io/RRR",
    github: "https://github.com/ammar-io/RRR",
    featured: true
  },
  {
    title: "Blockchain Auditing System",
    status: "Prototyped",
    statusColor: "purple",
    category: "research",
    categoryLabel: "Research",
    summary: "A novel auditing system using Zero-Knowledge Proofs to drastically accelerate the validation of digital assets on a blockchain.",
    problem: "Auditing digital assets on a blockchain is computationally expensive and slow, creating a bottleneck for financial analysis and verification.",
    solution: "Utilized Zero-Knowledge Proofs (ZKPs) to develop a state-of-the-art blockchain auditing system. The system, built with Python, Circom, and Snark.js, enables rapid validation of digital assets.",
    impact: "This research demonstrates a novel method for significantly accelerating blockchain analysis, with potential applications in fintech and secure, private transactions.",
    tech: ["Python", "Circom", "JavaScript", "Zero-Knowledge Proofs"],
    url: "https://github.com/ammar-io/Blockchain-Auditor",
    github: "https://github.com/ammar-io/Blockchain-Auditor",
    featured: false
  },
  {
    title: "EEG Signal Classification Pipeline",
    status: "Published",
    statusColor: "green",
    category: "neurotechnology",
    categoryLabel: "Neurotechnology",
    summary: "A deep learning pipeline that classifies motor imagery from EEG signals with 94% accuracy for BCI applications.",
    problem: "High latency and low accuracy in existing Brain-Computer Interface (BCI) systems hinder the intuitive, real-time control of neuroprosthetics.",
    solution: "Developed an advanced deep learning pipeline using CNNs and RNNs to classify motor imagery from EEG signals. The pipeline was optimized for real-time processing.",
    impact: "Achieved 94% accuracy in motor imagery classification, a 12% improvement over baseline models. The findings were published and form the basis of a new open-source BCI control library.",
    tech: ["Python", "TensorFlow", "MNE-Python", "Signal Processing"],
    url: "https://github.com/ammar-io/eeg-classifier",
    github: "https://github.com/ammar-io/eeg-classifier",
    featured: true
  },
  {
    title: "Neural Network Visualization Tool",
    status: "Open Source",
    statusColor: "blue",
    category: "open-source",
    categoryLabel: "Open Source",
    summary: "An interactive, open-source web tool for visualizing neural network architectures in 3D to aid in learning.",
    problem: "Understanding the architecture and training process of neural networks can be abstract and difficult for learners.",
    solution: "Created an interactive, web-based tool for visualizing neural network architectures in 3D. Built with Three.js and D3.js to serve as an educational resource.",
    impact: "The tool is available as an open-source project, providing a hands-on way for students and developers to explore and understand deep learning concepts.",
    tech: ["JavaScript", "Three.js", "D3.js", "WebGL"],
    url: "https://github.com/ammar-io/neural-viz",
    github: "https://github.com/ammar-io/neural-viz",
    demo: "https://ammar-io.github.io/neural-viz",
    featured: false
  },
  {
    title: "Attention Training BCI",
    status: "Research",
    statusColor: "blue",
    category: "neurotechnology",
    categoryLabel: "Neurotechnology",
    summary: "A complete BCI system that uses real-time neurofeedback and gamification to help users train their attention.",
    problem: "Existing attention training methods often fail to keep users engaged and provide limited, subjective feedback on their cognitive state.",
    solution: "Built a complete brain-computer interface system for attention training that provides real-time neurofeedback. The system combines live EEG analysis with a gamified interface to enhance user focus.",
    impact: "The project is a core initiative of Neurotech UIUC, demonstrating a practical application of BCI for cognitive enhancement and providing a platform for further research.",
    tech: ["Python", "PyQt5", "OpenBCI", "Real-time Processing"],
    url: "https://github.com/ammar-io/attention-bci",
    github: "https://github.com/ammar-io/attention-bci",
    featured: true
  },
  {
    title: "Medical Image Segmentation",
    status: "Developing",
    statusColor: "green",
    category: "machine-learning",
    categoryLabel: "Machine Learning",
    summary: "A U-Net-based deep learning model to automate the segmentation of brain MRIs, assisting in faster diagnostics.",
    problem: "Manual segmentation of medical images (like MRIs) for diagnostics is time-consuming and subject to human error.",
    solution: "Developing deep learning models for automated medical image segmentation using U-Net architectures. The focus is on analyzing brain MRIs and CT scans.",
    impact: "This work aims to create a reliable, automated tool to assist radiologists, leading to faster and more accurate diagnoses.",
    tech: ["Python", "PyTorch", "Medical Imaging", "U-Net"],
    url: "https://github.com/ammar-io/med-seg",
    github: "https://github.com/ammar-io/med-seg",
    featured: false
  }
];

// Dark mode functionality
class DarkModeManager {
  constructor() {
    this.isDark = localStorage.getItem('darkMode') === 'true';
    this.toggle = document.getElementById('dark-mode-toggle');
    this.init();
  }

  init() {
    this.applyTheme();
    if (this.toggle) {
      this.toggle.addEventListener('click', () => this.toggleTheme());
    }
  }

  toggleTheme() {
    this.isDark = !this.isDark;
    localStorage.setItem('darkMode', this.isDark);
    this.applyTheme();
    this.updateNeuralVisualization();
  }

  applyTheme() {
    document.documentElement.setAttribute('data-theme', this.isDark ? 'dark' : 'light');
  }

  updateNeuralVisualization() {
    if (renderer) {
      const bgColor = this.isDark ? '#131C2E' : '#F8F9FB'; /* Updated to accurate palette */
      renderer.setClearColor(bgColor, 1);
    }
  }
}

// Navigation scroll effect
class NavigationManager {
  constructor() {
    this.nav = document.getElementById('global-nav');
    this.mobileToggle = document.getElementById('mobile-menu-toggle');
    this.init();
  }

  init() {
    window.addEventListener('scroll', () => this.handleScroll());
    if (this.mobileToggle) {
      this.mobileToggle.addEventListener('click', () => this.toggleMobileMenu());
    }
  }

  handleScroll() {
    if (this.nav) {
      if (window.scrollY > 50) {
        this.nav.classList.add('scrolled');
      } else {
        this.nav.classList.remove('scrolled');
      }
    }
  }

  toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
  }
}

// Animated counter for stats
class StatCounter {
  constructor(element, target, duration = 2000) {
    this.element = element;
    this.target = target;
    this.duration = duration;
    this.current = 0;
    this.increment = target / (duration / 16);
    this.isAnimating = false;
  }

  animate() {
    if (this.isAnimating) return;
    this.isAnimating = true;

    const updateCounter = () => {
      if (this.current < this.target) {
        this.current += this.increment;
        if (this.current > this.target) this.current = this.target;
        this.element.textContent = Math.floor(this.current);
        requestAnimationFrame(updateCounter);
      } else {
        this.isAnimating = false;
      }
    };

    updateCounter();
  }
}

// Stats animation manager
class StatsManager {
  constructor() {
    this.statsSection = document.querySelector('.stats-section');
    this.statItems = document.querySelectorAll('.stat-item');
    this.counters = [];
    this.hasAnimated = false;
    this.init();
  }

  init() {
    this.statItems.forEach(item => {
      const numberElement = item.querySelector('.stat-number');
      const target = parseInt(item.dataset.count) || 0;
      if (numberElement && target > 0) {
        this.counters.push(new StatCounter(numberElement, target));
      }
    });

    this.setupIntersectionObserver();
  }

  setupIntersectionObserver() {
    if (!this.statsSection) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.hasAnimated) {
          this.animateStats();
          this.hasAnimated = true;
        }
      });
    }, { threshold: 0.5 });

    observer.observe(this.statsSection);
  }

  animateStats() {
    this.counters.forEach((counter, index) => {
      setTimeout(() => {
        counter.animate();
      }, index * 200);
    });
  }
}

// Project carousel functionality
class ProjectCarousel {
  constructor() {
    this.carousel = document.querySelector('.project-carousel');
    this.track = document.getElementById('carousel-track');
    this.prevBtn = document.getElementById('carousel-prev');
    this.nextBtn = document.getElementById('carousel-next');
    this.dotsContainer = document.getElementById('carousel-dots');
    
    this.currentSlide = 0;
    this.projects = [];
    
    this.init();
  }

  init() {
    this.loadProjects();
    this.setupEventListeners();
    this.createDots();
    this.updateCarousel();
  }

  loadProjects() {
    // Use featured projects from the main projects array
    this.projects = projects.filter(project => project.featured).slice(0, 4);
    
    // If no featured projects, use the first 3 projects
    if (this.projects.length === 0) {
      this.projects = projects.slice(0, 3);
    }

    this.renderProjects();
  }

  renderProjects() {
    if (!this.track) return;

    this.track.innerHTML = this.projects.map(project => `
      <div class="project-card">
        <div class="project-content">
          <div class="project-meta">
            <span class="status-badge status-${project.statusColor}">${project.status}</span>
            <span class="category-tag">${project.categoryLabel}</span>
          </div>
          <h3>${project.title}</h3>
          <p class="project-summary">${project.summary}</p>
          <div class="project-tech">
            ${project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
          </div>
          <div class="project-links">
            <button class="btn btn-secondary view-details-btn" data-project-title="${project.title}">View Details</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  setupEventListeners() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.previousSlide());
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.nextSlide());
    }

    // Auto-advance carousel
    setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  createDots() {
    if (!this.dotsContainer) return;

    this.dotsContainer.innerHTML = this.projects.map((_, index) => 
      `<div class="carousel-dot ${index === 0 ? 'active' : ''}" data-slide="${index}"></div>`
    ).join('');

    this.dotsContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('carousel-dot')) {
        this.goToSlide(parseInt(e.target.dataset.slide));
      }
    });
  }

  previousSlide() {
    this.currentSlide = this.currentSlide === 0 ? this.projects.length - 1 : this.currentSlide - 1;
    this.updateCarousel();
  }

  nextSlide() {
    this.currentSlide = this.currentSlide === this.projects.length - 1 ? 0 : this.currentSlide + 1;
    this.updateCarousel();
  }

  goToSlide(index) {
    this.currentSlide = index;
    this.updateCarousel();
  }

  updateCarousel() {
    if (this.track) {
      this.track.style.transform = `translateX(-${this.currentSlide * 100}%)`;
    }

    // Update dots
    const dots = this.dotsContainer?.querySelectorAll('.carousel-dot');
    if (dots) {
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === this.currentSlide);
      });
    }
  }
}

// Neural visualization with Three.js
class NeuralVisualization {
  constructor() {
    this.canvas = document.getElementById('neural-canvas');
    this.darkMode = new DarkModeManager();
    this.init();
  }

  init() {
    if (!this.canvas) return;

    this.setupScene();
    this.createNeuralNetwork();
    this.setupEventListeners();
    this.animate();
  }

  setupScene() {
    // Scene setup
    scene = new THREE.Scene();
    
    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10;

    // Renderer
    renderer = new THREE.WebGLRenderer({ 
      canvas: this.canvas,
      alpha: true,
      antialias: true
    });
    
    const bgColor = this.darkMode.isDark ? '#131C2E' : '#F8F9FB'; /* Updated to accurate palette */
    renderer.setClearColor(bgColor, 1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
  }

  createNeuralNetwork() {
    // Create nodes
    const nodeGeometry = new THREE.SphereGeometry(0.05, 16, 16);
    const nodeMaterial = new THREE.MeshBasicMaterial({ 
      color: this.darkMode.isDark ? '#6EA5CC' : '#6EA5CC', /* Accurate Azul Macaubas for both themes */
      transparent: true,
      opacity: 0.8
    });

    const nodes = new THREE.Group();
    const nodePositions = [];

    // Create random node positions
    for (let i = 0; i < 100; i++) {
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 3 + Math.random() * 2;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
      node.position.set(x, y, z);
      nodes.add(node);
      nodePositions.push(new THREE.Vector3(x, y, z));
    }

    scene.add(nodes);
    this.nodes = nodes;

    // Create connections
    this.createConnections(nodePositions);
  }

  createConnections(positions) {
    const connectionGeometry = new THREE.BufferGeometry();
    const connectionVertices = [];

    // Create connections between nearby nodes
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const distance = positions[i].distanceTo(positions[j]);
        if (distance < 2 && Math.random() > 0.7) {
          connectionVertices.push(
            positions[i].x, positions[i].y, positions[i].z,
            positions[j].x, positions[j].y, positions[j].z
          );
        }
      }
    }

    connectionGeometry.setAttribute('position', new THREE.Float32BufferAttribute(connectionVertices, 3));
    
    const connectionMaterial = new THREE.LineBasicMaterial({
      color: this.darkMode.isDark ? '#6EA5CC' : '#6EA5CC', /* Accurate Azul Macaubas for both themes */
      transparent: true,
      opacity: 0.3
    });

    connections = new THREE.LineSegments(connectionGeometry, connectionMaterial);
    scene.add(connections);
  }

  setupEventListeners() {
    window.addEventListener('mousemove', (event) => this.onMouseMove(event));
    window.addEventListener('resize', () => this.onWindowResize());
  }

  onMouseMove(event) {
    mouseX = (event.clientX - window.innerWidth / 2) * MOUSE_SENSITIVITY;
    mouseY = (event.clientY - window.innerHeight / 2) * MOUSE_SENSITIVITY;
  }

  onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    animationFrame = requestAnimationFrame(() => this.animate());

    // Update rotation based on mouse movement
    rotationVelocityX += (mouseY - rotationVelocityX) * ACCELERATION_FACTOR;
    rotationVelocityY += (mouseX - rotationVelocityY) * ACCELERATION_FACTOR;

    rotationVelocityX *= DAMPING_FACTOR;
    rotationVelocityY *= DAMPING_FACTOR;

    if (this.nodes) {
      this.nodes.rotation.x += rotationVelocityX;
      this.nodes.rotation.y += rotationVelocityY;
    }

    if (connections) {
      connections.rotation.x += rotationVelocityX;
      connections.rotation.y += rotationVelocityY;
    }

    renderer.render(scene, camera);
  }
}

// Fade-in animation for elements
class FadeInManager {
  constructor() {
    this.elements = document.querySelectorAll('.fade-in');
    this.init();
  }

  init() {
    this.setupIntersectionObserver();
  }

  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    this.elements.forEach(element => {
      observer.observe(element);
    });
  }
}

// Skills Animation Manager
class SkillsManager {
  constructor() {
    this.skillItems = document.querySelectorAll('.skill-item');
    this.hasAnimated = false;
    this.init();
  }

  init() {
    this.setupIntersectionObserver();
  }

  setupIntersectionObserver() {
    if (this.skillItems.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.hasAnimated) {
          this.animateSkillBars();
          this.hasAnimated = true;
        }
      });
    }, { threshold: 0.3 });

    // Observe the first skill item to trigger animation
    if (this.skillItems[0]) {
      observer.observe(this.skillItems[0]);
    }
  }

  animateSkillBars() {
    this.skillItems.forEach((item, index) => {
      const progressBar = item.querySelector('.skill-progress');
      const level = item.dataset.level;
      
      if (progressBar && level) {
        setTimeout(() => {
          progressBar.style.width = `${level}%`;
        }, index * 100);
      }
    });
  }
}

// PDF Viewer Manager for Resume Page
class PDFViewerManager {
  constructor() {
    this.iframe = document.getElementById('pdf-iframe');
    this.fallback = document.querySelector('.pdf-fallback');
    this.init();
  }

  init() {
    if (!this.iframe || !this.fallback) return;

    // Set a timeout to check if PDF loaded
    const loadTimeout = setTimeout(() => {
      this.showFallback();
    }, 5000);

    // Check if iframe loads successfully
    this.iframe.addEventListener('load', () => {
      clearTimeout(loadTimeout);
      try {
        // Try to access iframe content to see if PDF loaded
        const iframeDoc = this.iframe.contentDocument || this.iframe.contentWindow.document;
        if (!iframeDoc || iframeDoc.querySelector('embed') === null) {
          this.showFallback();
        }
      } catch (e) {
        // Cross-origin restriction or other error - PDF might still work
        console.log('PDF iframe loaded, but cannot verify content due to browser restrictions');
      }
    });

    // Handle iframe error
    this.iframe.addEventListener('error', () => {
      clearTimeout(loadTimeout);
      this.showFallback();
    });

    // Add additional checks for mobile devices
    if (this.isMobileDevice()) {
      setTimeout(() => {
        this.showFallback();
      }, 2000);
    }
  }

  showFallback() {
    if (this.iframe) {
      this.iframe.style.display = 'none';
    }
    if (this.fallback) {
      this.fallback.style.display = 'block';
    }
  }

  isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
}

// Project modal functionality
class ProjectModalManager {
  constructor() {
    this.modal = null;
    this.init();
  }

  init() {
    this.createModal();
    this.setupEventListeners();
  }

  createModal() {
    let modalElement = document.getElementById('project-modal');
    if (!modalElement) {
        modalElement = document.createElement('div');
        modalElement.id = 'project-modal';
        modalElement.className = 'project-modal';
        document.body.appendChild(modalElement);
    }
    this.modal = modalElement;
  }

  setupEventListeners() {
    document.body.addEventListener('click', e => {
      if (e.target.classList.contains('view-details-btn')) {
        const projectTitle = e.target.dataset.projectTitle;
        const project = projects.find(p => p.title === projectTitle);
        if (project) {
          this.openModal(project);
        }
      }
      if (e.target.classList.contains('project-modal-close') || e.target.id === 'project-modal') {
        this.closeModal();
      }
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && this.modal.classList.contains('visible')) {
        this.closeModal();
      }
    });
  }

  openModal(project) {
    const links = new ProjectsManager().generateProjectLinks(project);
    this.modal.innerHTML = `
      <div class="project-modal-content">
        <button class="project-modal-close">&times;</button>
        <h3>${project.title}</h3>
        <div class="project-meta">
          <span class="status-badge status-${project.statusColor}">${project.status}</span>
          <span class="category-tag">${project.categoryLabel}</span>
        </div>
        <div class="project-tech">
            ${project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
        </div>
        <div class="project-details">
            <h4>Problem</h4>
            <p>${project.problem}</p>
            <h4>Solution</h4>
            <p>${project.solution}</p>
            <h4>Impact</h4>
            <p>${project.impact}</p>
        </div>
        <div class="project-links">
            ${links}
        </div>
      </div>
    `;
    this.modal.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.modal.classList.remove('visible');
    document.body.style.overflow = 'auto';
  }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all managers
  const darkMode = new DarkModeManager();
  const navigation = new NavigationManager();
  const stats = new StatsManager();
  const carousel = new ProjectCarousel();
  const neural = new NeuralVisualization();
  const fadeIn = new FadeInManager();

  // Initialize PDF viewer if on resume page
  if (document.getElementById('pdf-iframe')) {
    const pdfViewer = new PDFViewerManager();
  }

  // Initialize projects manager if on projects page
  if (document.getElementById('projects-container') && document.querySelector('.projects-filters')) {
    const projectsManager = new ProjectsManager();
  }

  // Initialize modal manager globally
  const modalManager = new ProjectModalManager();

  // Initialize skills manager if on skills page
  if (document.querySelector('.skills-section')) {
    const skillsManager = new SkillsManager();
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Add loading state removal
  window.addEventListener('load', () => {
    document.body.classList.add('loaded');
  });
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    DarkModeManager,
    NavigationManager,
    StatsManager,
    ProjectCarousel,
    NeuralVisualization,
    FadeInManager
  };
}

// Legacy init function for compatibility
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
    renderer.setClearColor('#F8F9FB', 1); // Set to match new background color
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
        color: '#6EA5CC', // Accurate Azul Macaubas for dots
        size: 0.05, // smaller dots for cleaner look
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
                lineVertices.push(
                    vertices[i], vertices[i + 1], vertices[i + 2],
                    vertices[j], vertices[j + 1], vertices[j + 2]
                );
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
        color: '#6EA5CC', // Accurate Azul Macaubas for connections
        transparent: true,
        opacity: 0.04, // very subtle connections
        linewidth: 1,
    });
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    // Position camera
    camera.position.z = 10;

    // Event listeners
    document.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onWindowResize);

    // Initialize 3D visualization if canvas exists
    if (canvas) {
      try {
        setupScene();
        animate();
      } catch (error) {
        console.error('Failed to initialize 3D visualization:', error);
      }
    }
}

// Handle mouse movement
function onMouseMove(event) {
    mouseX = (event.clientX - window.innerWidth / 2) * MOUSE_SENSITIVITY; // Use constant
    mouseY = (event.clientY - window.innerHeight / 2) * MOUSE_SENSITIVITY; // Use constant
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
        // Add a slow, constant rotation
        brain.rotation.x += 0.0000002;
        brain.rotation.y += 0.0000003;

        // Calculate acceleration towards the target rotation (mouseX, mouseY are target offsets)
        // Invert mouse input for inverse rotation
        const accelX = (-mouseY - brain.rotation.x) * ACCELERATION_FACTOR; // Target is -mouseY for x-rotation
        const accelY = (-mouseX - brain.rotation.y) * ACCELERATION_FACTOR; // Target is -mouseX for y-rotation

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

// Enhanced project filtering and rendering
class ProjectsManager {
  constructor() {
    this.projectsContainer = document.getElementById("projects-container");
    this.filterBtns = document.querySelectorAll(".filter-btn");
    this.currentFilter = "all";
    this.init();
  }

  init() {
    this.renderProjects();
    this.setupFilters();
  }

  // Function to get project background images
  getProjectImage(projectTitle) {
    const imageMap = {
      "MindSync": "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop&crop=center",
      "Kalman Filter Cursor Tracker": "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&crop=center", 
      "Recycling Detection Bins": "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=300&fit=crop&crop=center",
      "Blockchain Auditing System": "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop&crop=center",
      "EEG Signal Classification Pipeline": "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=300&fit=crop&crop=center",
      "Neural Network Visualization Tool": "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop&crop=center",
      "Attention Training BCI": "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop&crop=center",
      "Medical Image Segmentation": "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=300&fit=crop&crop=center"
    };
    
    return imageMap[projectTitle] || "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&crop=center";
  }

  setupFilters() {
    this.filterBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        const filter = e.target.dataset.filter;
        this.setActiveFilter(filter);
        this.filterProjects(filter);
      });
    });
  }

  setActiveFilter(filter) {
    this.filterBtns.forEach(btn => btn.classList.remove("active"));
    document.querySelector(`[data-filter="${filter}"]`).classList.add("active");
    this.currentFilter = filter;
  }

  filterProjects(filter) {
    const projectCards = document.querySelectorAll(".project-card");
    
    projectCards.forEach(card => {
      const category = card.dataset.category;
      if (filter === "all" || category === filter) {
        card.style.display = "block";
        card.classList.add("fade-in");
        setTimeout(() => card.classList.add("visible"), 100);
      } else {
        card.style.display = "none";
        card.classList.remove("visible");
      }
    });
  }

  renderProjects() {
    if (!this.projectsContainer) return;
    
    this.projectsContainer.innerHTML = projects.map(project => {
      const techTags = project.tech ? project.tech.map(tech => 
        `<span class="tech-tag">${tech}</span>`
      ).join('') : '';

      const links = this.generateProjectLinks(project);

      return `
        <div class="project-card fade-in" data-category="${project.category}">
          <div class="project-image" style="background-image: url('${this.getProjectImage(project.title)}')"></div>
          <div class="project-content">
            <div class="project-meta">
              <span class="status-badge status-${project.statusColor}">${project.status}</span>
              <span class="category-tag">${project.categoryLabel}</span>
            </div>
            
            <h3>${project.title}</h3>
            <p class="project-summary">${project.summary}</p>
            
            ${techTags ? `<div class="project-tech">${techTags}</div>` : ''}
            
            <div class="project-links">
               <button class="btn btn-secondary view-details-btn" data-project-title="${project.title}">View Details</button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  generateProjectLinks(project) {
    let links = [];
    
    if (project.github) {
      links.push(`<a href="${project.github}" class="project-link" target="_blank">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.98-.399 3.003-.404 1.022.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.654 1.653.246 2.874.12 3.176.77.84 1.233 1.91 1.233 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
        Code
      </a>`);
    }
    
    if (project.demo) {
      links.push(`<a href="${project.demo}" class="project-link" target="_blank">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" stroke-width="2"/>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" stroke-width="2"/>
        </svg>
        Demo
      </a>`);
    }
    
    if (project.url && !project.github) {
      links.push(`<a href="${project.url}" class="project-link" target="_blank">
        View Project →
      </a>`);
    }
    
    return links.join('');
  }
}

// Legacy render function for compatibility
function renderProjects() {
  const projectsManager = new ProjectsManager();
}

// GitHub icon SVG data
const githubIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.98-.399 3.003-.404 1.022.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.654 1.653.246 2.874.12 3.176.77.84 1.233 1.91 1.233 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`;

// LinkedIn icon SVG data
const linkedinIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.231zM5.8 7.401a1.59 1.59 0 0 1-1.548-1.602 1.59 1.59 0 1 1 1.548 1.602zm-1.292 13.051H7.09v-13.5H4.508v13.5zM22 24H2V0h20v24z"/></svg>`;

// Social Links Data
const socialLinks = [
    { name: 'GitHub', href: 'https://github.com/ammar-io', icon: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.98-.399 3.003-.404 1.022.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.654 1.653.246 2.874.12 3.176.77.84 1.233 1.91 1.233 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>' },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/in/aali02/', icon: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.231zM5.8 7.401a1.59 1.59 0 0 1-1.548-1.602 1.59 1.59 0 1 1 1.548 1.602zm-1.292 13.051H7.09v-13.5H4.508v13.5zM22 24H2V0h20v24z"/></svg>' },
    { name: 'Email', href: 'mailto:ammar.neuroai@gmail.com', icon: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M0 3v18h24v-18h-24zm21.518 2l-9.518 7.713-9.518-7.713h19.036zm-19.518 14v-11.817l10 8.104 10-8.104v11.817h-20z"/></svg>' }
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
  } catch (e) {
    console.error("Error initializing 3D visualization:", e);
  }
  
  // Render projects and social links
  renderProjects();
  renderSocials();
});
