// Mobile menu toggle
const menuButton = document.querySelector('.md\\:hidden button');
const mobileMenu = document.getElementById('mobile-menu');
const closeMenuButton = document.getElementById('close-menu');

menuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

closeMenuButton.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
});

// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
        mobileMenu.classList.add('hidden');
    });
});

// Space-themed background animation
const starCanvas = document.getElementById('starBackground');
const starCtx = starCanvas.getContext('2d');
starCanvas.width = window.innerWidth;
starCanvas.height = window.innerHeight;

const stars = [];
const numStars = 150; // Dense star field
const shootingStars = [];
const maxShootingStars = 3; // Limit number of simultaneous shooting stars

function createStar() {
    return {
        x: Math.random() * starCanvas.width,
        y: Math.random() * starCanvas.height,
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.3, // Twinkling effect
        twinkleSpeed: Math.random() * 0.005 + 0.002, // Vary twinkle speed
        depth: Math.random(), // Depth for parallax effect
        dx: (Math.random() - 0.5) * 0.1 * (Math.random() < 0.1 ? 2 : 1), // Occasional faster stars
        dy: (Math.random() - 0.5) * 0.1 * (Math.random() < 0.1 ? 2 : 1)
    };
}

function createShootingStar() {
    const angle = Math.random() * Math.PI / 2 + Math.PI / 4; // Diagonal trajectory (45-90 degrees)
    const speed = 5 + Math.random() * 5; // Speed range
    const startX = Math.random() * starCanvas.width;
    const startY = -50; // Start above canvas
    return {
        x: startX,
        y: startY,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        length: 20 + Math.random() * 30, // Tail length
        alpha: 1, // Initial brightness
        fadeRate: 0.015 + Math.random() * 0.01 // Fade speed
    };
}

for (let i = 0; i < numStars; i++) {
    stars.push(createStar());
}

function drawNebula() {
    // Create a subtle nebula effect with layered gradients
    const nebulaGradient = starCtx.createRadialGradient(
        starCanvas.width * 0.3, starCanvas.height * 0.3, 0,
        starCanvas.width * 0.3, starCanvas.height * 0.3, starCanvas.width * 0.5
    );
    nebulaGradient.addColorStop(0, 'rgba(15, 240, 252, 0.05)');
    nebulaGradient.addColorStop(0.5, 'rgba(77, 19, 209, 0.03)');
    nebulaGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    const nebulaGradient2 = starCtx.createRadialGradient(
        starCanvas.width * 0.7, starCanvas.height * 0.7, 0,
        starCanvas.width * 0.7, starCanvas.height * 0.7, starCanvas.width * 0.4
    );
    nebulaGradient2.addColorStop(0, 'rgba(255, 0, 170, 0.04)');
    nebulaGradient2.addColorStop(0.5, 'rgba(15, 240, 252, 0.02)');
    nebulaGradient2.addColorStop(1, 'rgba(0, 0, 0, 0)');

    starCtx.fillStyle = nebulaGradient;
    starCtx.fillRect(0, 0, starCanvas.width, starCanvas.height);
    starCtx.fillStyle = nebulaGradient2;
    starCtx.fillRect(0, 0, starCanvas.width, starCanvas.height);
}

function drawStars() {
    starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);
    drawNebula(); // Draw nebula background

    // Draw regular stars
    stars.forEach(star => {
        // Twinkling effect
        star.alpha = 0.3 + Math.sin(Date.now() * star.twinkleSpeed) * 0.3;
        starCtx.globalAlpha = star.alpha;

        // Color variation based on depth
        const color = star.depth > 0.7 ? 'rgba(255, 255, 255, 1)' : star.depth > 0.4 ? 'rgba(200, 200, 255, 1)' : 'rgba(150, 255, 255, 1)';
        starCtx.fillStyle = color;

        starCtx.beginPath();
        starCtx.arc(star.x, star.y, star.radius * (0.5 + star.depth), 0, Math.PI * 2);
        starCtx.fill();

        // Move star
        star.x += star.dx * (0.5 + star.depth);
        star.y += star.dy * (0.5 + star.depth);

        // Wrap stars around edges
        if (star.x < 0) star.x += starCanvas.width;
        if (star.x > starCanvas.width) star.x -= starCanvas.width;
        if (star.y < 0) star.y += starCanvas.height;
        if (star.y > starCanvas.height) star.y -= starCanvas.height;
    });

    // Randomly add shooting stars
    if (shootingStars.length < maxShootingStars && Math.random() < 0.01) {
        shootingStars.push(createShootingStar());
    }

    // Draw and update shooting stars
    shootingStars.forEach((shootingStar, index) => {
        starCtx.globalAlpha = shootingStar.alpha;
        starCtx.strokeStyle = 'rgba(255, 255, 255, 1)';
        starCtx.lineWidth = 1;

        // Calculate tail position
        const tailX = shootingStar.x - shootingStar.dx * shootingStar.length / 5;
        const tailY = shootingStar.y - shootingStar.dy * shootingStar.length / 5;

        // Draw trail with gradient for fading effect
        const gradient = starCtx.createLinearGradient(shootingStar.x, shootingStar.y, tailX, tailY);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${shootingStar.alpha})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
        starCtx.strokeStyle = gradient;

        starCtx.beginPath();
        starCtx.moveTo(tailX, tailY);
        starCtx.lineTo(shootingStar.x, shootingStar.y);
        starCtx.stroke();

        // Update position
        shootingStar.x += shootingStar.dx;
        shootingStar.y += shootingStar.dy;
        shootingStar.alpha -= shootingStar.fadeRate;

        // Remove faded or off-screen shooting stars
        if (shootingStar.alpha <= 0 || shootingStar.x > starCanvas.width || shootingStar.y > starCanvas.height) {
            shootingStars.splice(index, 1);
        }
    });

    requestAnimationFrame(drawStars);
}

drawStars();

// Neural network animation with animated lines
const neuralCanvas = document.getElementById('neuralNetwork');
const neuralCtx = neuralCanvas.getContext('2d');
neuralCanvas.width = window.innerWidth;
neuralCanvas.height = window.innerHeight;

const nodes = [];
const numNodes = 30; // Number of nodes
const connections = [];

function createNode() {
    return {
        x: Math.random() * neuralCanvas.width,
        y: Math.random() * neuralCanvas.height,
        radius: 2 + Math.random() * 3,
        alpha: 0.3 + Math.random() * 0.5,
        trails: []
    };
}

function createConnection(node1, node2) {
    return {
        node1,
        node2,
        progress: 0, // Progress of the animated pulse (0 to 1)
        speed: 0.01 + Math.random() * 0.02, // Speed of pulse animation
        active: Math.random() > 0.5 // Randomly start some connections active
    };
}

for (let i = 0; i < numNodes; i++) {
    nodes.push(createNode());
}

// Create connections between nodes
for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[j].x - nodes[i].x;
        const dy = nodes[j].y - nodes[i].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 200) {
            connections.push(createConnection(nodes[i], nodes[j]));
        }
    }
}

function drawNeuralNetwork() {
    neuralCtx.clearRect(0, 0, neuralCanvas.width, neuralCanvas.height);

    // Draw static connections (faint background lines)
    neuralCtx.globalAlpha = 0.1;
    connections.forEach(conn => {
        const dx = conn.node2.x - conn.node1.x;
        const dy = conn.node2.y - conn.node1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const gradient = neuralCtx.createLinearGradient(conn.node1.x, conn.node1.y, conn.node2.x, conn.node2.y);
        gradient.addColorStop(0, `rgba(15, 240, 252, ${0.1 * (1 - distance / 200)})`);
        gradient.addColorStop(1, `rgba(77, 19, 209, ${0.1 * (1 - distance / 200)})`);
        neuralCtx.beginPath();
        neuralCtx.strokeStyle = gradient;
        neuralCtx.lineWidth = 0.5;
        neuralCtx.moveTo(conn.node1.x, conn.node1.y);
        neuralCtx.lineTo(conn.node2.x, conn.node2.y);
        neuralCtx.stroke();
    });

    // Draw animated line pulses
    neuralCtx.globalAlpha = 0.8;
    connections.forEach(conn => {
        if (conn.active) {
            conn.progress += conn.speed;
            if (conn.progress >= 1) {
                conn.progress = 0;
                conn.active = Math.random() > 0.3; // Randomly pause some connections
            }

            const dx = conn.node2.x - conn.node1.x;
            const dy = conn.node2.y - conn.node1.y;
            const startX = conn.node1.x;
            const startY = conn.node1.y;
            const endX = conn.node1.x + dx * conn.progress;
            const endY = conn.node1.y + dy * conn.progress;

            // Create a gradient for the pulse
            const gradient = neuralCtx.createLinearGradient(startX, startY, endX, endY);
            gradient.addColorStop(0, `rgba(15, 240, 252, 0)`);
            gradient.addColorStop(0.5, `rgba(15, 240, 252, 1)`);
            gradient.addColorStop(1, `rgba(77, 19, 209, 0)`);

            neuralCtx.beginPath();
            neuralCtx.strokeStyle = gradient;
            neuralCtx.lineWidth = 1 + Math.sin(Date.now() * 0.002) * 0.5; // Slight pulsing width
            neuralCtx.moveTo(startX, startY);
            neuralCtx.lineTo(endX, endY);
            neuralCtx.stroke();
        } else if (Math.random() < 0.005) {
            conn.active = true; // Randomly activate inactive connections
        }
    });

    // Draw nodes with trails
    neuralCtx.globalAlpha = 0.6;
    nodes.forEach(node => {
        // Update trails
        node.trails.push({ x: node.x, y: node.y, alpha: 0.5 });
        if (node.trails.length > 5) node.trails.shift();

        // Draw trails
        node.trails.forEach((trail, index) => {
            neuralCtx.beginPath();
            neuralCtx.fillStyle = `rgba(15, 240, 252, ${trail.alpha * (1 - index / 5)})`;
            neuralCtx.arc(trail.x, trail.y, node.radius * (1 - index / 5), 0, Math.PI * 2);
            neuralCtx.fill();
        });

        // Draw node
        neuralCtx.beginPath();
        neuralCtx.fillStyle = `rgba(15, 240, 252, ${node.alpha})`;
        neuralCtx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        neuralCtx.fill();

        // Slight movement with bounds
        node.x += (Math.random() - 0.5) * 0.7;
        node.y += (Math.random() - 0.5) * 0.7;
        if (node.x < 0) node.x = 0;
        if (node.x > neuralCanvas.width) node.x = neuralCanvas.width;
        if (node.y < 0) node.y = 0;
        if (node.y > neuralCanvas.height) node.y = neuralCanvas.height;

        // Pulse effect
        node.alpha = 0.3 + Math.sin(Date.now() * 0.001 + node.x * 0.01) * 0.2;
    });

    requestAnimationFrame(drawNeuralNetwork);
}

drawNeuralNetwork();

// Holographic grid animation
const holoCanvas = document.getElementById('holoGrid');
const holoCtx = holoCanvas.getContext('2d');
holoCanvas.width = window.innerWidth;
holoCanvas.height = window.innerHeight;

function drawHoloGrid() {
    holoCtx.clearRect(0, 0, holoCanvas.width, holoCanvas.height);
    holoCtx.globalAlpha = 0.05;

    // Grid lines
    for (let x = 0; x < holoCanvas.width; x += 50) {
        holoCtx.beginPath();
        holoCtx.strokeStyle = `rgba(15, 240, 252, ${0.1 + Math.sin(x * 0.01 + Date.now() * 0.0005) * 0.05})`;
        holoCtx.lineWidth = 0.5;
        holoCtx.moveTo(x + Math.sin(Date.now() * 0.001) * 10, 0);
        holoCtx.lineTo(x + Math.sin(Date.now() * 0.001) * 10, holoCanvas.height);
        holoCtx.stroke();
    }
    for (let y = 0; y < holoCanvas.height; y += 50) {
        holoCtx.beginPath();
        holoCtx.strokeStyle = `rgba(15, 240, 252, ${0.1 + Math.cos(y * 0.01 + Date.now() * 0.0005) * 0.05})`;
        holoCtx.lineWidth = 0.5;
        holoCtx.moveTo(0, y + Math.cos(Date.now() * 0.001) * 10);
        holoCtx.lineTo(holoCanvas.width, y + Math.cos(Date.now() * 0.001) * 10);
        holoCtx.stroke();
    }

    // Faint distortion effect
    holoCtx.globalAlpha = 0.03;
    holoCtx.fillStyle = `rgba(15, 240, 252, 0.05)`;
    holoCtx.fillRect(0, 0, holoCanvas.width, holoCanvas.height);

    requestAnimationFrame(drawHoloGrid);
}

drawHoloGrid();

// Resize canvases on window resize
window.addEventListener('resize', () => {
    starCanvas.width = window.innerWidth;
    starCanvas.height = window.innerHeight;
    neuralCanvas.width = window.innerWidth;
    neuralCanvas.height = window.innerHeight;
    holoCanvas.width = window.innerWidth;
    holoCanvas.height = window.innerHeight;

    // Recreate stars and nodes on resize
    stars.length = 0;
    for (let i = 0; i < numStars; i++) {
        stars.push(createStar());
    }
    nodes.length = 0;
    connections.length = 0;
    for (let i = 0; i < numNodes; i++) {
        nodes.push(createNode());
    }
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[j].x - nodes[i].x;
            const dy = nodes[j].y - nodes[i].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 200) {
                connections.push(createConnection(nodes[i], nodes[j]));
            }
        }
    }
    shootingStars.length = 0; // Clear shooting stars on resize
});