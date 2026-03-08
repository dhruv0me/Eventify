import { auth, db, onAuthStateChanged } from './firebase-config.js';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";
import {
    collection, getDocs, doc, setDoc, getDoc,
    query, where, addDoc, updateDoc, deleteDoc
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

const App = {
    user: null,

    init() {
        this.initLucide();
        window.addEventListener('hashchange', () => this.handleRoute(window.location.hash));

        // Listen for Firebase Auth state
        onAuthStateChanged(auth, async (userObj) => {
            if (userObj) {
                try {
                    const docSnap = await getDoc(doc(db, 'users', userObj.uid));
                    if (docSnap.exists()) {
                        this.user = { uid: userObj.uid, ...docSnap.data() };
                    } else {
                        // Fallback
                        this.user = { uid: userObj.uid, email: userObj.email, full_name: userObj.displayName || 'User', role: 'user' };
                    }
                } catch (e) {
                    console.error("Error fetching user role", e);
                }
            } else {
                this.user = null;
            }
            this.updateNavbar();
            this.handleRoute(window.location.hash || '#home');
        });

        // Initial route if not already handled by auth state
        if (!window.location.hash) {
            this.handleRoute('#home');
        }
    },

    handleRoute(hash) {
        if (!hash || hash === '') hash = '#home';
        const viewId = 'view-' + hash.replace('#', '');

        document.querySelectorAll('.page-view').forEach(v => {
            v.classList.remove('active');
            v.style.display = 'none';
        });

        const target = document.getElementById(viewId);
        if (target) {
            target.style.display = 'block';
            // Slight delay for animation
            setTimeout(() => target.classList.add('active'), 10);
        } else {
            // Fallback
            document.getElementById('view-home').style.display = 'block';
            setTimeout(() => document.getElementById('view-home').classList.add('active'), 10);
        }

        // Initialize view logic
        if (hash === '#events') EventsPage.init();
        if (hash === '#dashboard') Dashboard.init();
        if (hash === '#admin') Admin.init();

        // Re-init lucide icons for the new view
        this.initLucide();
        if (window.initGlowCards) window.initGlowCards();
    },

    updateNavbar() {
        // Find ALL auth-nav containers (since we merged multiple navbars, there might be duplicate IDs or we just use the first)
        const authContainers = document.querySelectorAll('#auth-nav');
        authContainers.forEach(container => {
            if (this.user) {
                container.innerHTML = `
                    ${this.user.role === 'admin' ? '<a href="#admin" class="btn btn-outline btn-sm" style="margin-right: 0.5rem;">Admin Panel</a>' : ''}
                    <a href="#dashboard" class="btn btn-hero btn-sm">My Dashboard</a>
                `;
            } else {
                container.innerHTML = `
                    <a href="#auth" class="btn btn-hero btn-sm">Sign In</a>
                `;
            }
        });

        // Fix navbar links to use hash routing
        document.querySelectorAll('a').forEach(a => {
            const href = a.getAttribute('href');
            if (href === 'index.html' || href === 'index.html#') a.setAttribute('href', '#home');
            if (href === 'events.html') a.setAttribute('href', '#events');
            if (href === 'auth.html') a.setAttribute('href', '#auth');
            if (href === 'dashboard.html') a.setAttribute('href', '#dashboard');
            if (href === 'admin.html') a.setAttribute('href', '#admin');
        });
    },

    initLucide() {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    },

    async logout() {
        await signOut(auth);
        window.location.hash = '#home';
    }
};

// ==========================================
// Auth Controller
// ==========================================
const Auth = {
    mode: 'login',
    setMode(mode) {
        this.mode = mode;
        document.getElementById('login-tab').classList.toggle('active', mode === 'login');
        document.getElementById('register-tab').classList.toggle('active', mode === 'register');
        document.getElementById('name-group').style.display = mode === 'register' ? 'block' : 'none';
        document.getElementById('auth-title').innerText = mode === 'login' ? 'Sign In' : 'Create Account';
        document.getElementById('submit-btn').innerText = mode === 'login' ? 'Sign In' : 'Sign Up';
    },
    async handleSubmit(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const name = document.getElementById('name').value;
        const errorEl = document.getElementById('error-msg');
        const btn = document.getElementById('submit-btn');

        errorEl.style.display = 'none';
        btn.disabled = true;
        btn.innerText = 'Processing...';

        try {
            if (this.mode === 'login') {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                const cred = await createUserWithEmailAndPassword(auth, email, password);
                await setDoc(doc(db, 'users', cred.user.uid), {
                    email: email,
                    full_name: name,
                    role: 'user',
                    created_at: new Date().toISOString()
                });
            }
            window.location.hash = '#dashboard';
        } catch (err) {
            errorEl.innerText = err.message;
            errorEl.style.display = 'block';
        } finally {
            btn.disabled = false;
            btn.innerText = this.mode === 'login' ? 'Sign In' : 'Sign Up';
        }
    }
};

// ==========================================
// Events Page Controller
// ==========================================
const EventsPage = {
    events: [],
    selectedEventId: null,
    async init() {
        try {
            const q = query(collection(db, 'events'));
            const snapshot = await getDocs(q);
            this.events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            this.renderEvents();
        } catch (err) {
            console.error('Failed to load events', err);
            document.getElementById('events-list').innerHTML = '<div class="text-center" style="grid-column:1/-1;">Failed to load events from Firebase. Check console.</div>';
        }
    },
    renderEvents() {
        const list = document.getElementById('events-list');
        list.innerHTML = this.events.filter(e => e.is_visible !== false).map(event => `
            <div class="card glow-card">
                <div class="flex items-center justify-between" style="margin-bottom:1rem;">
                    <h3 style="font-size:1.25rem;">${event.title}</h3>
                    <span class="badge badge-primary">${event.category}</span>
                </div>
                <p class="text-sm text-muted" style="margin-bottom:1.5rem;">${event.description}</p>
                <div style="margin-bottom:1.5rem;">
                    <div class="event-detail"><i data-lucide="calendar"></i><span>${event.date}</span></div>
                    <div class="event-detail"><i data-lucide="clock"></i><span>${event.time}</span></div>
                    <div class="event-detail"><i data-lucide="map-pin"></i><span>${event.location}</span></div>
                    <div class="event-detail"><i data-lucide="users"></i><span>Team Size: ${event.teamSize || 'Solo'}</span></div>
                </div>
                <div class="flex items-center justify-between" style="padding-top:1rem;border-top:1px solid var(--border);">
                    <span class="badge badge-success">${event.status}</span>
                    <button class="btn btn-sm" onclick="EventsPage.handleRegister('${event.id}', '${event.category}')">
                        ${event.category === 'Concert' ? 'Get Pass' : 'Register Now'}
                    </button>
                </div>
            </div>
        `).join('');
        App.initLucide();
    },
    handleRegister(eventId, category) {
        if (!App.user) { window.location.hash = '#auth'; return; }
        this.selectedEventId = eventId;
        if (category === 'Concert') {
            this.confirmRegistration('');
        } else {
            document.getElementById('reg-modal').style.display = 'flex';
        }
    },
    closeModal() {
        document.getElementById('reg-modal').style.display = 'none';
        document.getElementById('reg-error').style.display = 'none';
    },
    async confirmRegistration() {
        const teamName = document.getElementById('team-name').value;
        const errorEl = document.getElementById('reg-error');

        try {
            await addDoc(collection(db, 'registrations'), {
                user_id: App.user.uid,
                event_id: this.selectedEventId,
                team_name: teamName || null,
                score: 0,
                registered_at: new Date().toISOString()
            });
            alert('Successfully registered!');
            this.closeModal();
            window.location.hash = '#dashboard';
        } catch (err) {
            errorEl.innerText = err.message;
            errorEl.style.display = 'block';
        }
    }
};

// ==========================================
// Dashboard Controller
// ==========================================
const Dashboard = {
    registrations: [],
    async init() {
        if (!App.user) { window.location.hash = '#auth'; return; }
        document.getElementById('greeting').innerText = `Welcome back, ${(App.user.full_name || 'User').split(' ')[0]}`;
        document.getElementById('profile-name').innerText = App.user.full_name || 'User';
        document.getElementById('profile-email').innerText = App.user.email;
        await this.fetchRegistrations();
    },
    async fetchRegistrations() {
        const list = document.getElementById('registrations-list');
        try {
            const q = query(collection(db, 'registrations'), where('user_id', '==', App.user.uid));
            const snapshot = await getDocs(q);

            // Also fetch event details for each registration
            this.registrations = [];
            for (let docSnap of snapshot.docs) {
                const regData = { registration_id: docSnap.id, ...docSnap.data() };
                const evSnap = await getDoc(doc(db, 'events', regData.event_id));
                if (evSnap.exists()) {
                    regData.event_title = evSnap.data().title;
                } else {
                    regData.event_title = 'Unknown Event';
                }
                this.registrations.push(regData);
            }

            this.renderRegistrations();
            this.updateStats();
        } catch (err) {
            console.error('Failed to load registrations', err);
            list.innerHTML = '<p class="text-muted">Error loading registrations.</p>';
        }
    },
    renderRegistrations() {
        const list = document.getElementById('registrations-list');
        if (this.registrations.length === 0) {
            list.innerHTML = '<p class="text-muted">No registrations found. Discover events <a href="#events" style="color:var(--foreground);">here</a>.</p>';
            return;
        }
        list.innerHTML = this.registrations.map(reg => `
            <div class="card registration-card">
                <div class="flex flex-col gap-1">
                    <h4 style="font-size:1.125rem;">${reg.event_title}</h4>
                    <div class="flex items-center gap-2 text-sm text-muted">
                        <i data-lucide="tag" style="width:14px;height:14px;"></i>
                        <span>${reg.team_name || 'Solo Entry'}</span>
                    </div>
                </div>
                <div class="flex flex-col items-end gap-2">
                    <span class="badge badge-primary">Score: ${reg.score || 0}</span>
                </div>
            </div>
        `).join('');
        App.initLucide();
    },
    updateStats() {
        document.getElementById('stat-registered').innerText = this.registrations.length;
        const totalScore = this.registrations.reduce((acc, reg) => acc + (reg.score || 0), 0);
        const avgScore = this.registrations.length > 0 ? (totalScore / this.registrations.length).toFixed(1) : 'N/A';
        document.getElementById('stat-score').innerText = avgScore;
    }
};

// ==========================================
// Admin Controller
// ==========================================
const Admin = {
    registrations: [],
    events: [],

    async init() {
        if (!App.user || App.user.role !== 'admin') {
            window.location.hash = '#home';
            return;
        }
        await this.loadRegistrations();
        await this.loadEvents();
    },

    setTab(tab, btnEl) {
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
        document.getElementById(`${tab}-tab`).classList.add('active');
        btnEl.classList.add('active');

        if (tab === 'registrations') this.loadRegistrations();
        if (tab === 'events') this.loadEvents();
    },

    updateStats() {
        const uniqueUsers = new Set(this.registrations.map(r => r.user_id)).size;
        document.getElementById('stat-total-regs').textContent = this.registrations.length;
        document.getElementById('stat-unique-users').textContent = uniqueUsers;
    },

    updateEventStats(events) {
        const visible = events.filter(e => e.is_visible !== false).length;
        document.getElementById('stat-total-events').textContent = events.length;
        document.getElementById('stat-visible-events').textContent = visible;
    },

    async loadEvents() {
        try {
            const snapshot = await getDocs(collection(db, 'events'));
            this.events = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            this.renderEvents(this.events);
            this.updateEventStats(this.events);
        } catch (err) {
            this.toast('Failed to load events', 'error');
        }
    },

    renderEvents(events) {
        const list = document.getElementById('admin-events-list');
        if (!events || events.length === 0) {
            list.innerHTML = '<p class="text-muted">No events yet.</p>';
            return;
        }
        list.innerHTML = events.map(ev => `
            <div class="card event-admin-card" style="margin-bottom:1rem;display:flex;justify-content:space-between;">
                <div>
                    <h4 style="font-size:1.1rem;margin:0;">${ev.title}</h4>
                    <span class="text-xs text-muted">${ev.category} • ${ev.date}</span>
                </div>
                <div class="flex items-center gap-2">
                    <button class="btn btn-danger btn-sm" onclick="Admin.deleteEvent('${ev.id}')">Delete</button>
                    ${ev.is_visible === false ?
                `<button class="btn btn-outline btn-sm" onclick="Admin.toggleVisibility('${ev.id}', true)">Show</button>` :
                `<button class="btn btn-outline btn-sm" onclick="Admin.toggleVisibility('${ev.id}', false)">Hide</button>`
            }
                </div>
            </div>
        `).join('');
    },

    async toggleVisibility(eventId, isVisible) {
        try {
            await updateDoc(doc(db, 'events', eventId), { is_visible: isVisible });
            this.toast('Visibility updated!');
            this.loadEvents();
        } catch (err) {
            this.toast('Failed to update visibility', 'error');
        }
    },

    async deleteEvent(eventId) {
        if (!confirm('Permanently delete this event?')) return;
        try {
            await deleteDoc(doc(db, 'events', eventId));
            this.toast('Event deleted');
            this.loadEvents();
        } catch (err) {
            this.toast('Failed to delete event', 'error');
        }
    },

    openCreateEventModal() {
        document.getElementById('event-form').reset();
        document.getElementById('event-modal').style.display = 'flex';
    },

    closeEventModal(e) {
        if (e && e.target !== document.getElementById('event-modal')) return;
        document.getElementById('event-modal').style.display = 'none';
    },

    async createEvent(e) {
        e.preventDefault();
        const payload = {
            title: document.getElementById('ev-title').value,
            category: document.getElementById('ev-category').value,
            status: document.getElementById('ev-status').value,
            description: document.getElementById('ev-desc').value,
            date: document.getElementById('ev-date').value,
            time: document.getElementById('ev-time').value,
            location: document.getElementById('ev-loc').value,
            teamSize: document.getElementById('ev-teamsize').value,
            prizePool: document.getElementById('ev-prize').value,
            is_visible: true
        };

        try {
            await addDoc(collection(db, 'events'), payload);
            this.toast('Event created successfully!');
            document.getElementById('event-modal').style.display = 'none';
            this.loadEvents();
        } catch (err) {
            this.toast(err.message, 'error');
        }
    },

    async loadRegistrations() {
        try {
            const snapshot = await getDocs(collection(db, 'registrations'));
            this.registrations = [];
            for (let docSnap of snapshot.docs) {
                const reg = { registration_id: docSnap.id, ...docSnap.data() };

                // Get event
                const evSnap = await getDoc(doc(db, 'events', reg.event_id));
                reg.event_title = evSnap.exists() ? evSnap.data().title : 'Unknown';

                // Get user
                const userSnap = await getDoc(doc(db, 'users', reg.user_id));
                reg.user = userSnap.exists() ? userSnap.data() : { name: 'Unknown', email: 'unknown' };

                this.registrations.push(reg);
            }
            this.renderRegistrations();
            this.updateStats();
        } catch (err) {
            this.toast('Failed to load registrations', 'error');
        }
    },

    renderRegistrations() {
        const body = document.getElementById('registrations-body');
        if (!this.registrations || this.registrations.length === 0) {
            body.innerHTML = `<tr><td colspan="6"><p>No registrations found.</p></td></tr>`;
            return;
        }

        body.innerHTML = this.registrations.map(reg => {
            const name = reg.user.full_name || reg.user.name || 'User';
            return `
            <tr>
                <td>
                    <div class="font-semibold" style="font-size:0.9rem;">${name}</div>
                    <div class="text-xs text-muted">${reg.user.email}</div>
                </td>
                <td><span style="font-weight:600;font-size:0.9rem;">${reg.event_title}</span></td>
                <td><span class="badge badge-primary">${reg.team_name || 'Solo'}</span></td>
                <td><span class="text-muted">—</span></td>
                <td>
                    <input type="number" class="score-input" value="${reg.score || 0}" id="score-${reg.registration_id}" min="0" max="9999" style="background:#111;border:1px solid #333;color:white;width:60px;padding:4px;border-radius:4px;">
                </td>
                <td style="text-align:right;">
                    <button class="btn btn-hero btn-sm" onclick="Admin.updateScore('${reg.registration_id}')">Save</button>
                </td>
            </tr>`;
        }).join('');
    },

    async updateScore(regId) {
        const score = document.getElementById(`score-${regId}`).value;
        try {
            await updateDoc(doc(db, 'registrations', regId), { score: parseInt(score) });
            this.toast('Score saved!');
            this.loadRegistrations();
        } catch (err) {
            this.toast(err.message, 'error');
        }
    },

    toast(message, type = 'success') {
        const el = document.getElementById('toast');
        if (!el) return;
        const icon = type === 'success' ? 'check-circle' : 'x-circle';
        el.className = `show ${type}`;
        el.innerHTML = `<i data-lucide="${icon}" style="width:18px;height:18px;"></i> ${message}`;
        App.initLucide();
        clearTimeout(Admin._toastTimer);
        Admin._toastTimer = setTimeout(() => { el.className = ''; }, 3000);
    }
};

// Expose to window for inline HTML event handlers
window.App = App;
window.Auth = Auth;
window.EventsPage = EventsPage;
window.Dashboard = Dashboard;
window.Admin = Admin;

document.addEventListener('DOMContentLoaded', () => App.init());
