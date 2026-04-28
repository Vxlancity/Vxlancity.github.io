// Check Maintenance Mode
if (localStorage.getItem('maintenance') === 'true' && !window.location.href.includes('admin.html')) {
    document.body.innerHTML = `
        <div style="height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #000; color: #fff; text-align: center; font-family: 'Inter', sans-serif;">
            <h1 style="font-size: 4rem; color: #E31B23; margin-bottom: 20px;">Maintenance Mode</h1>
            <p style="font-size: 1.5rem; color: #a0a0a0;">We're currently updating Vxlancity DEV Portfolio. Be right back!</p>
            <div style="margin-top: 40px; width: 100px; height: 4px; background: #E31B23; animation: pulse 2s infinite;"></div>
            <style>
                @keyframes pulse { 0% { opacity: 0.2; } 50% { opacity: 1; } 100% { opacity: 0.2; } }
            </style>
        </div>
    `;
    throw new Error("Maintenance Mode Active");
}

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

// Load Projects from LocalStorage or Defaults
function loadProjects() {
    const projectGrid = document.querySelector('.project-grid');
    const storedProjects = JSON.parse(localStorage.getItem('projects') || '[]');
    
    if (storedProjects.length > 0) {
        projectGrid.innerHTML = storedProjects.map((p, index) => `
            <div class="project-card">
                <div class="project-image" style="background: #111;"></div>
                <div class="project-info">
                    <h3>${p.title}</h3>
                    <p>${p.desc}</p>
                    <div class="project-tags">
                        ${p.tags.map(tag => `<span>${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
        `).join('');
    }
}
loadProjects();

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

// Contact Form Discord Integration
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const webhook = localStorage.getItem('webhook');
        if (!webhook) {
            alert('Formular gesendet! (Tipp: Im Admin-Bereich kann eine Discord Webhook hinterlegt werden)');
            return;
        }

        const formData = {
            name: contactForm.querySelector('input[type="text"]').value,
            email: contactForm.querySelector('input[type="email"]').value,
            message: contactForm.querySelector('textarea').value
        };

        try {
            const response = await fetch(webhook, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    embeds: [{
                        title: 'New Contact Form Submission',
                        color: 0xE31B23,
                        fields: [
                            { name: 'Name', value: formData.name },
                            { name: 'Email', value: formData.email },
                            { name: 'Message', value: formData.message }
                        ],
                        footer: { text: 'Vxlancity Portfolio' }
                    }]
                })
            });

            if (response.ok) {
                alert('Nachricht erfolgreich gesendet!');
                contactForm.reset();
            } else {
                alert('Fehler beim Senden.');
            }
        } catch (error) {
            console.error('Error sending to Discord:', error);
            alert('Fehler beim Senden an Discord.');
        }
    });
}

// Admin Shortcut (Alt + A)
window.addEventListener('keydown', (e) => {
    if (e.altKey && e.key.toLowerCase() === 'a') {
        window.location.href = 'admin.html';
    }
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

