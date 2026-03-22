// --- Configuración de Imágenes ---
const appScreens = [
    'assets/imagen1.png',           // Hero (Nueva imagen)
    'assets/screen-registro.png',   // Registro
    'assets/screen-control.png',    // Control
    'assets/screen-historial.png',  // Historial
    'assets/screen-analisis.png',   // Análisis
    'assets/screen-soberania.png'   // Soberanía
];

// Lenis Smooth Scroll
const lenis = new Lenis();
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// Three.js Setup
let scene, camera, renderer, phoneGroup, screenMesh, mouseLight;
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
            loadedTextures[index] = texture;
            if (index === 0 && screenMesh) applyTexture(0);
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
    phoneGroup.position.x = 2.8;

    // Cuerpo del teléfono (Más refinado)
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

    // Pantalla
    const screenGeom = new THREE.PlaneGeometry(2.32, 4.92);
    screenMesh = new THREE.Mesh(screenGeom, new THREE.MeshBasicMaterial({ color: 0xffffff }));
    screenMesh.position.z = 0.11;
    phoneGroup.add(screenMesh);

    scene.add(phoneGroup);

    // Luces
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    const pointLight = new THREE.PointLight(0xfacc15, 2.5, 20); 
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    
    mouseLight = new THREE.PointLight(0xffffff, 1.2, 15);
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
    if (loadedTextures[index] && screenMesh) {
        console.log(`[AutoGEST] 📱 Aplicando textura ${index} a la pantalla`);
        screenMesh.material.map = loadedTextures[index];
        screenMesh.material.needsUpdate = true;
    } else {
        console.warn(`[AutoGEST] ⚠️ No se puede aplicar textura ${index} aún.`);
    }
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    
    // Flotación dinámica sutil
    if(phoneGroup) {
        phoneGroup.rotation.z = Math.sin(Date.now() * 0.0008) * 0.03;
        phoneGroup.position.y = Math.cos(Date.now() * 0.001) * 0.15;
    }
}

function setupScroll() {
    gsap.registerPlugin(ScrollTrigger);
    
    // Timeline Principal
    const mainTl = gsap.timeline({
        scrollTrigger: {
            trigger: ".section-wrapper",
            start: "top top",
            end: "bottom bottom",
            scrub: 1.2
        }
    });

    // Movimiento del teléfono por la pantalla
    mainTl.to(phoneGroup.position, { x: -3.2, duration: 2 }) // Slide 1 -> 2
          .to(phoneGroup.rotation, { y: Math.PI * 0.2, duration: 2 }, 1)
          .to(phoneGroup.position, { x: 3.2, duration: 2 }, 3)   // Slide 2 -> 3
          .to(phoneGroup.rotation, { y: -Math.PI * 0.2, duration: 2 }, 3)
          .to(phoneGroup.position, { x: -3.2, duration: 2 }, 5)  // Slide 3 -> 4
          .to(phoneGroup.rotation, { y: Math.PI * 0.5, duration: 2 }, 5)
          .to(phoneGroup.position, { x: 0, z: -2, duration: 2 }, 7); // Final Centrado

    // Aparición de bloques UI
    gsap.utils.toArray('section').forEach((section, i) => {
        const ui = section.querySelector('.glass-ui');
        if(ui) {
            // Estado inicial vía JS DESACTIVADO para debug
            // gsap.set(ui, { opacity: 0, y: 50 });
            
            gsap.to(ui, {
                opacity: 1,
                y: 0,
                duration: 1.2,
                scrollTrigger: {
                    trigger: section,
                    start: "top 70%",
                    // markers: true,
                    // scroller: "body" // Probar forzando el scroller
                }
            });
        }
    });

    // Cambio de texturas según la sección
    const sectionTriggers = [
        { trigger: "#ui-1", index: 1 },
        { trigger: "#ui-2", index: 2 },
        { trigger: "#ui-3", index: 3 },
        { trigger: "#ui-4", index: 4 },
        { trigger: "#data", index: 5 }
    ];

    sectionTriggers.forEach(st => {
        ScrollTrigger.create({
            trigger: st.trigger,
            start: "top center",
            onEnter: () => applyTexture(st.index),
            onLeaveBack: () => applyTexture(st.index - 1)
        });
    });

    // Forzar actualización inicial
    ScrollTrigger.refresh();
}

window.onload = () => {
    init3D();
    // Re-refrescar después de un breve delay para asegurar que el DOM y Three.js estén listos
    setTimeout(() => {
        ScrollTrigger.refresh();
    }, 1000);
};

window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 12;
    const y = -(e.clientY / window.innerHeight - 0.5) * 12;
    if(mouseLight) gsap.to(mouseLight.position, { x, y, duration: 0.8 });
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
