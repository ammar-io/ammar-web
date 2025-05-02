let scene, camera, renderer;
let sphere;
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

    renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#canvas'),
        alpha: true,  // allow transparency so CSS shows through
        antialias: true
    });
    renderer.setClearColor('#F5F5F5', 1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    // Sphere geometry
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const radius = 9;
    const NUM_POINTS = 2000;

    // Create sphere geometry points
    for (let i = 0; i < NUM_POINTS; i++) {
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        vertices.push(x, y, z);
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.userData.originalPositions = geometry.attributes.position.array.slice();

    // Create circle texture
    const circleTexture = createCircleTexture();

    // Node Material
    const pointMaterial = new THREE.PointsMaterial({
        map: circleTexture,
        alphaTest: 0.5,
        color: '#483D8B', // dots colors
        size: 0.08,
        transparent: true,
        opacity: 0.9,
        sizeAttenuation: true,
        depthWrite: false
    });

    sphere = new THREE.Points(geometry, pointMaterial);
    scene.add(sphere);

    camera.position.z = 15;

    document.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onWindowResize);
}

// Mouse movement
function onMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 0.005;
    mouseY = (event.clientY - windowHalfY) * 0.005;
}

// Window resize
function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

    requestAnimationFrame(animate);
    if (Math.abs(mouseX) > Math.abs(mouseY)) {
        sphere.rotation.y -= mouseX * 0.01;
    } else {
        sphere.rotation.x -= mouseY * 0.01;
    }

    const scale = 1 + Math.sin(Date.now() * 0.002) * 0.05;
    sphere.scale.set(scale, scale, scale);

    const shakeAmplitude = 0.025;
    const positions = sphere.geometry.attributes.position.array;
    const originalPositions = sphere.geometry.userData.originalPositions;
    const time = Date.now() * 0.005;
    for (let i = 0; i < positions.length; i++) {
        positions[i] = originalPositions[i] + shakeAmplitude * Math.sin(time + i);
    }
    sphere.geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
}

init();
animate();