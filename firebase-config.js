// ═══════════════════════════════════════════════════════════════
// FIREBASE CONFIG — paste your own project's keys here.
// Get these from: Firebase Console → Project Settings → General →
// "Your apps" → Web app → SDK setup and configuration → Config
// ═══════════════════════════════════════════════════════════════
const firebaseConfig = {
  apiKey: "AIzaSyAFZs38p-UVx3g6INuR-zBZew6o8m330FU",
  authDomain: "beam-design-with-calculation.firebaseapp.com",
  projectId: "beam-design-with-calculation",
  storageBucket: "beam-design-with-calculation.firebasestorage.app",
  messagingSenderId: "809342723812",
  appId: "1:809342723812:web:61f5884cb00a69d9816ef1"
};

// ── App-level settings you can tune ──
const ADMIN_EMAIL = "mohittyagi3032mt@gmail.com";
const FREE_TRIAL_USES = 3;
const RAZORPAY_KEY_ID = "rzp_test_TIopl8H5MLjfrc"; // kept for reference; not used by Payment Links flow
const PAYMENT_LINKS = {
  oneDayTrial: "PASTE_DAILY_LIVE_LINK_HERE",
  monthly: "https://rzp.io/rzp/vfoUcn75",
  yearly: "https://rzp.io/rzp/ChJUd4Sm"
};
const UPI_ID = "8979463032@ptsbi";
const SUPPORT_WHATSAPP = "919354115166"; // country code + number, no + or spaces (used for wa.me link)
const PLAN_PRICES = {
  oneDayTrial: { amount: 100, label: "1-Day Trial (one-time only)", days: 1 },  // amount in paise (₹1)
  monthly: { amount: 29900, label: "Monthly", days: 30 },   // amount in paise (₹299)
  yearly:  { amount: 299900, label: "Yearly", days: 365 }   // amount in paise (₹2999)
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
