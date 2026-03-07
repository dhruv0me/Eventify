// Eventify Core Logic
const API_URL = 'http://127.0.0.1:5000/api';

const App = {
    user: null,

    init() {
        this.loadUser();
        this.updateNavbar();
        this.initLucide();
    },

    loadUser() {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                this.user = JSON.parse(storedUser);
            } catch (e) {
                console.error('Failed to parse user', e);
                localStorage.removeItem('user');
            }
        }
    },

    updateNavbar() {
        const authContainer = document.getElementById('auth-nav');
        if (!authContainer) return;

        if (this.user) {
            authContainer.innerHTML = `
                ${this.user.role === 'admin' ? '<a href="admin.html" class="btn btn-outline" style="margin-right: 0.5rem;">Admin Panel</a>' : ''}
                <a href="dashboard.html" class="btn btn-hero">My Dashboard</a>
            `;
        } else {
            authContainer.innerHTML = `
                <a href="auth.html" class="btn btn-hero">Sign In</a>
            `;
        }
    },

    initLucide() {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    },

    logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
