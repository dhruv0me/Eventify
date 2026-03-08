// ═══════════════════════════════════════════════════════════════════
// Eventify — SVG Pulse Beams for Register / Login buttons
// Usage: Add class "pulse-beam-wrap" to a wrapper div around a button.
// ═══════════════════════════════════════════════════════════════════
(function () {
    const isMobile = window.innerWidth < 768;

    const BEAM_CONFIG = [
        {
            path: 'M160 110 H8 C4 110 2 112 2 116 V200',
            duration: 2400,
            delay: 0,
        },
        {
            path: 'M270 100 H420 C424 100 426 98 426 94 V20',
            duration: 2400,
            delay: 800,
        },
        {
            path: 'M160 130 H320 C324 130 326 132 326 136 V200',
            duration: 2000,
            delay: 1200,
        },
    ];

    const GRADIENT_COLORS = ['#18CCFC', '#6344F5', '#AE48FF'];

    function injectStyles() {
        if (document.getElementById('pulse-beam-styles')) return;
        const style = document.createElement('style');
        style.id = 'pulse-beam-styles';
        style.textContent = `
      .pulse-beam-wrap {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }
      .pulse-beam-wrap > .pulse-beam-svg {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
      }
      .pulse-beam-wrap > *:not(.pulse-beam-svg) {
        position: relative;
        z-index: 1;
      }
    `;
        document.head.appendChild(style);
    }

    function buildSVG(width, height) {
        const ns = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(ns, 'svg');
        svg.setAttribute('class', 'pulse-beam-svg');
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
        svg.setAttribute('fill', 'none');
        svg.setAttribute('preserveAspectRatio', 'none');

        const defs = document.createElementNS(ns, 'defs');

        BEAM_CONFIG.forEach((beam, i) => {
            // Static base path
            const basePath = document.createElementNS(ns, 'path');
            basePath.setAttribute('d', beam.path);
            basePath.setAttribute('stroke', 'rgba(100,100,140,0.2)');
            basePath.setAttribute('stroke-width', '1');
            svg.appendChild(basePath);

            // Animated gradient path
            const gradId = `pb-grad-${i}-${Date.now()}`;
            const grad = document.createElementNS(ns, 'linearGradient');
            grad.setAttribute('id', gradId);
            grad.setAttribute('gradientUnits', 'userSpaceOnUse');

            const stop1 = document.createElementNS(ns, 'stop');
            stop1.setAttribute('offset', '0%');
            stop1.setAttribute('stop-color', GRADIENT_COLORS[0]);
            stop1.setAttribute('stop-opacity', '0');

            const stop2 = document.createElementNS(ns, 'stop');
            stop2.setAttribute('offset', '50%');
            stop2.setAttribute('stop-color', GRADIENT_COLORS[1]);
            stop2.setAttribute('stop-opacity', '1');

            const stop3 = document.createElementNS(ns, 'stop');
            stop3.setAttribute('offset', '100%');
            stop3.setAttribute('stop-color', GRADIENT_COLORS[2]);
            stop3.setAttribute('stop-opacity', '0');

            grad.appendChild(stop1);
            grad.appendChild(stop2);
            grad.appendChild(stop3);
            defs.appendChild(grad);

            const animPath = document.createElementNS(ns, 'path');
            animPath.setAttribute('d', beam.path);
            animPath.setAttribute('stroke', `url(#${gradId})`);
            animPath.setAttribute('stroke-width', '2');
            animPath.setAttribute('stroke-linecap', 'round');
            svg.appendChild(animPath);

            // Connection dots at start/end
            const pathEl = document.createElementNS(ns, 'path');
            pathEl.setAttribute('d', beam.path);
            svg.appendChild(pathEl);

            // Animate gradient positions along the path
            animateGradient(grad, pathEl, beam.duration, beam.delay);
        });

        svg.appendChild(defs);
        return svg;
    }

    function animateGradient(gradElement, pathElement, duration, delay) {
        // On mobile, skip the continuous animation to save CPU
        if (isMobile) return;

        const totalLen = pathElement.getTotalLength ? pathElement.getTotalLength() : 400;
        const windowSize = totalLen * 0.35;
        let start = null;

        function step(timestamp) {
            if (!start) start = timestamp;
            const elapsed = ((timestamp - start + delay) % (duration + 800));
            const progress = Math.max(0, Math.min(1, (elapsed - 200) / duration));
            const headDist = progress * (totalLen + windowSize);
            const tailDist = headDist - windowSize;

            try {
                const p1 = pathElement.getPointAtLength(Math.max(0, Math.min(tailDist, totalLen)));
                const p2 = pathElement.getPointAtLength(Math.max(0, Math.min(headDist, totalLen)));

                gradElement.setAttribute('x1', p1.x);
                gradElement.setAttribute('y1', p1.y);
                gradElement.setAttribute('x2', p2.x);
                gradElement.setAttribute('y2', p2.y);
            } catch (_) { /* path not in DOM yet */ }

            requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    function initPulseBeams() {
        injectStyles();
        const wraps = document.querySelectorAll('.pulse-beam-wrap');
        wraps.forEach((wrap) => {
            if (wrap.querySelector('.pulse-beam-svg')) return;
            const w = wrap.offsetWidth || 430;
            const h = wrap.offsetHeight || 220;
            const svg = buildSVG(430, 220);
            wrap.prepend(svg);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPulseBeams);
    } else {
        initPulseBeams();
    }

    window.initPulseBeams = initPulseBeams;
})();
