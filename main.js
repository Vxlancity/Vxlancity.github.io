// Initialize Lenis Smooth Scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

// Custom Cursor
const cursor = document.getElementById('cursor');
const cursorBlur = document.getElementById('cursor-blur');

document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power2.out'
    });
    gsap.to(cursorBlur, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: 'power2.out'
    });
});

// Hover effect on links
document.querySelectorAll('a, button, .tech-card, .project-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
        gsap.to(cursor, { scale: 4, duration: 0.3 });
        gsap.to(cursorBlur, { opacity: 0.8, scale: 1.2, duration: 0.3 });
    });
    el.addEventListener('mouseleave', () => {
        gsap.to(cursor, { scale: 1, duration: 0.3 });
        gsap.to(cursorBlur, { opacity: 0.5, scale: 1, duration: 0.3 });
    });
});

// Navbar Scroll Effect
ScrollTrigger.create({
    start: 'top -80',
    onUpdate: (self) => {
        if (self.direction === 1) {
            document.getElementById('navbar').classList.add('scrolled');
        } else if (self.scroll() < 80) {
            document.getElementById('navbar').classList.remove('scrolled');
        }
    }
});

// Hero Animations
const heroTl = gsap.timeline();

heroTl.from('.reveal-text', {
    y: 100,
    opacity: 0,
    duration: 1,
    ease: 'power4.out',
    delay: 0.5
})
.from('.hero-subtitle', {
    opacity: 0,
    y: 20,
    duration: 0.8,
    ease: 'power3.out'
}, '-=0.5')
.from('.hero-stats .stat-item', {
    opacity: 0,
    y: 20,
    stagger: 0.2,
    duration: 0.8,
    ease: 'power3.out'
}, '-=0.5')
.from('.logo, .nav-links li, .nav-cta', {
    opacity: 0,
    y: -20,
    stagger: 0.1,
    duration: 0.8,
    ease: 'power3.out'
}, '-=1');

// Apple Style Scroll Animation
const appleRevealTl = gsap.timeline({
    scrollTrigger: {
        trigger: '#apple-reveal',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
    }
});

appleRevealTl
    .to('.sticky-title', { opacity: 1, y: 0, duration: 1 })
    .to('.glow-box', { scale: 10, opacity: 1, duration: 2, borderRadius: '0%' }, '+=1')
    .to('.sticky-title', { opacity: 0, y: -50, duration: 1 }, '-=1');

// Section Reveal Animations
const sections = document.querySelectorAll('.container');

sections.forEach(section => {
    gsap.from(section.querySelectorAll('.section-title, .title-line, .about-text, .tech-card, .project-card, .contact-box'), {
        scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out'
    });
});

// Magnetic effect on tech cards (Bonus)
document.querySelectorAll('.tech-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        gsap.to(card, {
            x: x * 0.3,
            y: y * 0.3,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
    
    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: 'elastic.out(1, 0.3)'
        });
    });
});
