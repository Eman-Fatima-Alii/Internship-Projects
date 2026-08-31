/* ==========================================================
   Eman Fatima - Full Stack AI Engineer Portfolio
   index.js - Interactive Engine, Neural Canvas & Micro-animations
========================================================== */

document.addEventListener("DOMContentLoaded", () => {
    initLoader();
    initNeuralCanvas();
    initTypewriter();
    initCustomCursor();
    initScrollProgress();
    initNavigation();
    initCardSpotlights();
    initHologramTilt();
    initAnimatedStats();
    initCopyEmail();
    initScrollReveals();
    initBackToTop();
    logConsoleBranding();
});

/* ================= 1. System Loader ================= */

function initLoader() {
    const loader = document.getElementById("loader");
    if (!loader) return;

    window.addEventListener("load", () => {
        setTimeout(() => {
            loader.style.opacity = "0";
            loader.style.visibility = "hidden";
        }, 800);
    });

    // Fallback if load already fired
    setTimeout(() => {
        if (loader && loader.style.visibility !== "hidden") {
            loader.style.opacity = "0";
            loader.style.visibility = "hidden";
        }
    }, 2500);
}

/* ================= 2. Interactive Neural Canvas ================= */

function initNeuralCanvas() {
    const canvas = document.getElementById("neuralCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouse = { x: null, y: null, radius: 140 };

    window.addEventListener("mousemove", (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener("mouseleave", () => {
        mouse.x = null;
        mouse.y = null;
    });

    window.addEventListener("resize", () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        initParticles();
    });

    function getRandom() {
        const array = new Uint32Array(1);
        window.crypto.getRandomValues(array);
        return array[0] / (0xffffffff + 1);
    }

    class Particle {
        constructor() {
            this.x = getRandom() * width;
            this.y = getRandom() * height;
            this.vx = (getRandom() - 0.5) * 0.7;
            this.vy = (getRandom() - 0.5) * 0.7;
            this.radius = getRandom() * 2 + 1;
            this.color = getRandom() > 0.45 ? "rgba(56, 189, 248, " : "rgba(99, 102, 241, ";
            this.alpha = getRandom() * 0.5 + 0.2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx = -this.vx;
            if (this.y < 0 || this.y > height) this.vy = -this.vy;

            // Mouse repulsion/interaction
            if (mouse.x !== null && mouse.y !== null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let dist = Math.hypot(dx, dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    const angle = Math.atan2(dy, dx);
                    this.x -= Math.cos(angle) * force * 2;
                    this.y -= Math.sin(angle) * force * 2;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color + this.alpha + ")";
            ctx.shadowBlur = 8;
            ctx.shadowColor = "rgba(56, 189, 248, 0.35)";
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    let particles = [];
    const particleCount = Math.min(Math.floor((width * height) / 16000), 75);

    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    initParticles();

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Draw connecting lines
        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {
                let dx = particles[a].x - particles[b].x;
                let dy = particles[a].y - particles[b].y;
                let dist = Math.hypot(dx, dy);

                if (dist < 130) {
                    let opacity = (1 - dist / 130) * 0.22;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.strokeStyle = `rgba(56, 189, 248, ${opacity})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
            particles[a].update();
            particles[a].draw();
        }

        requestAnimationFrame(animate);
    }

    animate();
}

/* ================= 3. Typewriter Effect ================= */

function initTypewriter() {
    const typingElement = document.getElementById("typing");
    if (!typingElement) return;

    const roles = [
        "Full Stack AI Engineer",
        "AI Systems & LLM Architect",
        "Machine Learning Specialist",
        "Python Automation Expert",
        "React & Node.js Developer",
        "Intelligent Product Builder"
    ];

    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typeSpeed = 80;

    function typeLoop() {
        const currentRole = roles[roleIdx];

        if (!isDeleting) {
            typingElement.textContent = currentRole.substring(0, charIdx + 1);
            charIdx++;

            if (charIdx === currentRole.length) {
                isDeleting = true;
                setTimeout(typeLoop, 2000);
                return;
            }
            typeSpeed = 70;
        } else {
            typingElement.textContent = currentRole.substring(0, charIdx - 1);
            charIdx--;

            if (charIdx === 0) {
                isDeleting = false;
                roleIdx = (roleIdx + 1) % roles.length;
                setTimeout(typeLoop, 400);
                return;
            }
            typeSpeed = 35;
        }

        setTimeout(typeLoop, typeSpeed);
    }

    typeLoop();
}

/* ================= 4. Interactive Custom Cursor ================= */

function initCustomCursor() {
    const cursor = document.getElementById("customCursor");
    const trail = document.getElementById("cursorTrail");
    if (!cursor || !trail) return;

    let mouseX = -100;
    let mouseY = -100;
    let trailX = -100;
    let trailY = -100;

    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = `${mouseX}px`;
        cursor.style.top = `${mouseY}px`;
    });

    // Smooth lerp for trail
    function renderTrail() {
        trailX += (mouseX - trailX) * 0.18;
        trailY += (mouseY - trailY) * 0.18;
        trail.style.left = `${trailX}px`;
        trail.style.top = `${trailY}px`;
        requestAnimationFrame(renderTrail);
    }
    renderTrail();

    // Hover expanders
    const interactiveElements = document.querySelectorAll("a, button, .card-spotlight, input, textarea");
    interactiveElements.forEach((el) => {
        el.addEventListener("mouseenter", () => {
            cursor.classList.add("hover-active");
            trail.classList.add("hover-active");
        });
        el.addEventListener("mouseleave", () => {
            cursor.classList.remove("hover-active");
            trail.classList.remove("hover-active");
        });
    });
}

/* ================= 5. Top Scroll Progress ================= */

function initScrollProgress() {
    const progressBar = document.getElementById("progressBar");
    if (!progressBar) return;

    window.addEventListener("scroll", () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        progressBar.style.width = `${progress}%`;
    }, { passive: true });
}

/* ================= 6. Navigation & Mobile Drawer ================= */

function initNavigation() {
    const header = document.getElementById("mainHeader");
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("section[id]");
    const menuBtn = document.getElementById("menuBtn");
    const drawer = document.getElementById("mobileDrawer");
    const drawerOverlay = document.getElementById("drawerOverlay");
    const drawerCloseBtn = document.getElementById("drawerCloseBtn");
    const drawerLinks = document.querySelectorAll(".drawer-link");

    // Header elevation on scroll
    window.addEventListener("scroll", () => {
        if (window.scrollY > 40) {
            header?.classList.add("scrolled");
        } else {
            header?.classList.remove("scrolled");
        }

        // Active link detection
        let currentSectionId = "";
        sections.forEach((sec) => {
            const sectionTop = sec.offsetTop - 180;
            const sectionHeight = sec.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = sec.getAttribute("id");
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${currentSectionId}`) {
                link.classList.add("active");
            }
        });
    }, { passive: true });

    // Drawer Open/Close
    function openDrawer() {
        drawer?.classList.add("open");
        drawerOverlay?.classList.add("open");
        document.body.style.overflow = "hidden";
    }

    function closeDrawer() {
        drawer?.classList.remove("open");
        drawerOverlay?.classList.remove("open");
        document.body.style.overflow = "";
    }

    menuBtn?.addEventListener("click", openDrawer);
    drawerCloseBtn?.addEventListener("click", closeDrawer);
    drawerOverlay?.addEventListener("click", closeDrawer);
    drawerLinks.forEach((link) => link.addEventListener("click", closeDrawer));
}

/* ================= 7. Card Mouse Spotlight Highlight ================= */

function initCardSpotlights() {
    const cards = document.querySelectorAll(".card-spotlight");

    cards.forEach((card) => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
        });
    });
}

/* ================= 8. 3D Hologram Tilt on Hero Card ================= */

function initHologramTilt() {
    const card = document.getElementById("hologramCard");
    if (!card) return;

    const heroVisual = document.querySelector(".hero-visual");
    if (!heroVisual) return;

    heroVisual.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) / (rect.width / 2);
        const deltaY = (e.clientY - centerY) / (rect.height / 2);

        const rotateX = -deltaY * 12;
        const rotateY = deltaX * 12;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(10px)`;
    });

    heroVisual.addEventListener("mouseleave", () => {
        card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
    });
}

/* ================= 9. Animated Statistics Counter ================= */

function initAnimatedStats() {
    const statsSection = document.getElementById("stats");
    if (!statsSection) return;

    let hasAnimated = false;
    const statElements = document.querySelectorAll(".stat-number-wrap h2[data-target]");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                statElements.forEach((el) => {
                    const target = Number.parseInt(el.dataset.target, 10);
                    if (Number.isNaN(target)) return;

                    let current = 0;
                    const duration = 1600;
                    const stepTime = 25;
                    const increment = target / (duration / stepTime);

                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            el.textContent = `${target}+`;
                            if (target === 100) el.textContent = "100%";
                            clearInterval(timer);
                        } else {
                            el.textContent = `${Math.floor(current)}+`;
                            if (target === 100) el.textContent = `${Math.floor(current)}%`;
                        }
                    }, stepTime);
                });
            }
        });
    }, { threshold: 0.3 });

    observer.observe(statsSection);
}

/* ================= 10. Copy Email & Toast ================= */

function initCopyEmail() {
    const copyBtn = document.getElementById("copyEmailBtn");
    const copyBadge = document.getElementById("copyBadge");
    const toast = document.getElementById("toastNotification");
    if (!copyBtn) return;

    copyBtn.addEventListener("click", async () => {
        const email = copyBtn.dataset.email || "emaanfatimaa2121@gmail.com";
        try {
            await navigator.clipboard.writeText(email);
            if (copyBadge) copyBadge.textContent = "Copied!";
            if (toast) {
                toast.classList.add("show");
                setTimeout(() => {
                    toast.classList.remove("show");
                    if (copyBadge) copyBadge.textContent = "Copy";
                }, 3000);
            }
        } catch (err) {
            // Fallback to opening mail client if Clipboard API fails or permission is denied
            console.warn("Failed to copy email to clipboard, falling back to mailto:", err);
            window.location.href = `mailto:${email}`;
        }
    });
}

/* ================= 11. Staggered Scroll Reveals ================= */

function initScrollReveals() {
    const elementsToReveal = document.querySelectorAll(
        "section .section-header, .glass, .skill-card, .project-card, .pillar-card, .stat-card, .timeline-item"
    );

    elementsToReveal.forEach((el) => {
        el.classList.add("reveal-on-scroll");
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px"
    });

    elementsToReveal.forEach((el) => revealObserver.observe(el));
}

/* ================= 12. Floating Back to Top Button ================= */

function initBackToTop() {
    const btn = document.createElement("button");
    btn.id = "backToTopBtn";
    btn.setAttribute("aria-label", "Scroll back to top");
    btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>`;

    Object.assign(btn.style, {
        position: "fixed",
        right: "28px",
        bottom: "28px",
        width: "48px",
        height: "48px",
        borderRadius: "50%",
        border: "1px solid rgba(0, 240, 255, 0.35)",
        background: "rgba(10, 16, 33, 0.85)",
        color: "#00f0ff",
        cursor: "pointer",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: "9990",
        backdropFilter: "blur(16px)",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5), 0 0 15px rgba(0, 240, 255, 0.2)",
        opacity: "0",
        visibility: "hidden",
        transform: "translateY(20px)",
        transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)"
    });

    document.body.appendChild(btn);

    window.addEventListener("scroll", () => {
        if (window.scrollY > 400) {
            btn.style.opacity = "1";
            btn.style.visibility = "visible";
            btn.style.transform = "translateY(0)";
        } else {
            btn.style.opacity = "0";
            btn.style.visibility = "hidden";
            btn.style.transform = "translateY(20px)";
        }
    }, { passive: true });

    btn.addEventListener("mouseenter", () => {
        btn.style.background = "linear-gradient(135deg, #00f0ff, #6366f1)";
        btn.style.color = "#030712";
        btn.style.transform = "translateY(-4px)";
    });

    btn.addEventListener("mouseleave", () => {
        btn.style.background = "rgba(10, 16, 33, 0.85)";
        btn.style.color = "#00f0ff";
        btn.style.transform = "translateY(0)";
    });

    btn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

/* ================= 13. Developer Console Branding ================= */

function logConsoleBranding() {
    console.clear();
    console.log(
        "%cEMAN FATIMA // FULL STACK AI ENGINEER",
        "font-size: 16px; font-weight: bold; color: #00f0ff; background: #060913; padding: 8px 14px; border: 1px solid #00f0ff; border-radius: 6px;"
    );
    console.log(
        "%c⚡ Specializing in AI, LLMs, Machine Learning, Python Automation & Modern Full Stack Architecture.",
        "font-size: 12px; color: #94a3b8; margin: 6px 0;"
    );
    console.log(
        "%cPortfolio loaded successfully. Ready for innovative collaborations 🚀",
        "font-size: 12px; color: #10b981;"
    );
}