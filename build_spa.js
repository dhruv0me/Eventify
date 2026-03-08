const fs = require('fs');

const index = fs.readFileSync('index.html', 'utf8');
const auth = fs.readFileSync('auth.html', 'utf8');
const events = fs.readFileSync('events.html', 'utf8');
const dashboard = fs.readFileSync('dashboard.html', 'utf8');
const admin = fs.readFileSync('admin.html', 'utf8');

function getStyles(html) {
    const match = html.match(/<style>([\s\S]*?)<\/style>/);
    return match ? match[1] : '';
}

const allStyles = getStyles(index) + '\n' + getStyles(auth) + '\n' + getStyles(events) + '\n' + getStyles(dashboard) + '\n' + getStyles(admin);

function getBodyContent(html) {
    const navEndPattern = '</nav>';
    const navEndIdx = html.indexOf(navEndPattern);
    if (navEndIdx === -1) return '';
    const startIdx = navEndIdx + navEndPattern.length;

    let footerIdx = html.indexOf('<footer', startIdx);
    if (footerIdx === -1) footerIdx = html.indexOf('<!-- Footer -->', startIdx);
    let scriptIdx = html.indexOf('<script', startIdx);

    let endIdx = html.length;
    if (footerIdx !== -1 && scriptIdx !== -1) endIdx = Math.min(footerIdx, scriptIdx);
    else if (footerIdx !== -1) endIdx = footerIdx;
    else if (scriptIdx !== -1) endIdx = scriptIdx;

    return html.substring(startIdx, endIdx).trim();
}

const bHome = getBodyContent(index);
const bAuth = getBodyContent(auth);
const bEvents = getBodyContent(events);
const bDashboard = getBodyContent(dashboard);
const bAdmin = getBodyContent(admin);

let merged = index;
merged = merged.replace(/<style>([\s\S]*?)<\/style>/, '<style>\n        .page-view { display: none; opacity: 0; transition: opacity 0.3s ease; }\n        .page-view.active { display: block; opacity: 1; }\n' + allStyles + '\n    </style>');

const viewsHtml = `\n<div id="app-views">\n<section id="view-home" class="page-view active">\n${bHome}\n</section>\n<section id="view-auth" class="page-view">\n${bAuth}\n</section>\n<section id="view-events" class="page-view">\n${bEvents}\n</section>\n<section id="view-dashboard" class="page-view">\n${bDashboard}\n</section>\n<section id="view-admin" class="page-view">\n${bAdmin}\n</section>\n</div>\n`;

const beforeNav = index.substring(0, index.indexOf('</nav>') + 6);
let footerIdx = index.indexOf('<footer');
if (footerIdx === -1) footerIdx = index.indexOf('<!-- Footer -->');
if (footerIdx === -1) footerIdx = index.indexOf('<script');
const afterViews = index.substring(footerIdx);

merged = beforeNav + viewsHtml + afterViews;

fs.writeFileSync('index.html', merged);
console.log("Merged pages into index.html successfully");
