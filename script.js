// Register GSAP Plugin
gsap.registerPlugin(ScrollTrigger);

// --- Three.js Background (Optimized Particle Field) ---
const initThreeJS = () => {
    const canvas = document.getElementById('bg-3d');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: false }); // Disable antialias for perf

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap pixel ratio

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1500; // Reasonable count
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 60; // Spread
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.03,
        color: 0x00f3ff, // Neon Cyan
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    camera.position.z = 20;

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (event) => {
        mouseX = event.clientX / window.innerWidth - 0.5;
        mouseY = event.clientY / window.innerHeight - 0.5;
    });

    // Animation Loop
    const clock = new THREE.Clock();

    const animate = () => {
        const elapsedTime = clock.getElapsedTime();

        // Rotate entire system slowly
        particlesMesh.rotation.y = elapsedTime * 0.05;
        particlesMesh.rotation.x = mouseY * 0.2;
        particlesMesh.rotation.y += mouseX * 0.2;

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    };

    animate();

    // Resize Handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
};

// --- GSAP Animations ---
const initAnimations = () => {
    
    // Hero Animations
    const tl = gsap.timeline();
    tl.from('.hero-subtitle', { y: 20, opacity: 0, duration: 0.8, ease: 'power2.out' })
      .from('.hero-title', { y: 30, opacity: 0, duration: 0.8, ease: 'power2.out' }, '-=0.6')
      .from('.hero-desc', { y: 20, opacity: 0, duration: 0.8, ease: 'power2.out' }, '-=0.6')
      .from('.hero-cta', { y: 20, opacity: 0, duration: 0.8, ease: 'power2.out' }, '-=0.6');

    // Scroll Animations (Using data-aos attributes logic manually with GSAP)
    
    // Fade Right
    gsap.utils.toArray('[data-aos="fade-right"]').forEach(el => {
        gsap.from(el, {
            scrollTrigger: { trigger: el, start: 'top 85%' },
            x: -50,
            opacity: 0,
            duration: 1,
            ease: 'power2.out'
        });
    });

    // Fade Left
    gsap.utils.toArray('[data-aos="fade-left"]').forEach(el => {
        gsap.from(el, {
            scrollTrigger: { trigger: el, start: 'top 85%' },
            x: 50,
            opacity: 0,
            duration: 1,
            ease: 'power2.out'
        });
    });

    // Fade Up
    gsap.utils.toArray('[data-aos="fade-up"]').forEach(el => {
        gsap.from(el, {
            scrollTrigger: { trigger: el, start: 'top 90%' },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power2.out'
        });
    });

    // Zoom In
    gsap.utils.toArray('[data-aos="zoom-in"]').forEach(el => {
        gsap.from(el, {
            scrollTrigger: { trigger: el, start: 'top 85%' },
            scale: 0.8,
            opacity: 0,
            duration: 0.8,
            ease: 'back.out(1.7)'
        });
    });

    // Navbar Scroll Effect
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
};

// --- Mobile Menu ---
const initMobileMenu = () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li');
    const anchors = document.querySelectorAll('.nav-links a');

    const toggleMenu = () => {
        // Toggle Nav
        navLinks.classList.toggle('nav-active');
        document.body.classList.toggle('nav-open', navLinks.classList.contains('nav-active'));
        
        // Animate Links
        links.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });

        // Hamburger Animation
        hamburger.classList.toggle('toggle');
    };

    hamburger.addEventListener('click', toggleMenu);

    // Close menu on link click (navigate to section)
    anchors.forEach(a => {
        a.addEventListener('click', () => {
            if (navLinks.classList.contains('nav-active')) {
                toggleMenu();
            }
        });
    });
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initThreeJS();
    initAnimations();
    initMobileMenu();
});
