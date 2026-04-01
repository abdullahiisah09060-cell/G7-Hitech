import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyBppL-pz1Y6PwK1UJo0WoWM6NvP5fRpx4k",
  authDomain: "g7-hitech.firebaseapp.com",
  projectId: "g7-hitech",
  storageBucket: "g7-hitech.firebasestorage.app",
  messagingSenderId: "389500703345",
  appId: "1:389500703345:web:7d1a2cd7bf59a6cca801d0"
};

// INITIALIZE
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// PAYSTACK KEY
const PAYSTACK_PUBLIC_KEY = "pk_test_b8bb68c38267daf7ff58e6c82ec8b499a38c0255";

// LOGIN LOGIC
const googleLoginBtn = document.getElementById('googleLogin');
if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', () => {
        signInWithPopup(auth, provider).then(async (result) => {
            const user = result.user;
            await createUserProfile(user);
            window.location.href = "dashboard.html"; // Make sure to create this file next!
        });
    });
}

// CREATE USER PROFILE IN FIRESTORE
async function createUserProfile(user) {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        await setDoc(userRef, {
            name: user.displayName,
            email: user.email,
            walletBalance: 0,
            virtualAccount: "Generating...", // This updates via Paystack Webhook
            userType: "Client",
            joinedAt: new Date()
        });
    }
}

// TRACKING LOGIC (For clients to check repair status)
window.checkRepairStatus = async (jobId) => {
    const jobRef = doc(db, "repairs", jobId);
    const jobSnap = await getDoc(jobRef);
    if (jobSnap.exists()) {
        alert("Status: " + jobSnap.data().status);
    } else {
        alert("Job ID not found. Contact G7 Admin.");
    }
}

// AUTH STATE CHECKER
onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('authBtn').innerText = "DASHBOARD";
        document.getElementById('authBtn').onclick = () => window.location.href = "dashboard.html";
    }
});
