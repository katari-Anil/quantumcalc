/**
 * ThreeUniverse - Interactive 3D Holographic System
 * Optimized Geometry System featuring Parallax, Velocity Shifting, and Spectrum Tracking
 */

const ThreeUniverse = {
    scene: null,
    camera: null,
    renderer: null,
    particles: null,
    hologramRings: [],
    mouseX: 0,
    mouseY: 0,
    targetMouseX: 0,
    targetMouseY: 0,
    
    init() {
        const canvas = document.getElementById('three-canvas');
        this.scene = new THREE.Scene();
        
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 35;
        
        this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        this.buildParticleUniverse();
        this.buildHolographicStructures();
        
        window.addEventListener('resize', () => this.onWindowResize());
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
        
        this.animate();
    },
    
    buildParticleUniverse() {
        const particleCount = window.innerWidth < 768 ? 600 : 1500;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        const activeTheme = document.documentElement.getAttribute('data-theme');
        const primaryColor = activeTheme === 'dark' ? new THREE.Color('#00b7ff') : new THREE.Color('#0066ff');
        
        for (let i = 0; i < particleCount * 3; i += 3) {
            // Volumetric Distribution Equations
            positions[i] = (Math.random() - 0.5) * 80;
            positions[i+1] = (Math.random() - 0.5) * 80;
            positions[i+2] = (Math.random() - 0.5) * 60;
            
            // Color interpolation variations
            const mixedColor = primaryColor.clone().multiplyScalar(0.4 + Math.random() * 0.6);
            colors[i] = mixedColor.r;
            colors[i+1] = mixedColor.g;
            colors[i+2] = mixedColor.b;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        // Procedural Texture Definition via Native Canvas to decouple physical path constraints
        const pTexture = this.generateParticleTexture();
        
        const material = new THREE.PointsMaterial({
            size: 0.28,
            map: pTexture,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            vertexColors: true
        });
        
        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    },
    
    generateParticleTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;
        const ctx = canvas.getContext('2d');
        const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
        grad.addColorStop(0, 'rgba(255,255,255,1)');
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 16, 16);
        return new THREE.CanvasTexture(canvas);
    },
    
    buildHolographicStructures() {
        // Construct Concentric Orbital Vectors imitating high-tech telemetry arrays
        const ringConfigs = [
            { radius: 14, color: '#00b7ff', speed: 0.003 },
            { radius: 22, color: '#0055ff', speed: -0.0015 }
        ];
        
        ringConfigs.forEach(cfg => {
            const geom = new THREE.RingGeometry(cfg.radius, cfg.radius + 0.12, 64);
            const mat = new THREE.MeshBasicMaterial({
                color: cfg.color,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.15,
                blending: THREE.AdditiveBlending
            });
            const mesh = new THREE.Mesh(geom, mat);
            mesh.rotation.x = Math.random() * Math.PI;
            mesh.rotation.y = Math.random() * Math.PI;
            this.scene.add(mesh);
            this.hologramRings.push({ mesh, speed: cfg.speed });
        });
    },
    
    updateSpectrumColors() {
        if (!this.particles) return;
        const activeTheme = document.documentElement.getAttribute('data-theme');
        const primaryColor = activeTheme === 'dark' ? new THREE.Color('#00b7ff') : new THREE.Color('#0066ff');
        
        const colors = this.particles.geometry.attributes.color.array;
        for (let i = 0; i < colors.length; i += 3) {
            const mixedColor = primaryColor.clone().multiplyScalar(0.4 + Math.random() * 0.6);
            colors[i] = mixedColor.r;
            colors[i+1] = mixedColor.g;
            colors[i+2] = mixedColor.b;
        }
        this.particles.geometry.attributes.color.needsUpdate = true;
        
        this.hologramRings.forEach(ring => {
            ring.mesh.material.color.set(activeTheme === 'dark' ? '#00b7ff' : '#0066ff');
        });
    },
    
    onMouseMove(e) {
        this.targetMouseX = (e.clientX - window.innerWidth / 2) * 0.03;
        this.targetMouseY = (e.clientY - window.innerHeight / 2) * 0.03;
    },
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const time = Date.now() * 0.0002;
        
        // Idle System Rotations
        if(this.particles) {
            this.particles.rotation.y = time * 0.12;
            this.particles.rotation.x = time * 0.05;
        }
        
        this.hologramRings.forEach(ring => {
            ring.mesh.rotation.x += ring.speed;
            ring.mesh.rotation.y += ring.speed * 1.5;
        });
        
        // Fluid Parallax Dampening Interpolations
        this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
        this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;
        
        this.camera.position.x += (this.mouseX - this.camera.position.x) * 0.05;
        this.camera.position.y += (-this.mouseY - this.camera.position.y) * 0.05;
        this.camera.lookAt(this.scene.position);
        
        this.renderer.render(this.scene, this.camera);
    }
};