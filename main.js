// --- Configuración de Imágenes ---
const appScreens = [
    'assets/imagen1.png',           // Hero
    'assets/screen-registro.png',   // Registro
    'assets/screen-control.png',    // Control
    'assets/screen-historial.png',  // Historial
    'assets/screen-reportes.png',   // Reportes PDF
    'assets/screen-analisis.png'    // Análisis Dashboard
];

// Lenis Smooth Scroll
const lenis = new Lenis();
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// Three.js Setup
let scene, camera, renderer, phoneGroup, mouseLight;
let screenMeshA, screenMeshB, activeMesh;
const loadedTextures = {};
const textureLoader = new THREE.TextureLoader();

function loadTextureSecure(url, index) {
    console.log(`[AutoGEST] Intentando cargar textura ${index}: ${url}`);
    textureLoader.load(
        url,
        (texture) => {
            console.log(`[AutoGEST] ✅ Textura cargada: ${url}`);
            texture.encoding = THREE.sRGBEncoding;
            texture.flipY = true;
            
            // Giro de 90° a la izquierda para la imagen de Análisis Dashboard (index 5)
            if (index === 5) {
                texture.center.set(0.5, 0.5);
                texture.rotation = Math.PI / 2;
            }

            loadedTextures[index] = texture;
            console.log(`[AutoGEST] 📱 Textura ${index} lista.`);
            
            if (index === 0) {
                console.log(`[AutoGEST] Aplicando textura inicial.`);
                applyTexture(0);
            }
        },
        undefined,
        (err) => {
            console.error(`[AutoGEST] ❌ Error cargando textura ${url}:`, err);
        }
    );
}

appScreens.forEach((url, i) => loadTextureSecure(url, i));

function init3D() {
    const container = document.getElementById('canvas-container');
    scene = new THREE.Scene();
    
    camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);

    phoneGroup = new THREE.Group();
    const isMobile = window.innerWidth < 768;
    phoneGroup.position.x = isMobile ? 0 : 2.5;
    if (isMobile) phoneGroup.scale.set(0.7, 0.7, 0.7);
    const bodyGeom = new THREE.ExtrudeGeometry(createRoundedRectShape(2.4, 5, 0.4), { 
        depth: 0.2, 
        bevelEnabled: true, 
        bevelThickness: 0.08, 
        bevelSize: 0.04, 
        bevelSegments: 25 
    });
    const bodyMat = new THREE.MeshStandardMaterial({ 
        color: 0x151515, 
        metalness: 1, 
        roughness: 0.1 
    });
    const body = new THREE.Mesh(bodyGeom, bodyMat);
    body.position.z = -0.1;
    phoneGroup.add(body);


    // Pantallas (Dos para Cross-fade)
    const screenGeom = new THREE.PlaneGeometry(2.32, 4.92);
    
    screenMeshA = new THREE.Mesh(screenGeom, new THREE.MeshBasicMaterial({ 
        transparent: true, 
        opacity: 1 
    }));
    screenMeshA.position.z = 0.11; // Delante de la carcasa (que termina en z=0.1)

    screenMeshB = new THREE.Mesh(screenGeom, new THREE.MeshBasicMaterial({ 
        transparent: true, 
        opacity: 0
    }));
    screenMeshB.position.z = 0.12; // Un poco más adelante para evitar Z-fighting

    activeMesh = screenMeshA;
    phoneGroup.add(screenMeshA);
    phoneGroup.add(screenMeshB);

    scene.add(phoneGroup);

    // Animación de Entrada "Desde atrás"
    gsap.from(phoneGroup.position, {
        x: -10,
        z: -5,
        duration: 2.5,
        ease: "power3.out",
        delay: 0.5
    });
    
    gsap.from(phoneGroup.rotation, {
        y: Math.PI * 0.5,
        duration: 2.5,
        ease: "power3.out",
        delay: 0.5
    });

    // Luces Premium
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    
    const glowLight = new THREE.PointLight(0xffffff, 1.5, 10);
    glowLight.position.set(2, 0, -2);
    scene.add(glowLight);
    
    mouseLight = new THREE.PointLight(0xfacc15, 2, 20); 
    scene.add(mouseLight);

    applyTexture(0);
    animate();
    setupScroll();
}

function createRoundedRectShape(width, height, radius) {
    const shape = new THREE.Shape();
    shape.moveTo(-width/2 + radius, -height/2);
    shape.lineTo(width/2 - radius, -height/2);
    shape.quadraticCurveTo(width/2, -height/2, width/2, -height/2 + radius);
    shape.lineTo(width/2, height/2 - radius);
    shape.quadraticCurveTo(width/2, height/2, width/2 - radius, height/2);
    shape.lineTo(-width/2 + radius, height/2);
    shape.quadraticCurveTo(-width/2, height/2, -width/2, height/2 - radius);
    shape.lineTo(-width/2, -height/2 + radius);
    shape.quadraticCurveTo(-width/2, -height/2, -width/2 + radius, -height/2);
    return shape;
}

function applyTexture(index) {
    if (!loadedTextures[index]) {
        console.warn(`[AutoGEST] ⚠️ Intentando aplicar textura ${index} pero no está cargada.`);
        return;
    }

    console.log(`[AutoGEST] 🔄 Cambiando a textura: ${index}`);
    const nextTexture = loadedTextures[index];
    const inactiveMesh = (activeMesh === screenMeshA) ? screenMeshB : screenMeshA;

    // Ajustar proporción de la nueva malla
    let aspect = nextTexture.image.width / nextTexture.image.height;
    if (index === 5) aspect = 1 / aspect; // Invertir aspecto por el giro de 90°
    
    // Ajuste de escala: General o 90% para Análisis
    const targetAspect = 2.32 / 4.92;
    const scaleFactor = (index === 5) ? 0.9 : 1.0;
    inactiveMesh.scale.set((aspect / targetAspect) * scaleFactor, scaleFactor, 1);
    
    inactiveMesh.material.map = nextTexture;
    inactiveMesh.material.needsUpdate = true;

    // Cross-fade
    gsap.to(activeMesh.material, { opacity: 0, duration: 1, ease: "power2.inOut" });
    gsap.to(inactiveMesh.material, { opacity: 1, duration: 1, ease: "power2.inOut" });

    activeMesh = inactiveMesh;
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    
    // Sutil rotación reactiva al mouse (Parallax)
    if(phoneGroup) {
        phoneGroup.rotation.y += (prevMouseX * 0.1 - phoneGroup.rotation.y) * 0.05;
        phoneGroup.rotation.x += (prevMouseY * 0.1 - phoneGroup.rotation.x) * 0.05;
    }
}

let prevMouseX = 0;
let prevMouseY = 0;
window.addEventListener('mousemove', (e) => {
    prevMouseX = (e.clientX / window.innerWidth - 0.5);
    prevMouseY = (e.clientY / window.innerHeight - 0.5);
    if(mouseLight) {
        mouseLight.position.x = prevMouseX * 10;
        mouseLight.position.y = -prevMouseY * 10;
        mouseLight.position.z = 5;
    }
});

function setupScroll() {
    gsap.registerPlugin(ScrollTrigger);
    
    // Animación de aparición de UI Glass
    document.querySelectorAll('.glass-ui').forEach(ui => {
        const section = ui.closest('section');
        if(section) {
            gsap.to(ui, {
                opacity: 1,
                y: 0,
                duration: 1.2,
                scrollTrigger: {
                    trigger: section,
                    start: "top 70%",
                }
            });
        }
    });

    const mm = gsap.matchMedia();

    // MOBILE: Phone stays centered
    mm.add("(max-width: 767px)", () => {
        const triggers = [
            { trigger: "#hero", index: 0 },
            { trigger: "#intro", index: 1 },
            { trigger: "#features", index: 2 },
            { trigger: "#ui-3-section", index: 3 },
            { trigger: "#ui-4-section", index: 4 },
            { trigger: "#ui-5-section", index: 5, z: -4 },
            { trigger: "#cta-final", index: 5, y: -20 }
        ];

        triggers.forEach(st => {
            ScrollTrigger.create({
                trigger: st.trigger,
                start: "top center",
                onEnter: () => {
                    applyTexture(st.index);
                    gsap.to(phoneGroup.position, { 
                        x: 0, 
                        y: st.y || 0, 
                        z: st.z || -5, 
                        duration: 1.2, 
                        ease: "power2.inOut" 
                    });
                    gsap.to(phoneGroup.rotation, { y: 0, duration: 1.2, ease: "power2.inOut" });
                    if (st.trigger === "#cta-final") {
                        gsap.to([screenMeshA.material, screenMeshB.material], { opacity: 0, duration: 1 });
                    }
                },
                onLeaveBack: () => {
                    const prev = triggers.find(t => t.index === st.index - 1);
                    if (prev) {
                        applyTexture(prev.index);
                        gsap.to(phoneGroup.position, { x: 0, y: 0, z: prev.z || -5, duration: 1.2, ease: "power2.inOut" });
                        gsap.to(phoneGroup.rotation, { y: 0, duration: 1.2, ease: "power2.inOut" });
                        if (st.trigger === "#cta-final") {
                            gsap.to(activeMesh.material, { opacity: 1, duration: 1 });
                        }
                    }
                }
            });
        });
    });

    // DESKTOP: Phone dodges text
    mm.add("(min-width: 768px)", () => {
        const triggers = [
            { trigger: "#hero", index: 0, x: 2.8, ry: -0.2 },
            { trigger: "#intro", index: 1, x: -2.8, ry: 0.2 },
            { trigger: "#features", index: 2, x: 2.8, ry: -0.2 },
            { trigger: "#ui-3-section", index: 3, x: -2.8, ry: 0.2 },
            { trigger: "#ui-4-section", index: 4, x: 2.8, ry: -0.2 },
            { trigger: "#ui-5-section", index: 5, x: 0, ry: 0, z: -2.5 },
            { trigger: "#cta-final", index: 5, x: 0, ry: 0, z: -30, y: -20 }
        ];

        triggers.forEach(st => {
            ScrollTrigger.create({
                trigger: st.trigger,
                start: "top center",
                onEnter: () => {
                    applyTexture(st.index);
                    gsap.to(phoneGroup.position, { 
                        x: st.x, 
                        y: st.y || 0,
                        z: st.z || 0, 
                        duration: 1.2, 
                        ease: "power2.inOut" 
                    });
                    gsap.to(phoneGroup.rotation, { y: st.ry || 0, duration: 1.2, ease: "power2.inOut" });
                    if (st.trigger === "#cta-final") {
                        gsap.to([screenMeshA.material, screenMeshB.material], { opacity: 0, duration: 1 });
                    }
                },
                onLeaveBack: () => {
                    const prev = triggers.find(t => t.index === st.index - 1);
                    if (prev) {
                        applyTexture(prev.index);
                        gsap.to(phoneGroup.position, { x: prev.x, y: 0, z: prev.z || 0, duration: 1.2, ease: "power2.inOut" });
                        gsap.to(phoneGroup.rotation, { y: prev.ry || 0, duration: 1.2, ease: "power2.inOut" });
                        if (st.trigger === "#cta-final") {
                            gsap.to(activeMesh.material, { opacity: 1, duration: 1 });
                        }
                    }
                }
            });
        });
    });
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

init3D();
