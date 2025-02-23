let scene, camera, renderer;
let brain;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

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

    // Set a dark background (like on hys-inc.jp)
    renderer = new THREE.WebGLRenderer({ 
        canvas: document.querySelector('#canvas'),
        alpha: true,  // allow transparency so CSS shows through
        antialias: true
    });
    renderer.setClearColor('#F5F5F5', 1); // transparent clear color
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    // Create brain-like geometry
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const radius = 9; // Base radius for the brain shape

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

    // Use white points to contrast against the dark background
    const pointMaterial = new THREE.PointsMaterial({
        map: circleTexture,
        alphaTest: 0.5,
        color: '#483D8B', // dots colors 
        size: 0.08, // reduced dot size
        transparent: true,
        opacity: 0.9,
        sizeAttenuation: true,
        depthWrite: false
    });

    brain = new THREE.Points(geometry, pointMaterial);
    scene.add(brain);

    // Create connections between points with subtle white lines
    const lineGeometry = new THREE.BufferGeometry();
    const lineVertices = [];
    
    for (let i = 0; i < vertices.length; i += 3) {
        for (let j = i + 3; j < vertices.length; j += 3) {
            const dx = vertices[i] - vertices[j];
            const dy = vertices[i + 1] - vertices[j + 1];
            const dz = vertices[i + 2] - vertices[j + 2];
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (distance > 4 && distance < 7) {
                lineVertices.push(vertices[i], vertices[i + 1], vertices[i + 2]);
                lineVertices.push(vertices[j], vertices[j + 1], vertices[j + 2]);
            }
        }
    }

    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(lineVertices, 3));
    const lineMaterial = new THREE.LineBasicMaterial({
        color: '#F5F5F5',
        transparent: true,
        opacity: 0.001, // fine, subtle connections
        linewidth: 1, // line width
    });
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    // Adjust camera position
    camera.position.z = 15;

    // Event listeners
    document.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onWindowResize);
}

// Handle mouse movement
function onMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 0.005;
    mouseY = (event.clientY - windowHalfY) * 0.005;
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

    // Determine dominant mouse movement direction
    if (Math.abs(mouseX) > Math.abs(mouseY)) {
        brain.rotation.y -= mouseX * 0.01;
    } else {
        brain.rotation.x -= mouseY * 0.01;
    }

    // Subtle pulsing effect remains as is
    const scale = 1 + Math.sin(Date.now() * 0.002) * 0.05;
    brain.scale.set(scale, scale, scale);

    // Shake effect: displace each vertex based on its original position
    const shakeAmplitude = 0.025; // adjust the amplitude of the shake as needed
    const positions = brain.geometry.attributes.position.array ;
    const originalPositions = brain.geometry.userData.originalPositions;
    const time = Date.now() * 0.005;
    for (let i = 0; i < positions.length; i++) {
        // Use sin and cos for periodic, index-based disturbance
        positions[i] = originalPositions[i] + shakeAmplitude * Math.sin(time + i);
    }
    brain.geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
}

// Start the application
init();
animate();