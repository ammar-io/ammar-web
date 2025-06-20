// Global variables
let scene, camera, renderer;
let mouse = new THREE.Vector2();
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
    description: "MindSync uses EEG signals for real-time emotional state detection. Integrated VR using C# & Unity, via UDP. Dynamically adjusts visual feedback elements for a closed-loop cognitive therapy experience, improving the user's attentional control.",
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
    description: "Using Kalman Filter for cursor prediction and viewing with OpenCV. Implements predictive tracking algorithms for enhanced human-computer interaction and motion prediction.",
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
    description: "Trained YOLO-V8 computer vision models to detect and allow recyclable materials to enter waste bins for the UIUC campus. Smart waste management system with real-time object detection.",
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
    description: "Used ZKP's to develop a SOTA blockchain auditing system for faster digital asset validation and analysis. Built with Python, Circom & JavaScript (Snark.js).",
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
    description: "Advanced deep learning pipeline for real-time EEG signal classification using CNNs and RNNs. Achieved 94% accuracy in motor imagery classification with real-time processing capabilities.",
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
    description: "Interactive web-based tool for visualizing neural network architectures and training processes. Built with Three.js and D3.js for educational purposes.",
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
    description: "Brain-computer interface system for attention training using real-time neurofeedback. Combines EEG analysis with gamification for cognitive enhancement applications.",
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
    description: "Deep learning models for automated medical image segmentation using U-Net architectures. Focus on brain MRI and CT scan analysis for diagnostic applications.",
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
    // Mobile menu functionality can be expanded here
    console.log('Mobile menu toggled');
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
          <p class="project-description">${project.description}</p>
          <div class="project-tech">
            ${project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
          </div>
          <div class="project-links">
            ${project.github ? `<a href="${project.github}" class="project-link" target="_blank">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.98-.399 3.003-.404 1.022.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.30.654 1.653.246 2.874.12 3.176.77.84 1.233 1.91 1.233 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              View Code
            </a>` : ''}
            ${project.demo ? `<a href="${project.demo}" class="project-link" target="_blank">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" stroke-width="2"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" stroke-width="2"/>
              </svg>
              Live Demo
            </a>` : ''}
            <a href="projects.html" class="project-link">
              View All Projects →
            </a>
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

// Check if Three.js is loaded
function checkThreeJSLoaded() {
  return typeof THREE !== 'undefined';
}

// Wait for Three.js to load before initializing 3D visualization
function waitForThreeJS(callback) {
  if (checkThreeJSLoaded()) {
    callback();
  } else {
    setTimeout(() => waitForThreeJS(callback), 100);
  }
}

// Interactive Curl-Noise Sphere Visualization
class WaveSphere {
  constructor(canvasId = 'neural-canvas') {
    this.canvas = document.getElementById(canvasId);
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.time = 0;
    this.ripples = [];

    this.radius = 3;
    this.pointCount = 50000;

    if (!this.canvas) return;
    this.init();
  }

  init() {
    // Hide loading indicator
    const loadingIndicator = document.getElementById('neural-loading');
    if (loadingIndicator) {
      loadingIndicator.classList.add('hidden');
    }

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 8);

    renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true });
    renderer.setClearColor(0x000000, 0); // transparent
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.createSphere();
    this.addControls();
    this.addEventListeners();
    this.animate();
  }

  createSphere() {
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(this.pointCount * 3);

    for (let i = 0; i < this.pointCount; i++) {
      const phi = Math.acos(2 * Math.random() - 1) - Math.PI / 2;
      const theta = 2 * Math.PI * Math.random();
      const x = Math.cos(phi) * Math.cos(theta);
      const y = Math.sin(phi);
      const z = Math.cos(phi) * Math.sin(theta);
      positions.set([x * this.radius, y * this.radius, z * this.radius], i * 3);
    }

    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const vertex = `
      varying float vDisp;
      uniform float uTime;
      uniform vec3 uMouse;
      uniform int uRippleCount;
      uniform vec3 uRipples[10];

      // 3D Noise functions
      vec3 mod289(vec3 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
      }
      
      vec4 mod289(vec4 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
      }
      
      vec4 permute(vec4 x) {
        return mod289(((x*34.0)+1.0)*x);
      }
      
      vec4 taylorInvSqrt(vec4 r) {
        return 1.79284291400159 - 0.85373472095314 * r;
      }
      
      float snoise(vec3 v) {
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
        
        vec3 i = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);
        
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);
        
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;
        
        i = mod289(i);
        vec4 p = permute(permute(permute(
                   i.z + vec4(0.0, i1.z, i2.z, 1.0))
                 + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                 + i.x + vec4(0.0, i1.x, i2.x, 1.0));
        
        float n_ = 0.142857142857;
        vec3 ns = n_ * D.wyz - D.xzx;
        
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
        
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);
        
        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        
        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);
        
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
        
        vec3 p0 = vec3(a0.xy, h.x);
        vec3 p1 = vec3(a0.zw, h.y);
        vec3 p2 = vec3(a1.xy, h.z);
        vec3 p3 = vec3(a1.zw, h.w);
        
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;
        
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
      }

      vec3 curlNoise(vec3 p) {
        float epsilon = 0.1;
        float n1, n2, a, b;
        
        n1 = snoise(vec3(p.x, p.y + epsilon, p.z));
        n2 = snoise(vec3(p.x, p.y - epsilon, p.z));
        a = (n1 - n2) / (2.0 * epsilon);
        
        n1 = snoise(vec3(p.x, p.y, p.z + epsilon));
        n2 = snoise(vec3(p.x, p.y, p.z - epsilon));
        b = (n1 - n2) / (2.0 * epsilon);
        
        vec3 curl = vec3(a - b, 0.0, 0.0);
        
        n1 = snoise(vec3(p.x, p.y, p.z + epsilon));
        n2 = snoise(vec3(p.x, p.y, p.z - epsilon));
        a = (n1 - n2) / (2.0 * epsilon);
        
        n1 = snoise(vec3(p.x + epsilon, p.y, p.z));
        n2 = snoise(vec3(p.x - epsilon, p.y, p.z));
        b = (n1 - n2) / (2.0 * epsilon);
        
        curl.y = a - b;
        
        n1 = snoise(vec3(p.x + epsilon, p.y, p.z));
        n2 = snoise(vec3(p.x - epsilon, p.y, p.z));
        a = (n1 - n2) / (2.0 * epsilon);
        
        n1 = snoise(vec3(p.x, p.y + epsilon, p.z));
        n2 = snoise(vec3(p.x, p.y - epsilon, p.z));
        b = (n1 - n2) / (2.0 * epsilon);
        
        curl.z = a - b;
        
        return curl;
      }

      void main() {
        vec3 pos = position;
        vec3 npos = normalize(pos) * 0.5 + uTime * 0.3;
        vec3 c = curlNoise(npos) * 0.3;

        vec3 ripple = vec3(0);
        for (int i = 0; i < 10; i++) {
          if (i >= uRippleCount) break;
          vec3 rp = uRipples[i];
          float d = distance(pos, rp);
          float strength = sin((d - (uTime - rp.z)) * 5.0) * exp(-d * 2.0);
          ripple += normalize(pos - rp) * strength * 0.5;
        }

        pos += c + ripple;
        vDisp = length(c + ripple);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = 2.0;
      }
    `;

    const fragment = `
      varying float vDisp;
      void main() {
        // Oxford Blue to Azul Macaubas gradient based on displacement
        vec3 darkPurple = vec3(0.0, 0.129, 0.278); // Oxford Blue #002147
        vec3 accentTeal = vec3(0.431, 0.647, 0.8); // Azul Macaubas #6EA5CC
        
        float intensity = clamp(vDisp * 3.0, 0.0, 1.0);
        vec3 color = mix(darkPurple, accentTeal, intensity);
        
        // Add subtle copper highlight for high displacement
        vec3 copper = vec3(0.706, 0.404, 0.235); // Copper #B4673C
        if (intensity > 0.7) {
          float copperMix = (intensity - 0.7) / 0.3;
          color = mix(color, copper, copperMix * 0.3);
        }
        
        // Circular point shape
        vec2 d = 2.0 * gl_PointCoord - 1.0;
        float a = 1.0 - dot(d, d);
        a = clamp(a, 0.0, 1.0);
        gl_FragColor = vec4(color, a * 0.9);
      }
    `;

    const mat = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector3() },
        uRippleCount: { value: 0 },
        uRipples: { value: Array(10).fill(new THREE.Vector3()) }
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.points = new THREE.Points(geom, mat);
    scene.add(this.points);
  }

  addControls() {
    if (typeof THREE.OrbitControls !== 'undefined') {
      this.controls = new THREE.OrbitControls(camera, renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.autoRotate = true;
      this.controls.autoRotateSpeed = 0.5;
      this.controls.enableZoom = true;
      this.controls.enablePan = false;
      this.controls.minDistance = 5;
      this.controls.maxDistance = 20;
    } else {
      console.warn('OrbitControls not available - using manual rotation');
      this.manualRotation = { x: 0, y: 0 };
    }
  }

  addEventListeners() {
    window.addEventListener('resize', () => this.onResize());
    window.addEventListener('mousemove', e => this.onMouse(e));
  }

  onMouse(e) {
    this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, camera);
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(this.radius, 32, 32));
    const i = this.raycaster.intersectObject(sphere);
    if (i.length) {
      const pt = i[0].point;
      this.addRipple(pt);
    }
  }

  addRipple(pos) {
    if (this.ripples.length >= 10) this.ripples.shift();
    this.ripples.push({ pos, t: this.time });
  }

  updateRipples() {
    const u = this.points.material.uniforms;
    u.uRippleCount.value = this.ripples.length;
    this.ripples.forEach((r, idx) => {
      u.uRipples.value[idx].set(r.pos.x, r.pos.y, r.t);
    });
  }

  onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    animationFrame = requestAnimationFrame(() => this.animate());
    const dt = 0.016;
    this.time += dt;
    this.points.material.uniforms.uTime.value = this.time;
    this.updateRipples();
    if (this.controls) {
      this.controls.update();
    } else if (this.manualRotation) {
      this.manualRotation.y += 0.005;
      if (this.points) {
        this.points.rotation.y = this.manualRotation.y;
        this.points.rotation.x = Math.sin(this.time * 0.3) * 0.1;
      }
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

// Entry point
window.addEventListener('DOMContentLoaded', () => {
  new DarkModeManager();
  new NavigationManager();
  new FadeInManager();
  
  setTimeout(() => {
    new StatsManager();
    new ProjectCarousel();
    
    // Initialize WaveSphere if neural canvas exists
    if (document.getElementById('neural-canvas')) {
      waitForThreeJS(() => {
        new WaveSphere();
      });
    }
    
    if (document.getElementById('pdf-iframe')) new PDFViewerManager();
    if (document.querySelector('.projects-filters')) new ProjectsManager();
    if (document.querySelector('.skills-section')) new SkillsManager();
  }, 100);

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

// Legacy init function for compatibility - Updated for Wave Sea Flow
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

    // Set background color
    renderer = new THREE.WebGLRenderer({ 
        canvas: canvas,
        alpha: true,  // allow transparency so CSS shows through
        antialias: false
    });
    renderer.setClearColor('#F8F9FB', 1); // Set to match new background color
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 8, 12);
    camera.lookAt(0, 0, 0);

    // Create wave sea flow geometry
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const waveWidth = 60;
    const waveHeight = 60;
    const waveSpacing = 0.3;

    // Create grid of wave points
    for (let x = 0; x < waveWidth; x++) {
        for (let z = 0; z < waveHeight; z++) {
            const nodeX = (x - waveWidth / 2) * waveSpacing;
            const nodeZ = (z - waveHeight / 2) * waveSpacing;
            const nodeY = 0; // Base height, will be animated

            vertices.push(nodeX, nodeY, nodeZ);
        }
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    // Store original positions for wave calculations
    geometry.userData.originalPositions = geometry.attributes.position.array.slice();
    geometry.userData.waveWidth = waveWidth;
    geometry.userData.waveHeight = waveHeight;
    geometry.userData.waveSpacing = waveSpacing;

    // Create circle texture (using a soft white circle)
    const circleTexture = createCircleTexture();

    // Use subtle points for wave nodes
    const pointMaterial = new THREE.PointsMaterial({
        map: circleTexture,
        alphaTest: 0.5,
        color: '#6EA5CC', // Accurate Azul Macaubas for dots
        size: 0.08, // slightly larger for wave nodes
        transparent: true,
        opacity: 0.7,
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
}

// Handle mouse movement - Updated for Wave Sea Flow
function onMouseMove(event) {
    // Convert mouse position to normalized device coordinates for wave interaction
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
}

// Handle window resize - Updated for Wave Sea Flow
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation loop - Updated for Wave Sea Flow
function animate() {
    requestAnimationFrame(animate);

    // Wave animation for legacy version
    if (brain && brain.geometry.userData.originalPositions) {
        const time = Date.now() * 0.002; // Wave animation speed
        const positions = brain.geometry.attributes.position.array;
        const originalPositions = brain.geometry.userData.originalPositions;
        const waveWidth = brain.geometry.userData.waveWidth;
        const waveHeight = brain.geometry.userData.waveHeight;
        const waveSpacing = brain.geometry.userData.waveSpacing;
        
        // Mouse interaction variables
        let mouseWorldX = 0;
        let mouseWorldZ = 0;
        if (typeof mouseX !== 'undefined' && typeof mouseY !== 'undefined') {
            // Convert normalized mouse coordinates to world coordinates
            mouseWorldX = mouseX * 10;
            mouseWorldZ = mouseY * 10;
        }

        // Animate wave heights
        for (let i = 0; i < positions.length; i += 3) {
            const x = originalPositions[i];
            const z = originalPositions[i + 2];
            
            // Base wave calculation using sine waves
            let waveHeight = 0;
            
            // Multiple wave patterns for realistic ocean feel
            waveHeight += Math.sin(x * 2 + time) * 0.3;
            waveHeight += Math.sin(z * 1.5 + time * 0.8) * 0.4;
            waveHeight += Math.sin(x * 0.8 + z * 0.8 + time * 1.2) * 0.2;
            
            // Mouse interaction - create ripple effect
            const distanceToMouse = Math.sqrt(
                Math.pow(x - mouseWorldX, 2) + 
                Math.pow(z - mouseWorldZ, 2)
            );
            
            const mouseRadius = 3.0;
            const mouseInfluence = 2.0;
            
            if (distanceToMouse < mouseRadius) {
                const influence = (mouseRadius - distanceToMouse) / mouseRadius;
                const ripple = Math.sin(distanceToMouse * 3 - time * 4) * influence * mouseInfluence;
                waveHeight += ripple;
            }
            
            // Apply the wave height
            positions[i + 1] = originalPositions[i + 1] + waveHeight;
        }
        
        brain.geometry.attributes.position.needsUpdate = true;
        
        // Subtle camera movement based on mouse
        if (typeof mouseX !== 'undefined' && typeof mouseY !== 'undefined') {
            camera.position.x += (mouseX * 2 - camera.position.x) * 0.01;
            camera.position.z += (mouseY * 2 - camera.position.z) * 0.01;
            camera.lookAt(0, 0, 0);
        }
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
            <p class="project-description">${project.description}</p>
            
            ${techTags ? `<div class="project-tech">${techTags}</div>` : ''}
            
            <div class="project-links">
              ${links}
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

// Create circle texture for wave nodes
function createCircleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  
  const context = canvas.getContext('2d');
  const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.2, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.4, 'rgba(255,255,255,0.8)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  
  context.fillStyle = gradient;
  context.fillRect(0, 0, 32, 32);
  
  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// Wait for DOM to be fully loaded before running
document.addEventListener('DOMContentLoaded', () => {
  // Initialize the 3D wave visualization
  try {
    if (document.getElementById('neural-canvas')) {
      // Use new NeuralVisualization class if canvas exists
      waitForThreeJS(() => {
        const neural = new NeuralVisualization();
      });
    } else if (document.querySelector('#canvas')) {
      // Use legacy init for other canvas elements
      init();
      animate();
    }
    console.log("3D wave visualization initialized");
  } catch (e) {
    console.error("Error initializing 3D visualization:", e);
  }
  
  // Render projects and social links
  renderProjects();
  renderSocials();
});
