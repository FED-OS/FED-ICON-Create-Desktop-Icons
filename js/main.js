/* ═══════════════════════════════════════════════════════════════
   ICONVERSE — Interactive Features
   ═══════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    /* ─── Theme Toggle (persist in localStorage) ─── */
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const savedTheme = localStorage.getItem('iconverse-theme') || 'dark';

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        if (themeIcon) {
            themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
        }
        const label = document.getElementById('themeLabel');
        if (label) label.textContent = theme === 'light' ? 'Dark' : 'Light';
    }
    applyTheme(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            const current = document.documentElement.getAttribute('data-theme') || 'dark';
            const next = current === 'dark' ? 'light' : 'dark';
            applyTheme(next);
            localStorage.setItem('iconverse-theme', next);
        });
    }

    /* ─── Icon Set Search / Filter ─── */
    const searchInput = document.getElementById('iconSearch');
    const cards = document.querySelectorAll('#iconSets .card');
    const noResults = document.getElementById('noResults');

    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const query = this.value.trim().toLowerCase();
            let visible = 0;
            cards.forEach(function (card) {
                const text = card.textContent.toLowerCase();
                if (text.includes(query)) {
                    card.classList.remove('hidden');
                    visible++;
                } else {
                    card.classList.add('hidden');
                }
            });
            if (noResults) {
                noResults.classList.toggle('show', visible === 0);
            }
        });
    }

    /* ─── Preview Area Light/Dark Toggle ─── */
    const previewToggle = document.getElementById('previewToggle');
    const previewArea = document.getElementById('previewArea');
    if (previewToggle && previewArea) {
        previewToggle.addEventListener('click', function () {
            previewArea.classList.toggle('light-preview');
            const isLight = previewArea.classList.contains('light-preview');
            previewToggle.innerHTML = isLight ? '🌙 Dark Surface' : '☀️ Light Surface';
        });
    }

    /* ─── Copy Hex on Swatch Click ─── */
    document.querySelectorAll('.swatch').forEach(function (swatch) {
        swatch.addEventListener('click', function () {
            const hex = this.getAttribute('data-hex') || this.style.background;
            if (navigator.clipboard && hex) {
                navigator.clipboard.writeText(hex).then(function () {
                    console.log('Copied: ' + hex);
                });
            }
        });
    });

    /* ─── Scroll Reveal (IntersectionObserver) ─── */
    const revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
        revealEls.forEach(function (el) { io.observe(el); });
    } else {
        revealEls.forEach(function (el) { el.classList.add('visible'); });
    }

    /* ─── Back to Top Button ─── */
    const backBtn = document.getElementById('backToTop');
    if (backBtn) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 600) {
                backBtn.classList.add('show');
            } else {
                backBtn.classList.remove('show');
            }
        });
        backBtn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ─── Active Nav Highlight on Scroll ─── */
    const navLinks = document.querySelectorAll('.navbar-links a[href^="#"]');
    const sections = [];
    navLinks.forEach(function (link) {
        const id = link.getAttribute('href').slice(1);
        const sec = document.getElementById(id);
        if (sec) sections.push({ link: link, el: sec });
    });
    if ('IntersectionObserver' in window && sections.length) {
        const navIO = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    navLinks.forEach(function (l) { l.style.color = ''; });
                    const match = sections.find(function (s) { return s.el === entry.target; });
                    if (match) match.link.style.color = 'var(--accent)';
                }
            });
        }, { threshold: 0.3, rootMargin: '-80px 0px -60% 0px' });
        sections.forEach(function (s) { navIO.observe(s.el); });
    }

    console.log('🎯 Iconverse loaded — go build epic icons!');
})();
