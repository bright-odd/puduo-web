// Case study interactions: sticky tabs, smooth scroll, reveal on scroll
document.addEventListener('DOMContentLoaded', function () {
    const tabs = Array.from(document.querySelectorAll('.case-tab'));
    const subnav = document.getElementById('caseSubnav');
    const subnavWrap = document.querySelector('.case-subnav-wrap');
    const nav = document.querySelector('.navbar');
    const sections = Array.from(document.querySelectorAll('main section[id]'));

    if (!subnav) return;

    let subnavTop = subnavWrap.getBoundingClientRect().top + window.scrollY;

    function recalc() {
        subnavTop = subnavWrap.getBoundingClientRect().top + window.scrollY;
        // if subnav is sticky (for example after a resize), keep wrapper height to avoid layout jump
        if (subnav.classList.contains('sticky')) {
            subnavWrap.style.height = subnav.offsetHeight + 'px';
        }
    }

    function onScroll() {
        const navH = nav ? nav.offsetHeight : 0;
        if (window.scrollY + navH + 6 >= subnavTop) {
            // when becoming sticky, set wrapper height to preserve layout (avoid jump)
            if (!subnav.classList.contains('sticky')) {
                subnavWrap.style.height = subnav.offsetHeight + 'px';
            }
            subnav.classList.add('sticky');
        } else {
            if (subnav.classList.contains('sticky')) {
                subnav.classList.remove('sticky');
                subnavWrap.style.height = 'auto';
            }
        }
        updateActiveTab();
    }

    function updateActiveTab() {
        const navH = nav ? nav.offsetHeight : 0;
        const extra = subnav.offsetHeight + 12;
        let current = sections[0] ? sections[0].id : null;
        sections.forEach(sec => {
            const rect = sec.getBoundingClientRect();
            if (rect.top - (navH + extra) <= 0) current = sec.id;
        });
        tabs.forEach(t => t.classList.toggle('active', t.dataset.target === current));
    }

    // Smooth scrolling with offset (accounts for navbar + subnav)
    tabs.forEach(tab => {
        tab.addEventListener('click', function (e) {
            e.preventDefault();
            const id = this.dataset.target;
            const el = document.getElementById(id);
            if (!el) return;
            const navH = nav ? nav.offsetHeight : 0;
            const extra = subnav.offsetHeight;
            const top = el.getBoundingClientRect().top + window.scrollY - navH - extra - 12;
            window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
        });
    });

    // helper to expose editable icon slots: swaps emoji placeholders if using data-icon with svg later
    const iconPlaceholders = document.querySelectorAll('.tech-list .icon');
    iconPlaceholders.forEach(sp => {
        const name = sp.dataset.icon;
        // here you could swap to inline SVG based on `name`; keep emoji by default
        // Example: if you ship SVGs in images/icons/<name>.svg you could fetch and insert them.
    });

    // IntersectionObserver for reveal animations
    const reveals = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    reveals.forEach(r => io.observe(r));

    // Recalc offsets on resize
    window.addEventListener('resize', () => {
        recalc();
        updateActiveTab();
    });
    window.addEventListener('scroll', onScroll, { passive: true });

    // initial run
    recalc();
    onScroll();
});
