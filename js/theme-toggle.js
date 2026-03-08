// ═══════════════════════════════════════════════════════════════════
// Eventify — Theme Toggle (Dark / Light)
// Persists choice in localStorage. Adds/removes .light-mode on body.
// Usage: call injectThemeToggle(containerSelector) or add manually.
// ═══════════════════════════════════════════════════════════════════
(function () {
    const STORAGE_KEY = 'eventify-theme';

    // SVG icons
    const moonSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
    const sunSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;

    function isDark() {
        return !document.body.classList.contains('light-mode');
    }

    function applyTheme(dark) {
        if (dark) {
            document.body.classList.remove('light-mode');
        } else {
            document.body.classList.add('light-mode');
        }
        localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
    }

    function init() {
        // Restore saved preference
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === 'light') {
            document.body.classList.add('light-mode');
        }

        // Build toggles
        document.querySelectorAll('.theme-toggle').forEach((toggle) => {
            if (toggle.dataset.init) return;
            toggle.dataset.init = 'true';

            // Knob with active icon
            const knob = document.createElement('div');
            knob.className = 'toggle-knob';
            knob.innerHTML = isDark() ? moonSVG : sunSVG;

            // Inactive icon
            const inactive = document.createElement('div');
            inactive.className = 'icon-inactive';
            inactive.innerHTML = isDark() ? sunSVG : moonSVG;

            toggle.appendChild(knob);
            toggle.appendChild(inactive);

            toggle.addEventListener('click', () => {
                const dark = !isDark();
                applyTheme(dark);

                // Update icons
                knob.innerHTML = dark ? moonSVG : sunSVG;
                inactive.innerHTML = dark ? sunSVG : moonSVG;
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.initThemeToggle = init;
})();
