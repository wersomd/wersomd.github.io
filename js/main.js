"use strict";

/* ============================================================
   wersomd — interactions
   ============================================================ */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.addEventListener("DOMContentLoaded", () => {
    initYear();
    initHeaderScroll();
    initMobileMenu();
    initSmoothScroll();
    initReveal();
    initCounters();
    initActiveNav();
    initTypewriter();
    initMagnetic();
    initForm();
    if (!reduceMotion) initNetwork();
});

/* ---------- current year ---------- */
function initYear() {
    const el = document.getElementById("year");
    if (el) el.textContent = new Date().getFullYear();
}

/* ---------- header background on scroll ---------- */
function initHeaderScroll() {
    const header = document.getElementById("header");
    if (!header) return;
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
}

/* ---------- mobile burger menu ---------- */
function initMobileMenu() {
    const burger = document.getElementById("burger");
    const nav = document.getElementById("nav");
    if (!burger || !nav) return;

    const close = () => {
        burger.classList.remove("active");
        nav.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
    };

    burger.addEventListener("click", () => {
        const open = nav.classList.toggle("open");
        burger.classList.toggle("active", open);
        burger.setAttribute("aria-expanded", String(open));
    });

    nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
}

/* ---------- smooth anchor scroll ---------- */
function initSmoothScroll() {
    const header = document.getElementById("header");
    document.querySelectorAll("[data-goto]").forEach((link) => {
        link.addEventListener("click", (e) => {
            const target = document.querySelector(link.getAttribute("data-goto"));
            if (!target) return;
            e.preventDefault();
            const offset = (header ? header.offsetHeight : 0) + 10;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
        });
    });
}

/* ---------- reveal on scroll ---------- */
function initReveal() {
    const els = document.querySelectorAll(".reveal");
    if (reduceMotion || !("IntersectionObserver" in window)) {
        els.forEach((el) => el.classList.add("in"));
        return;
    }
    const io = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    const siblings = [...entry.target.parentElement.children].indexOf(entry.target);
                    entry.target.style.transitionDelay = `${Math.min(siblings, 6) * 60}ms`;
                    entry.target.classList.add("in");
                    io.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((el) => io.observe(el));
}

/* ---------- animated counters ---------- */
function initCounters() {
    const nums = document.querySelectorAll(".stat-num[data-count]");
    if (!nums.length) return;

    const run = (el) => {
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || "";
        if (reduceMotion) {
            el.textContent = target + suffix;
            return;
        }
        const dur = 1400;
        const start = performance.now();
        const tick = (now) => {
            const p = Math.min((now - start) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * eased) + suffix;
            if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    };

    if (!("IntersectionObserver" in window)) {
        nums.forEach(run);
        return;
    }
    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                run(entry.target);
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.6 });
    nums.forEach((el) => io.observe(el));
}

/* ---------- active nav link on scroll ---------- */
function initActiveNav() {
    const links = document.querySelectorAll(".nav-link[data-goto]");
    const map = new Map();
    links.forEach((l) => {
        const sec = document.querySelector(l.getAttribute("data-goto"));
        if (sec) map.set(sec, l);
    });
    if (!map.size || !("IntersectionObserver" in window)) return;

    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                links.forEach((l) => l.classList.remove("active"));
                const link = map.get(entry.target);
                if (link) link.classList.add("active");
            }
        });
    }, { rootMargin: "-45% 0px -50% 0px" });
    map.forEach((_, sec) => io.observe(sec));
}

/* ---------- typewriter cycling through services ---------- */
function initTypewriter() {
    const el = document.getElementById("typewriter");
    if (!el) return;
    const words = [
        "Сайты и интернет-магазины",
        "amoCRM · Bitrix24",
        "Wazzup · ChatApp",
        "Binotel · Sipuni",
        "Flatris — шахматка",
    ];

    if (reduceMotion) {
        el.textContent = words[0];
        return;
    }

    let wi = 0, ci = 0, deleting = false;
    const tick = () => {
        const word = words[wi];
        ci += deleting ? -1 : 1;
        el.textContent = word.slice(0, ci);

        let delay = deleting ? 40 : 75;
        if (!deleting && ci === word.length) {
            delay = 1600;
            deleting = true;
        } else if (deleting && ci === 0) {
            deleting = false;
            wi = (wi + 1) % words.length;
            delay = 350;
        }
        setTimeout(tick, delay);
    };
    tick();
}

/* ---------- magnetic buttons ---------- */
function initMagnetic() {
    if (reduceMotion || window.matchMedia("(hover: none)").matches) return;
    document.querySelectorAll(".magnetic").forEach((btn) => {
        btn.addEventListener("mousemove", (e) => {
            const r = btn.getBoundingClientRect();
            const x = e.clientX - r.left - r.width / 2;
            const y = e.clientY - r.top - r.height / 2;
            btn.style.transform = `translate(${x * 0.18}px, ${y * 0.28}px)`;
        });
        btn.addEventListener("mouseleave", () => {
            btn.style.transform = "";
        });
    });
}

/* ---------- lead form (wediff endpoint + WhatsApp fallback) ---------- */
function initForm() {
    const form = document.getElementById("lead-form");
    const note = document.getElementById("form-note");
    if (!form || !note) return;

    const LEADS_ENDPOINT = "https://wediff.vercel.app/api/leads";
    const LEADS_TOKEN = ""; // опционально: должен совпадать с LEADS_INBOUND_TOKEN в wediff
    const formLoadedAt = Date.now(); // тайминг-ловушка: мгновенный сабмит = бот

    const setNote = (msg, ok) => {
        note.textContent = msg;
        note.className = "form-note " + (ok ? "ok" : "err");
    };

    const toWhatsApp = (name, contact, message) => {
        const text = encodeURIComponent(
            `Заявка с сайта\nИмя: ${name}\nКонтакт: ${contact}\nЗадача: ${message || "—"}`
        );
        window.open(`https://wa.me/77070171318?text=${text}`, "_blank", "noopener");
    };

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const data = new FormData(form);
        const name = (data.get("name") || "").toString().trim();
        const contact = (data.get("contact") || "").toString().trim();
        const message = (data.get("message") || "").toString().trim();
        const website = (data.get("website") || "").toString();

        if (!name || !contact) {
            setNote("Заполните имя и контакт.", false);
            return;
        }

        try {
            setNote("Отправляем…", true);
            const res = await fetch(LEADS_ENDPOINT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(LEADS_TOKEN ? { "x-lead-token": LEADS_TOKEN } : {}),
                },
                body: JSON.stringify({ name, contact, message, website, elapsed: Date.now() - formLoadedAt, source: "wersomd.github.io" }),
            });
            if (res.ok) {
                setNote("Заявка отправлена. Скоро свяжемся!", true);
                form.reset();
            } else {
                setNote("Не удалось отправить — открываем WhatsApp.", false);
                toWhatsApp(name, contact, message);
            }
        } catch {
            setNote("Нет связи — открываем WhatsApp.", false);
            toWhatsApp(name, contact, message);
        }
    });
}

/* ============================================================
   SIGNATURE: connected-nodes network (data flowing between
   systems) — the metaphor for "мы соединяем ваши системы".
   ============================================================ */
function initNetwork() {
    const canvas = document.getElementById("bg-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w, h, dpr, nodes, pulses;
    const mouse = { x: -9999, y: -9999 };

    const CFG = {
        density: 14000, // px² per node
        maxNodes: 90,
        linkDist: 150,
        speed: 0.25,
    };

    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = canvas.clientWidth;
        h = canvas.clientHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        build();
    }

    function build() {
        const count = Math.min(Math.floor((w * h) / CFG.density), CFG.maxNodes);
        nodes = Array.from({ length: count }, () => ({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * CFG.speed,
            vy: (Math.random() - 0.5) * CFG.speed,
            r: Math.random() * 1.6 + 0.8,
        }));
        pulses = [];
    }

    function spawnPulse() {
        if (!nodes || nodes.length < 2) return;
        const a = nodes[(Math.random() * nodes.length) | 0];
        // find a nearby node to travel to
        let b = null, best = CFG.linkDist;
        for (const n of nodes) {
            if (n === a) continue;
            const d = Math.hypot(n.x - a.x, n.y - a.y);
            if (d < best) { best = d; b = n; }
        }
        if (b) pulses.push({ a, b, t: 0, speed: 0.012 + Math.random() * 0.02 });
    }

    let pulseTimer = 0;

    function frame() {
        ctx.clearRect(0, 0, w, h);

        // move nodes
        for (const n of nodes) {
            n.x += n.vx;
            n.y += n.vy;
            if (n.x < 0 || n.x > w) n.vx *= -1;
            if (n.y < 0 || n.y > h) n.vy *= -1;

            // subtle cursor attraction
            const dx = mouse.x - n.x, dy = mouse.y - n.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 160) {
                n.x += (dx / dist) * 0.4;
                n.y += (dy / dist) * 0.4;
            }
        }

        // links
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const a = nodes[i], b = nodes[j];
                const d = Math.hypot(a.x - b.x, a.y - b.y);
                if (d < CFG.linkDist) {
                    const alpha = (1 - d / CFG.linkDist) * 0.5;
                    ctx.strokeStyle = `rgba(0, 229, 255, ${alpha * 0.5})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }
        }

        // nodes
        for (const n of nodes) {
            ctx.fillStyle = "rgba(0, 229, 255, 0.65)";
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
            ctx.fill();
        }

        // data pulses
        pulseTimer++;
        if (pulseTimer > 22) { spawnPulse(); pulseTimer = 0; }
        for (let i = pulses.length - 1; i >= 0; i--) {
            const p = pulses[i];
            p.t += p.speed;
            if (p.t >= 1) { pulses.splice(i, 1); continue; }
            const x = p.a.x + (p.b.x - p.a.x) * p.t;
            const y = p.a.y + (p.b.y - p.a.y) * p.t;
            ctx.fillStyle = "rgba(255, 45, 149, 0.9)";
            ctx.shadowColor = "rgba(255, 45, 149, 0.9)";
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }

        requestAnimationFrame(frame);
    }

    window.addEventListener("mousemove", (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    window.addEventListener("mouseleave", () => {
        mouse.x = -9999;
        mouse.y = -9999;
    });
    window.addEventListener("resize", resize);

    resize();
    frame();
}
