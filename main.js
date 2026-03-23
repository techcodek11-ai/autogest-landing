// --- Configuración de Imágenes ---
const appScreens = [
<<<<<<< HEAD
    'assets/imagen1.png',           // Hero (Nueva imagen)
    'assets/screen-registro.png',   // Registro
    'assets/screen-control.png',    // Control
    'assets/screen-historial.png',  // Historial
    'assets/screen-analisis.png',   // Análisis
    'assets/screen-soberania.png'   // Soberanía
=======
    'assets/imagen1.png',           // Hero
    'assets/screen-registro.png',   // Registro
    'assets/screen-control.png',    // Control
    'assets/screen-historial.png',  // Historial
    'assets/screen-reportes.png',   // Reportes PDF
    'assets/screen-analisis.png'    // Análisis Dashboard
>>>>>>> a740f06 (Initial commit: Landing Page AutoGest)
];

// Lenis Smooth Scroll
const lenis = new Lenis();
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// Three.js Setup
<<<<<<< HEAD
let scene, camera, renderer, phoneGroup, screenMesh, mouseLight;
=======
let scene, camera, renderer, phoneGroup, mouseLight;
let screenMeshA, screenMeshB, activeMesh;
>>>>>>> a740f06 (Initial commit: Landing Page AutoGest)
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
<<<<<<< HEAD
            loadedTextures[index] = texture;
            if (index === 0 && screenMesh) applyTexture(0);
=======
            
            // Giro de 90° a la izquierda para la imagen de Soberanía (index 5)
            if (index === 5) {
                texture.center.set(0.5, 0.5);
                texture.rotation = Math.PI / 2;
            }

            loadedTextures[index] = texture;
            
            if (index === 0) applyTexture(0);
>>>>>>> a740f06 (Initial commit: Landing Page AutoGest)
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
<<<<<<< HEAD
    phoneGroup.position.x = 2.8;

    // Cuerpo del teléfono (Más refinado)
=======
    phoneGroup.position.x = 2.5; // Alineado a la derecha para dejar espacio al texto

    // Cuerpo del teléfono (Más refinado)
    // Carcasa (Comentada para dejar solo la pantalla flotante)
    /*
>>>>>>> a740f06 (Initial commit: Landing Page AutoGest)
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
<<<<<<< HEAD

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
=======
    */

    // Pantallas (Dos para Cross-fade)
    const screenGeom = new THREE.PlaneGeometry(2.32, 4.92);
    
    screenMeshA = new THREE.Mesh(screenGeom, new THREE.MeshBasicMaterial({ 
        transparent: true, 
        opacity: 1 
    }));
    screenMeshB = new THREE.Mesh(screenGeom, new THREE.MeshBasicMaterial({ 
        transparent: true, 
        opacity: 0,
        depthWrite: false
    }));
    screenMeshB.position.z = 0.001; // Offset para evitar parpadeo (Z-fighting)

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
    
    // Luz de "Halo" detrás de la pantalla
    const glowLight = new THREE.PointLight(0xffffff, 1.5, 10);
    glowLight.position.set(2, 0, -2);
    scene.add(glowLight);
    
    mouseLight = new THREE.PointLight(0xfacc15, 2, 20); 
>>>>>>> a740f06 (Initial commit: Landing Page AutoGest)
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
<<<<<<< HEAD
    if (loadedTextures[index] && screenMesh) {
        console.log(`[AutoGEST] 📱 Aplicando textura ${index} a la pantalla`);
        screenMesh.material.map = loadedTextures[index];
        screenMesh.material.needsUpdate = true;
    } else {
        console.warn(`[AutoGEST] ⚠️ No se puede aplicar textura ${index} aún.`);
    }
=======
    if (!loadedTextures[index]) return;

    const nextTexture = loadedTextures[index];
    const inactiveMesh = (activeMesh === screenMeshA) ? screenMeshB : screenMeshA;

    // Ajustar proporción de la nueva malla
    let aspect = nextTexture.image.width / nextTexture.image.height;
    if (index === 5) aspect = 1 / aspect; // Invertir aspecto por el giro de 90°
    
    // Ajuste de escala: General o 90% para Soberanía
    const targetAspect = 2.32 / 4.92;
    const scaleFactor = (index === 5) ? 0.9 : 1.0;
    inactiveMesh.scale.set((aspect / targetAspect) * scaleFactor, scaleFactor, 1);
    
    inactiveMesh.material.map = nextTexture;
    inactiveMesh.material.needsUpdate = true;

    // Cross-fade
    gsap.to(activeMesh.material, { opacity: 0, duration: 1, ease: "power2.inOut" });
    gsap.to(inactiveMesh.material, { opacity: 1, duration: 1, ease: "power2.inOut" });

    activeMesh = inactiveMesh;
>>>>>>> a740f06 (Initial commit: Landing Page AutoGest)
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    
<<<<<<< HEAD
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
=======
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
});

function setupScroll() {
    gsap.registerPlugin(ScrollTrigger);
    
    // (El movimiento ahora se maneja por disparadores individuales para sincronización perfecta)
>>>>>>> a740f06 (Initial commit: Landing Page AutoGest)

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

<<<<<<< HEAD
    // Cambio de texturas según la sección
    const sectionTriggers = [
        { trigger: "#ui-1", index: 1 },
        { trigger: "#ui-2", index: 2 },
        { trigger: "#ui-3", index: 3 },
        { trigger: "#ui-4", index: 4 },
        { trigger: "#data", index: 5 }
=======
    // Cambio de texturas y Posición (Dodge Logic)
    const sectionTriggers = [
        { trigger: "#hero", index: 0, x: 2.8, ry: -0.2 },
        { trigger: "#intro", index: 1, x: -2.8, ry: 0.2 },
        { trigger: "#features", index: 2, x: 2.8, ry: -0.2 },
        { trigger: "#ui-3-section", index: 3, x: -2.8, ry: 0.2 }, // Necesitamos ID en el section
        { trigger: "#ui-4-section", index: 4, x: 2.8, ry: -0.2 }, // Necesitamos ID en el section
        { trigger: "#ui-5-section", index: 5, x: 0, ry: 0, z: -2.5 },
        { trigger: "#cta-final", index: 5, x: 0, ry: 0, z: -30 }
>>>>>>> a740f06 (Initial commit: Landing Page AutoGest)
    ];

    sectionTriggers.forEach(st => {
        ScrollTrigger.create({
            trigger: st.trigger,
            start: "top center",
<<<<<<< HEAD
            onEnter: () => applyTexture(st.index),
            onLeaveBack: () => applyTexture(st.index - 1)
=======
            onEnter: () => {
                applyTexture(st.index);
                gsap.to(phoneGroup.position, { x: st.x, z: st.z || 0, duration: 1.2, ease: "power2.inOut" });
                gsap.to(phoneGroup.rotation, { y: st.ry, duration: 1.2, ease: "power2.inOut" });
                
                // Si es la sección final, desvanecer completamente
                if (st.trigger === "#cta-final") {
                    gsap.to([screenMeshA.material, screenMeshB.material], { opacity: 0, duration: 1.2 });
                }
            },
            onLeaveBack: () => {
                const prev = sectionTriggers.find(t => t.index === st.index - 1);
                if (prev) {
                    applyTexture(prev.index);
                    gsap.to(phoneGroup.position, { x: prev.x, z: prev.z || 0, duration: 1.2, ease: "power2.inOut" });
                    gsap.to(phoneGroup.rotation, { y: prev.ry, duration: 1.2, ease: "power2.inOut" });
                    
                    // Asegurar que vuelva a ser visible al subir
                    if (st.trigger === "#cta-final") {
                        gsap.to(activeMesh.material, { opacity: 1, duration: 1.2 });
                    }
                }
            }
>>>>>>> a740f06 (Initial commit: Landing Page AutoGest)
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
