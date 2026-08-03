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
  oneDayTrial: "pay-daily.html",
  monthly: "pay-monthly.html",
  yearly: "pay-yearly.html"
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
const googleProvider = new firebase.auth.GoogleAuthProvider();

// Shared helper: create the Firestore profile doc for a user if it doesn't
// already exist yet (used by both email/password signup and Google sign-in).
async function ensureUserDoc(user, extra){
  const ref = db.collection("users").doc(user.uid);
  const snap = await ref.get();
  if(!snap.exists){
    await ref.set(Object.assign({
      email: user.email,
      phone: null,
      phoneVerified: false,
      usageCount: 0,
      plan: "trial",
      subscriptionExpiry: null,
      dailyTrialUsed: false,
      isAdmin: (user.email||"").toLowerCase()===ADMIN_EMAIL.toLowerCase(),
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    }, extra||{}));
  }
  return ref;
}
