// ═══════════════════════════════════════════════════════════════════
// Eventify — Mouse-tracking Glowing Border Effect for Cards
// Usage: Add class "glow-card" to any card element.
// ═══════════════════════════════════════════════════════════════════
(function () {
    // Auto-disable on touch devices (no hover = no pointermove tracking needed)
    const isTouchDevice = window.matchMedia('(hover: none)').matches;

    // Settings
    const SPREAD = 60;   // degrees of visible arc
    const PROXIMITY = 80;   // px — activation distance outside card
    const BLUR = 4;    // px
    const BORDER_W = 2;    // px
    const COLORS = [
        'rgba(221,123,187,0.9)',
        'rgba(215,159,30,0.85)',
        'rgba(90,146,44,0.85)',
        'rgba(76,120,148,0.85)',
    ];

    function injectStyles() {
        if (document.getElementById('glow-card-styles')) return;
        const style = document.createElement('style');
        style.id = 'glow-card-styles';
        style.textContent = `
      .glow-card {
        --glow-angle: 0deg;
        --glow-opacity: 0;
        position: relative;
      }
      .glow-card .glow-border {
        pointer-events: none;
        position: absolute;
        inset: -${BORDER_W}px;
        border-radius: inherit;
        opacity: var(--glow-opacity);
        transition: opacity 0.3s ease;
        filter: blur(${BLUR}px);
        z-index: 1;
        background: conic-gradient(
          from var(--glow-angle),
          transparent 0deg,
          ${COLORS[0]}  0deg,
          ${COLORS[1]}  ${SPREAD * 0.33}deg,
          ${COLORS[2]}  ${SPREAD * 0.66}deg,
          ${COLORS[3]}  ${SPREAD}deg,
          transparent    ${SPREAD}deg
        );
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        padding: ${BORDER_W}px;
      }
      .glow-card .glow-border-solid {
        pointer-events: none;
        position: absolute;
        inset: -${BORDER_W}px;
        border-radius: inherit;
        opacity: var(--glow-opacity);
        transition: opacity 0.3s ease;
        z-index: 0;
        background: conic-gradient(
          from var(--glow-angle),
          transparent 0deg,
          ${COLORS[0]}  0deg,
          ${COLORS[1]}  ${SPREAD * 0.33}deg,
          ${COLORS[2]}  ${SPREAD * 0.66}deg,
          ${COLORS[3]}  ${SPREAD}deg,
          transparent    ${SPREAD}deg
        );
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        padding: ${BORDER_W}px;
      }
    `;
        document.head.appendChild(style);
    }

    function initGlowCards() {
        injectStyles();
        const cards = document.querySelectorAll('.glow-card');
        cards.forEach((card) => {
            // Don't double-init
            if (card.querySelector('.glow-border')) return;

            // Glow layers
            const glowBlur = document.createElement('div');
            glowBlur.className = 'glow-border';
            const glowSolid = document.createElement('div');
            glowSolid.className = 'glow-border-solid';

            card.appendChild(glowSolid);
            card.appendChild(glowBlur);
        });

        // Global pointermove listener (efficient: one listener, many cards)
        // Skip on touch devices — no hover = no glow tracking needed
        if (!isTouchDevice) {
            document.addEventListener('pointermove', (e) => {
                cards.forEach((card) => {
                    const rect = card.getBoundingClientRect();
                    const cx = rect.left + rect.width / 2;
                    const cy = rect.top + rect.height / 2;
                    const mouseX = e.clientX;
                    const mouseY = e.clientY;

                    const isNear = (
                        mouseX > rect.left - PROXIMITY &&
                        mouseX < rect.right + PROXIMITY &&
                        mouseY > rect.top - PROXIMITY &&
                        mouseY < rect.bottom + PROXIMITY
                    );

                    if (isNear) {
                        const angle = Math.atan2(mouseY - cy, mouseX - cx) * (180 / Math.PI) + 90;
                        card.style.setProperty('--glow-angle', `${angle}deg`);
                        card.style.setProperty('--glow-opacity', '1');
                    } else {
                        card.style.setProperty('--glow-opacity', '0');
                    }
                });
            });
        }
    }

    // Run when DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGlowCards);
    } else {
        initGlowCards();
    }

    // Expose for dynamic re-init
    window.initGlowCards = initGlowCards;
})();
