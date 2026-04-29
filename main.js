// Supabase Configuration
const SUPABASE_URL = 'https://iutdotykpgrdhgvqtnjx.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1dGRvdHlrcGdyZGhndnF0bmp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0MDM1NzAsImV4cCI6MjA5Mjk3OTU3MH0.q2zkK2ob_ohmG_o7o4q2r2_DbgLgWivTZ6Z-UVXoEJg';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Code Rain Background
(function initCodeRain() {
    const canvas = document.getElementById('code-rain');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const chars = '{}[]()<>=/;:const let var function return async await import export class new this =>+-*&|!?.0123456789abcdef';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    // Randomize starting positions
    for (let i = 0; i < drops.length; i++) {
        drops[i] = Math.random() * canvas.height / fontSize;
    }

    function draw() {
        ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#E31B23';
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const char = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(char, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i] += 0.5;
        }
    }

    setInterval(draw, 50);
})();

// Admin Shortcut (Alt + A)
window.addEventListener('keydown', (e) => {
    if (e.altKey && e.key.toLowerCase() === 'a') {
        window.location.href = 'admin.html';
    }
});

// Check Maintenance Mode
async function checkMaintenance() {
    try {
        const { data, error } = await supabaseClient.from('site_config').select('value').eq('key', 'maintenance').single();
        if (data && data.value === 'true' && !window.location.href.includes('admin.html')) {
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
        }
    } catch (e) {
        // Fallback to local
        if (localStorage.getItem('maintenance') === 'true' && !window.location.href.includes('admin.html')) {
            location.reload();
        }
    }
}
checkMaintenance();

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

// Smooth Anchor Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            lenis.scrollTo(targetElement, {
                offset: -50,
                duration: 1.5,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
        }
    });
});

// GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

// Custom Cursor
const cursor = document.getElementById('cursor');
const cursorBlur = document.getElementById('cursor-blur');

// Typed.js style effect for the badge
document.addEventListener('DOMContentLoaded', () => {
    const badgeContainer = document.getElementById('badge-container');
    if (badgeContainer) {
        // The raw code string that will be typed
        const codeString = '<div class="badge">\n  <span>Available for Custom Websites</span>\n</div>';
        let i = 0;
        
        // Create a span to hold the typed code
        const codeDisplay = document.createElement('div');
        codeDisplay.style.fontFamily = 'monospace';
        codeDisplay.style.color = 'rgba(255, 255, 255, 0.6)';
        codeDisplay.style.fontSize = '0.9rem';
        codeDisplay.style.textAlign = 'left';
        codeDisplay.style.whiteSpace = 'pre';
        badgeContainer.appendChild(codeDisplay);

        // Start typing after 1.5 seconds (after hero text appears)
        setTimeout(() => {
            const typeInterval = setInterval(() => {
                codeDisplay.textContent += codeString.charAt(i);
                i++;
                if (i >= codeString.length) {
                    clearInterval(typeInterval);
                    // Flash effect and compile into real badge
                    setTimeout(() => {
                        badgeContainer.innerHTML = `
                            <div class="availability-badge" style="margin-bottom: 0;">
                                <span class="pulse-dot"></span>
                                Available for Custom Websites & Freelance
                            </div>
                        `;
                        
                        // Add a small pop animation to the newly compiled badge
                        const newBadge = badgeContainer.querySelector('.availability-badge');
                        newBadge.style.animation = 'none'; // remove the old clip-path animation
                        newBadge.style.clipPath = 'none';
                        gsap.from(newBadge, { scale: 0.8, opacity: 0, duration: 0.5, ease: 'back.out(1.5)' });

                    }, 600); // pause before compiling
                }
            }, 30); // 30ms per character
        }, 1500);
    }
});

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

// Apple Style Cinematic Scroll Animation
const appleRevealTl = gsap.timeline({
    scrollTrigger: {
        trigger: '#apple-reveal',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
    }
});

appleRevealTl
    // Phase 1: Rings fade in slowly
    .to('.reveal-ring', { opacity: 1, duration: 1, stagger: 0.3 })
    // Phase 2: Glow point appears
    .to('.glow-box', { scale: 1, opacity: 1, duration: 1 }, '-=0.5')
    // Phase 3: VXLANCITY rises in slowly
    .to('.sticky-title.t1', { opacity: 1, y: 0, duration: 2.5, ease: 'power2.out' })
    // Start gradient animation
    .set('.sticky-title.t1', { animationPlayState: 'running' })
    // Phase 4: Particles drift in
    .to('.reveal-particle', { opacity: 0.8, duration: 1, stagger: 0.15 }, '-=1')
    // Phase 5: Accent line stretches
    .to('.reveal-line', { width: '60%', opacity: 1, duration: 1.2 }, '-=0.5')
    // Hold - let everything breathe
    .to({}, { duration: 2.5 })
    // Phase 6: Rings expand outward
    .to('.reveal-ring:nth-child(1)', { width: 600, height: 600, opacity: 0, duration: 1.5 }, '+=0.5')
    .to('.reveal-ring:nth-child(2)', { width: 800, height: 800, opacity: 0, duration: 1.5 }, '-=1')
    .to('.reveal-ring:nth-child(3)', { width: 1000, height: 1000, opacity: 0, duration: 1.5 }, '-=1')
    // Phase 7: Title fades, particles scatter
    .to('.sticky-title.t1', { opacity: 0, scale: 1.1, duration: 1.2 }, '-=0.8')
    .to('.reveal-particle', { opacity: 0, scale: 3, duration: 0.8, stagger: 0.08 }, '-=0.8')
    .to('.reveal-line', { width: '0%', opacity: 0, duration: 0.8 }, '-=0.8')
    // Phase 8: Glow expands
    .to('.glow-box', { scale: 200, opacity: 0.8, duration: 2 }, '-=0.5')
    // Phase 9: Innovation text appears
    .to('.sticky-title.t2', { opacity: 1, y: 0, duration: 2, ease: 'power2.out' }, '-=1.5')
    // Hold
    .to({}, { duration: 2 })
    // Phase 10: Fade out
    .to('.sticky-title.t2', { opacity: 0, y: -30, duration: 1.5 })
    .to('.glow-box', { opacity: 0, duration: 1 }, '-=1');

// Section Reveal Animations
const sections = document.querySelectorAll('.container');

// Function to get appropriate icon for a link
function getLinkIconHTML(url, iconOnly = false) {
    if (!url) return '';
    const lowerUrl = url.toLowerCase();
    let svg = '';
    let text = 'Website ↗';

    if (lowerUrl.includes('discord')) {
        svg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg>`;
        text = 'Discord';
    } else if (lowerUrl.includes('github.com')) {
        svg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`;
        text = 'GitHub';
    } else if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) {
        svg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`;
        text = 'YouTube';
    } else if (lowerUrl.includes('instagram.com')) {
        svg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>`;
        text = 'Instagram';
    } else if (lowerUrl.includes('x.com') || lowerUrl.includes('twitter.com')) {
        svg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`;
        text = 'X';
    } else {
        svg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`;
    }

    return iconOnly ? svg : `${svg} ${text}`.trim();
}

// Ensure default projects exist
if (!localStorage.getItem('projects')) {
    const defaultProjects = [
        {
            id: 1,
            title: "Aera Craft",
            desc: "Ein evolutionäres Minecraft-Konzept: Vier Wochen, vier Epochen. Vom primitiven Steinzeit-Survival bis zum hochtechnologisierten Fraktionskrieg. Aus gemeinsamem Aufbau wird eine erbarmungslose Schlacht um die Vorherrschaft. Wer am Ende die Festung hält, wird zur Server-Legende.",
            tags: ["Minecraft", "Java", "Game Design"],
            image: "https://images.unsplash.com/photo-1607513746994-51f730a44832?q=80&w=1000&auto=format&fit=crop",
            badge: "Projekt Idee (2026)",
            links: ["https://discord.gg/aeracraft"]
        },
        {
            id: 2,
            title: "Vxlancity Store",
            desc: "Modern E-Commerce platform with Apple-style interactions, glassmorphism UI, and lightning fast checkout flow.",
            tags: ["Next.js", "Tailwind"],
            image: "assets/project2.png",
            badge: "",
            links: ["https://vxlancity.github.io"]
        }
    ];
    localStorage.setItem('projects', JSON.stringify(defaultProjects));
}

// Load Projects from Supabase (with fallback)
async function loadProjects() {
    const projectGrid = document.querySelector('.project-grid');
    if (!projectGrid) return;

    try {
        const { data: projects, error } = await supabaseClient.from('projects').select('*').order('created_at', { ascending: false });

        const displayProjects = (projects && projects.length > 0) ? projects : JSON.parse(localStorage.getItem('projects') || '[]');

        if (displayProjects.length > 0) {
            projectGrid.innerHTML = displayProjects.map(p => {
                const linksArray = p.links || [];
                const linksHTML = linksArray.length > 0 ? '<div class="project-links">' + linksArray.map(link =>
                    `<a href="${link}" class="project-link" target="_blank">${getLinkIconHTML(link)}</a>`
                ).join('') + '</div>' : '';

                return `
                <div class="project-card">
                    <div class="project-image-wrapper">
                        ${p.badge ? `<div class="project-badge">${p.badge}</div>` : ''}
                        <div class="project-image" style="background-image: url('${p.image_url || p.image || ''}');"></div>
                    </div>
                    <div class="project-info">
                        <h3>${p.title}</h3>
                        <p>${p.description || p.desc}</p>
                        <div class="project-tags">
                            ${(p.tags || []).map(tag => `<span>${tag}</span>`).join('')}
                        </div>
                        ${linksHTML}
                    </div>
                </div>
                `;
            }).join('');
        }
    } catch (e) { console.error("Cloud projects failed", e); }
}
loadProjects();

// Load Config from Supabase
async function loadConfig() {
    try {
        const { data, error } = await supabaseClient.from('site_config').select('*');
        if (data) {
            const config = Object.fromEntries(data.map(c => [c.key, c.value]));

            // Hero Title from DB
            const heroTitle = document.getElementById('hero-title');
            if (config.hero_title && heroTitle) {
                heroTitle.textContent = config.hero_title;
                heroTitle.setAttribute('data-text', config.hero_title);
            }

            // Site Progress from DB
            if (config.site_progress) {
                const fill = document.querySelector('.dev-progress-fill');
                const pct = document.querySelector('.dev-progress-pct');
                if (fill) fill.style.width = config.site_progress + '%';
                if (pct) pct.textContent = config.site_progress + '%';
            }

            // Discord
            if (config.discord_id) {
                localStorage.setItem('discord-userid', config.discord_id);
                localStorage.setItem('has-nitro', config.has_nitro === 'true' ? 'true' : 'false');
                loadDiscordPresence(config.discord_id, config.has_nitro === 'true');
            }

            // Terminal Socials
            if (config.terminal_socials && terminalSocialContainer) {
                const links = config.terminal_socials.split(',').map(s => s.trim());
                terminalSocialContainer.innerHTML = links.map(link => `<a href="${link}" target="_blank" class="terminal-social">${getLinkIconHTML(link, true)}</a>`).join(', ');
            }

            // Footer Socials
            if (config.footer_socials && footerSocialContainer) {
                const links = config.footer_socials.split(',').map(s => s.trim());
                footerSocialContainer.innerHTML = links.map(link => `<a href="${link}" target="_blank" class="project-link">${getLinkIconHTML(link)}</a>`).join('');
            }

            // Favorite Anime
            if (config.favorite_anime) {
                const animeBadge = document.getElementById('anime-badge');
                const animeDisplay = document.getElementById('favorite-anime-display');
                if (animeBadge && animeDisplay) {
                    animeBadge.style.display = 'inline-flex';
                    animeDisplay.textContent = config.favorite_anime;
                }
            }

            // Visitor Counter with Session Lock
            const visitCountEl = document.getElementById('visit-count');
            if (visitCountEl) {
                let currentViews = parseInt(config.page_views || '0');
                
                if (!sessionStorage.getItem('vxlancity_counted')) {
                    currentViews++;
                    // Save back to Supabase
                    supabaseClient.from('site_config')
                        .upsert({ key: 'page_views', value: currentViews.toString() })
                        .then(() => {
                            sessionStorage.setItem('vxlancity_counted', 'true');
                        });
                }
                
                visitCountEl.textContent = currentViews.toLocaleString();
            }

            // Webhook URL
            if (config.webhook) {
                localStorage.setItem('webhook', config.webhook);
            }
        }
    } catch (e) { console.error("Cloud config failed", e); }
}

// Keep old local loaders as immediate fallback
const terminalSocialContainer = document.getElementById('terminal-social-container');
const footerSocialContainer = document.getElementById('footer-social-container');
loadConfig();

// Lanyard Discord Presence
async function loadDiscordPresence(overrideId = null, forceNitro = false) {
    const discordId = overrideId || localStorage.getItem('discord-userid');
    const hasNitroConfig = forceNitro || localStorage.getItem('has-nitro') === 'true';
    if (!discordId) return;

    const widget = document.getElementById('discord-widget');
    if (!widget) return;

    try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${discordId}`);
        const { data, success } = await response.json();

        if (success && data) {
            widget.style.display = 'flex';

            const user = data.discord_user;
            const status = data.discord_status;
            const isAnimated = user.avatar && user.avatar.startsWith('a_');
            const avatarUrl = user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${isAnimated ? 'gif' : 'png'}?size=128` : 'https://cdn.discordapp.com/embed/avatars/0.png';

            const showsNitro = isAnimated || hasNitroConfig;
            const nitroBadge = showsNitro ? `<img src="https://cdn.discordapp.com/badge-icons/2ba85e8026a8614b640c2837bcdfe21b.png" title="Nitro User" alt="Nitro" style="width: 20px; height: 20px; vertical-align: middle; margin-left: 5px;">` : '';

            let activitiesHtml = '';
            
            // Always show base status first
            const baseStatusHtml = `<div class="discord-activity" style="margin-bottom: 4px;">${status === 'online' ? '🟢 Online' : (status === 'idle' ? '🌙 Idle' : (status === 'dnd' ? '🔴 Do Not Disturb' : '⚫ Offline'))}</div>`;
            activitiesHtml += baseStatusHtml;

            if (data.activities && data.activities.length > 0) {
                data.activities.forEach(activity => {
                    if (activity.id === 'spotify:1') return; // Handled separately
                    
                    if (activity.type === 4) {
                        // Custom Status
                        let emojiHtml = '';
                        if (activity.emoji) {
                            if (activity.emoji.id) {
                                emojiHtml = `<img src="https://cdn.discordapp.com/emojis/${activity.emoji.id}.${activity.emoji.animated ? 'gif' : 'png'}" style="width: 14px; height: 14px; vertical-align: middle;"> `;
                            } else if (activity.emoji.name) {
                                emojiHtml = `${activity.emoji.name} `;
                            }
                        }
                        activitiesHtml += `<div class="discord-activity" style="margin-bottom: 4px; color: var(--accent-color);">${emojiHtml}<strong>${activity.state || activity.name}</strong></div>`;
                    } else if (activity.type === 0) {
                        activitiesHtml += `<div class="discord-activity" style="margin-bottom: 4px;">🎮 Playing <strong>${activity.name}</strong></div>`;
                    } else if (activity.type === 3) {
                        activitiesHtml += `<div class="discord-activity" style="margin-bottom: 4px;">📺 Watching <strong>${activity.name}</strong></div>`;
                    } else if (activity.type === 2) {
                        activitiesHtml += `<div class="discord-activity" style="margin-bottom: 4px;">🎧 Listening to <strong>${activity.name}</strong></div>`;
                    } else if (activity.type === 5) {
                        activitiesHtml += `<div class="discord-activity" style="margin-bottom: 4px;">🏆 Competing in <strong>${activity.name}</strong></div>`;
                    } else {
                        activitiesHtml += `<div class="discord-activity" style="margin-bottom: 4px;">✨ <strong>${activity.name}</strong></div>`;
                    }
                });
            }

            if (data.listening_to_spotify) {
                const spotify = data.spotify;
                const spotifyUrl = `https://open.spotify.com/track/${spotify.track_id}`;
                activitiesHtml += `<div class="discord-activity" style="margin-bottom: 4px;"><a href="${spotifyUrl}" target="_blank" style="color: inherit; text-decoration: none; display: inline-flex; align-items: center; gap: 5px; transition: 0.3s;" onmouseover="this.style.color='#1DB954'" onmouseout="this.style.color='inherit'"><svg width="14" height="14" viewBox="0 0 24 24" fill="#1DB954"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.51 17.3c-.22.36-.68.47-1.05.25-2.82-1.73-6.35-2.12-10.51-1.17-.41.1-.83-.16-.93-.57-.1-.41.16-.83.57-.93 4.54-1.04 8.44-.6 11.58 1.33.37.22.48.69.26 1.05v.04zm1.48-3.26c-.28.46-.88.6-1.34.33-3.22-1.98-8.13-2.55-11.95-1.39-.52.16-1.08-.14-1.24-.66-.16-.52.14-1.08.66-1.24 4.38-1.33 9.79-.7 13.54 1.6.46.28.6.88.33 1.34v.02zm.12-3.38C15.54 8.65 10.1 8.47 7.02 9.4c-.58.18-1.2-.16-1.38-.74-.18-.58.16-1.2.74-1.38 3.56-1.08 9.55-.86 13.72 1.62.53.31.7.99.39 1.52-.31.53-.99.7-1.52.39z"/></svg> Listening to <strong>${spotify.song}</strong></a></div>`;
            }

            widget.innerHTML = `
                <div class="discord-avatar">
                    <img src="${avatarUrl}" alt="${user.username}">
                    <div class="discord-status ${status}"></div>
                </div>
                <div class="discord-info">
                    <h4 style="display: flex; align-items: center; gap: 5px; margin: 0;">${user.global_name || user.username} ${nitroBadge}</h4>
                    <p style="margin: 0 !important; font-size: 0.8rem; opacity: 0.6;">@${user.username}</p>
                    <div style="margin-top: 5px; display: flex; flex-direction: column;">
                        ${activitiesHtml}
                    </div>
                </div>
            `;
        }
    } catch (e) {
        console.error("Failed to load Lanyard presence", e);
    }
}
loadDiscordPresence();
setInterval(loadDiscordPresence, 15000);

sections.forEach(section => {
    const elementsToAnimate = section.querySelectorAll('.section-title, .title-line, .about-text, .contact-box');
    if (elementsToAnimate.length > 0) {
        gsap.from(elementsToAnimate, {
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
    }

    // Separate Trigger for Tech Cards
    const techCards = section.querySelectorAll('.tech-card');
    if (techCards.length > 0) {
        gsap.fromTo(techCards,
            { y: 30, opacity: 0 },
            {
                scrollTrigger: {
                    trigger: '.tech-stack',
                    start: 'top 85%',
                },
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.05,
                ease: 'back.out(1.7)'
            }
        );
    }

    // Separate Trigger for Project Cards
    const projectCards = section.querySelectorAll('.project-card');
    if (projectCards.length > 0) {
        gsap.fromTo(projectCards,
            { y: 50, opacity: 0 },
            {
                scrollTrigger: {
                    trigger: '.project-grid',
                    start: 'top 85%',
                },
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power3.out'
            }
        );
    }
});

// Contact Form Discord Integration
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        // Try Supabase config first, then localStorage
        let webhook = localStorage.getItem('webhook');

        if (!webhook) {
            // Try loading from Supabase directly
            try {
                const { data } = await supabaseClient.from('site_config').select('value').eq('key', 'webhook').single();
                if (data && data.value) {
                    webhook = data.value;
                    localStorage.setItem('webhook', webhook);
                }
            } catch (err) {
                console.warn('Could not fetch webhook from DB:', err);
            }
        }

        if (!webhook) {
            alert('Kein Webhook konfiguriert. Bitte im Admin-Bereich eine Discord Webhook-URL hinterlegen.');
            return;
        }

        // Show loading state
        submitBtn.textContent = 'Wird gesendet...';
        submitBtn.disabled = true;

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
                        title: '📩 Neue Kontaktanfrage',
                        color: 0xE31B23,
                        fields: [
                            { name: '👤 Name', value: formData.name, inline: true },
                            { name: '📧 Email', value: formData.email, inline: true },
                            { name: '💬 Nachricht', value: formData.message }
                        ],
                        footer: { text: 'Vxlancity Portfolio' },
                        timestamp: new Date().toISOString()
                    }]
                })
            });

            if (response.ok || response.status === 204) {
                submitBtn.textContent = '✓ Gesendet!';
                submitBtn.style.background = '#27c93f';
                contactForm.reset();
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
            } else {
                const errorText = await response.text();
                console.error('Webhook response:', response.status, errorText);
                submitBtn.textContent = '✗ Fehler';
                submitBtn.style.background = '#e31b23';
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
            }
        } catch (error) {
            console.error('Webhook fetch error:', error);
            submitBtn.textContent = '✗ Verbindungsfehler';
            submitBtn.style.background = '#e31b23';
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);
        }
    });
}



// Magnetic effect on elements
function setupMagneticEffect(selector, strength = 0.3) {
    document.querySelectorAll(selector).forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(el, {
                x: x * strength,
                y: y * strength,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        el.addEventListener('mouseleave', () => {
            gsap.to(el, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    });
}

// Apply magnetic effects
setupMagneticEffect('.tech-card', 0.3);
setupMagneticEffect('.btn-primary', 0.2);
setupMagneticEffect('.nav-links a', 0.4);
setupMagneticEffect('.terminal-social', 0.5);
setupMagneticEffect('.socials a', 0.4);

// Typing Effect
const phrases = ["Full stack dev", "Building digital experiences", "Nothing to do", "Solving complex problems"];
let currentPhraseIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;
const typingTextElement = document.querySelector('.typing-text');

function type() {
    if (!typingTextElement) return;
    const currentPhrase = phrases[currentPhraseIndex];

    if (isDeleting) {
        typingTextElement.textContent = currentPhrase.substring(0, currentCharIndex - 1);
        currentCharIndex--;
    } else {
        typingTextElement.textContent = currentPhrase.substring(0, currentCharIndex + 1);
        currentCharIndex++;
    }

    let typeSpeed = isDeleting ? 40 : 100;

    if (!isDeleting && currentCharIndex === currentPhrase.length) {
        typeSpeed = 2000; // Pause at end
        isDeleting = true;
    } else if (isDeleting && currentCharIndex === 0) {
        isDeleting = false;
        currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
        typeSpeed = 500; // Pause before start typing
    }

    setTimeout(type, typeSpeed);
}
setTimeout(type, 1000);

// --- Translation & Hacker Scramble System ---
const translations = {
    en: {
        'nav.home': 'Home',
        'nav.about': 'About',
        'nav.projects': 'Projects',
        'nav.contact': 'Contact',
        'nav.hireMe': 'Hire Me',
        'about.title': 'About Me & Services',
        'about.cat1Title': '👤 Who am I?',
        'about.cat1Desc': 'I\'m a 14-year-old developer based in Lower Saxony, Germany.',
        'about.cat2Title': '💻 What I do',
        'about.cat2Desc': 'I build custom websites, backend systems, and full-stack applications.',
        'about.cat3Title': '🎯 Vision',
        'about.cat3Desc': 'Creating lightning-fast, modern, and visually stunning web experiences.',
        'about.cat4Title': '🍿 Hobbies',
        'about.cat4Desc': 'When I\'m not coding or designing, I\'m usually watching anime.',
        'about.anime': 'Favorite Anime:',
        'about.servicesTitle': '🚀 Custom Websites on Demand',
        'about.servicesDesc': 'Looking for a modern, fast, and impressive website? I build <strong>completely custom websites</strong> on request – from portfolios to landing pages to complex web apps, tailored to your needs.',
        'about.techStack': 'TECH STACK',
        'projects.title': 'My Work',
        'contact.title': 'Ready for your <span class="accent">Custom Website</span>?',
        'contact.desc': 'Do you have an idea for a website or want to commission a completely custom project? Just send me a message!',
        'contact.name': 'Name',
        'contact.email': 'Email',
        'contact.message': 'Message',
        'contact.send': 'Send Message',
        'footer.rights': '&copy; 2026 Vxlancity DEV. All rights reserved.'
    },
    de: {
        'nav.home': 'Start',
        'nav.about': 'Über Mich',
        'nav.projects': 'Projekte',
        'nav.contact': 'Kontakt',
        'nav.hireMe': 'Beauftragen',
        'about.title': 'Über Mich & Services',
        'about.cat1Title': '👤 Wer bin ich?',
        'about.cat1Desc': 'Ich bin ein 14-jähriger Developer aus Niedersachsen.',
        'about.cat2Title': '💻 Was ich mache',
        'about.cat2Desc': 'Ich entwickle Custom-Websites, Backend-Systeme und Full-Stack-Apps.',
        'about.cat3Title': '🎯 Vision',
        'about.cat3Desc': 'Ich erschaffe blitzschnelle, moderne und optisch beeindruckende Web-Erlebnisse.',
        'about.cat4Title': '🍿 Hobbys',
        'about.cat4Desc': 'Wenn ich nicht gerade code, schaue ich am liebsten Anime.',
        'about.anime': 'Lieblings-Anime:',
        'about.servicesTitle': '🚀 Custom Websites auf Anfrage',
        'about.servicesDesc': 'Du suchst eine moderne, schnelle und beeindruckende Website? Ich erstelle <strong>komplett individuelle Websites</strong> auf Anfrage – von Portfolios über Landingpages bis hin zu komplexen Web-Apps, maßgeschneidert auf deine Bedürfnisse.',
        'about.techStack': 'TECHNOLOGIEN',
        'projects.title': 'Meine Projekte',
        'contact.title': 'Bereit für deine <span class="accent">eigene Website</span>?',
        'contact.desc': 'Hast du eine Idee für eine Website oder möchtest du ein komplett eigenes Projekt in Auftrag geben? Schreib mir einfach!',
        'contact.name': 'Name',
        'contact.email': 'E-Mail',
        'contact.message': 'Nachricht',
        'contact.send': 'Nachricht senden',
        'footer.rights': '&copy; 2026 Vxlancity DEV. Alle Rechte vorbehalten.'
    }
};

let currentLang = 'en';
const scrambleChars = '!<>-_\\\\/[]{}—=+*^?#_';

function scrambleText(element, newText) {
    const isHtml = newText.includes('<');
    
    // Extract plain text for scrambling if there's HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = newText;
    const textToScramble = tempDiv.textContent;
    
    let iteration = 0;
    const maxIterations = 20;
    const originalColor = window.getComputedStyle(element).color;
    
    // Temporarily style as hacker text
    element.style.color = '#27c93f';
    element.style.fontFamily = 'monospace';

    const interval = setInterval(() => {
        element.innerText = textToScramble
            .split('')
            .map((letter, index) => {
                if (index < (iteration / maxIterations) * textToScramble.length) {
                    return textToScramble[index];
                }
                return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
            })
            .join('');

        iteration++;

        if (iteration >= maxIterations) {
            clearInterval(interval);
            // Restore HTML and original styling
            if (isHtml) {
                element.innerHTML = newText;
            } else {
                element.textContent = newText;
            }
            element.style.color = '';
            element.style.fontFamily = '';
        }
    }, 30);
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const lang = e.target.getAttribute('data-lang');
            if (lang === currentLang) return;
            
            currentLang = lang;
            
            // Update active styling
            document.querySelectorAll('.lang-btn').forEach(b => {
                b.classList.remove('active');
                b.style.color = 'var(--muted-color)';
            });
            document.querySelectorAll(`.lang-btn[data-lang="${lang}"]`).forEach(b => {
                b.classList.add('active');
                b.style.color = 'var(--accent-color)';
            });

            // Scramble animation for all translatable elements
            document.querySelectorAll('[data-translate]').forEach(el => {
                const key = el.getAttribute('data-translate');
                if (translations[lang][key]) {
                    scrambleText(el, translations[lang][key]);
                }
            });

            // Instantly translate placeholders
            document.querySelectorAll('[data-placeholder]').forEach(el => {
                const key = el.getAttribute('data-placeholder');
                if (translations[lang][key]) {
                    el.setAttribute('placeholder', translations[lang][key]);
                }
            });
        });
    });
});