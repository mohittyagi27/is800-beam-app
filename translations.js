// ═══════════════════════════════════════════════════════════════
// TRANSLATIONS — covers login, signup, help, and paywall UI text.
// The main calculator (index.html) stays English-only.
// ═══════════════════════════════════════════════════════════════
const TRANSLATIONS = {
  en: {
    login_title: "LOG IN", login_sub: "IS 800 STEEL BEAM DESIGN TOOL",
    email_label: "Email", password_label: "Password",
    login_btn: "LOG IN", no_account: "No account?", signup_link: "Create an account",
    forgot: "Forgot password?", or: "— or —",
    google_btn: "Continue with Google",
    phone_login_btn: "Continue with Phone Number",
    have_account: "Already have an account?", login_link: "Log in",
    signup_title: "CREATE ACCOUNT", signup_sub: "IS 800 STEEL BEAM DESIGN TOOL",
    confirm_password_label: "Confirm Password",
    phone_label: "Phone Number (optional but recommended)",
    send_otp: "Send OTP", otp_label: "Enter OTP", verify_otp: "Verify OTP",
    phone_verified: "✓ Phone verified",
    signup_btn: "CREATE ACCOUNT — 3 FREE CALCULATIONS",
    success_title: "✅ ACCOUNT CREATED SUCCESSFULLY!",
    success_sub: "Ab apne email aur password se login karein.",
    go_login: "GO TO LOGIN",
    help_link: "How to use this app",
    lang_label: "Language"
  },
  hi: {
    login_title: "लॉग इन करें", login_sub: "IS 800 स्टील बीम डिज़ाइन टूल",
    email_label: "ईमेल", password_label: "पासवर्ड",
    login_btn: "लॉग इन करें", no_account: "अकाउंट नहीं है?", signup_link: "नया अकाउंट बनाएं",
    forgot: "पासवर्ड भूल गए?", or: "— या —",
    google_btn: "Google से जारी रखें",
    phone_login_btn: "फ़ोन नंबर से जारी रखें",
    have_account: "पहले से अकाउंट है?", login_link: "लॉग इन करें",
    signup_title: "अकाउंट बनाएं", signup_sub: "IS 800 स्टील बीम डिज़ाइन टूल",
    confirm_password_label: "पासवर्ड दोबारा डालें",
    phone_label: "फ़ोन नंबर (वैकल्पिक, लेकिन सुझाया गया)",
    send_otp: "OTP भेजें", otp_label: "OTP डालें", verify_otp: "OTP वेरीफाई करें",
    phone_verified: "✓ फ़ोन वेरीफाई हो गया",
    signup_btn: "अकाउंट बनाएं — 3 फ्री कैलकुलेशन",
    success_title: "✅ अकाउंट सफलतापूर्वक बन गया!",
    success_sub: "अब अपने ईमेल और पासवर्ड से लॉग इन करें।",
    go_login: "लॉग इन पर जाएं",
    help_link: "यह ऐप कैसे इस्तेमाल करें",
    lang_label: "भाषा"
  }
};

function getLang(){ return localStorage.getItem("appLang") || "en"; }
function setLang(l){ localStorage.setItem("appLang", l); applyLang(); }
function applyLang(){
  const lang = getLang();
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const key = el.getAttribute("data-i18n");
    if(dict[key]) el.textContent = dict[key];
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el=>{
    const key = el.getAttribute("data-i18n-placeholder");
    if(dict[key]) el.placeholder = dict[key];
  });
  document.querySelectorAll(".lang-switch").forEach(sel=>{ sel.value = lang; });
}
document.addEventListener("DOMContentLoaded", applyLang);
