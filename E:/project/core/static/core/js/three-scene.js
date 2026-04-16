/**
 * Three.js Scene - Premium Animated Background
 * Creates an elegant particle field with subtle movement
 */

// Scene setup
const canvas = document.getElementById('threeCanvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Create particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 2000;

const posArray = new Float32Array(particlesCount * 3);
const velocityArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i += 3) {
    // Position
    posArray[i] = (Math.random() - 0.5) * 15;     // x
    posArray[i + 1] = (Math.random() - 0.5) * 15; // y
    posArray[i + 2] = (Math.random() - 0.5) * 10; // z
    
    // Velocity
    velocityArray[i] = (Math.random() - 0.5) * 0.002;
    velocityArray[i + 1] = (Math.random() - 0.5) * 0.002;
    velocityArray[i + 2] = (Math.random() - 0.5) * 0.002;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

// Particle material
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.015,
    color: 0xffffff,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
});

// Create particle system
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Add floating geometric shapes
const shapes = [];
const shapeGeometries = [
    new THREE.IcosahedronGeometry(0.3, 0),
    new THREE.OctahedronGeometry(0.4, 0),
    new THREE.TetrahedronGeometry(0.35, 0)
];

const shapeMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true,
    transparent: true,
    opacity: 0.15
});

for (let i = 0; i < 8; i++) {
    const geometry = shapeGeometries[Math.floor(Math.random() * shapeGeometries.length)];
    const shape = new THREE.Mesh(geometry, shapeMaterial);
    
    shape.position.x = (Math.random() - 0.5) * 12;
    shape.position.y = (Math.random() - 0.5) * 12;
    shape.position.z = (Math.random() - 0.5) * 8 - 3;
    
    shape.rotationSpeed = {
        x: (Math.random() - 0.5) * 0.003,
        y: (Math.random() - 0.5) * 0.003,
        z: (Math.random() - 0.5) * 0.003
    };
    
    shapes.push(shape);
    scene.add(shape);
}

// Camera position
camera.position.z = 5;

// Mouse interaction
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX) * 0.001;
    mouseY = (event.clientY - windowHalfY) * 0.001;
});

// Animation loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    
    const elapsedTime = clock.getElapsedTime();
    
    // Smooth mouse follow
    targetX = mouseX * 0.5;
    targetY = mouseY * 0.5;
    
    particlesMesh.rotation.y += 0.0005;
    particlesMesh.rotation.x += 0.0002;
    
    // Gentle wave motion for particles
    const positions = particlesGeometry.attributes.position.array;
    for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        positions[i3 + 1] += Math.sin(elapsedTime * 0.5 + positions[i3]) * 0.001;
    }
    particlesGeometry.attributes.position.needsUpdate = true;
    
    // Animate shapes
    shapes.forEach((shape, index) => {
        shape.rotation.x += shape.rotationSpeed.x;
        shape.rotation.y += shape.rotationSpeed.y;
        shape.rotation.z += shape.rotationSpeed.z;
        
        // Gentle floating
        shape.position.y += Math.sin(elapsedTime * 0.3 + index) * 0.002;
    });
    
    // Camera subtle movement
    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (-targetY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    
    renderer.render(scene, camera);
}

animate();

// Handle resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
