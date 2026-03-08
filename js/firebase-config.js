// ═══════════════════════════════════════════════════════════════════
// Eventify — Firebase Configuration
// Shared Firebase init for all pages. Loaded via CDN ES modules.
// ═══════════════════════════════════════════════════════════════════
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-analytics.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDb6HpSRD3hqH-lp94hPlnhPwZRTuyqoSU",
    authDomain: "gen-lang-client-0364461362.firebaseapp.com",
    projectId: "gen-lang-client-0364461362",
    storageBucket: "gen-lang-client-0364461362.firebasestorage.app",
    messagingSenderId: "47146892364",
    appId: "1:47146892364:web:639196a02afe87feba08e9",
    measurementId: "G-JERK1C71NE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Export for use in other modules
export { app, analytics, auth, db, onAuthStateChanged };
