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
    lang_label: "Language",
    pw_title: "🔒 FREE TRIAL OVER", pw_sub: "You have used {n} free calculations.\nSubscribe to continue using.",
    pw_trial_used: "✓ 1-Day Trial already used (one-time only)",
    pw_try_day: "TRY 1 DAY — ₹1 (one-time only)",
    pw_monthly: "MONTHLY — ₹299/month", pw_yearly: "YEARLY — ₹2999/year",
    pw_afterpay: "After payment, send your", pw_email_word: "email", pw_and: "and", pw_screenshot_word: "payment screenshot", pw_via_whatsapp: "on WhatsApp:",
    pw_activate_note: "Access will be activated shortly (after admin verifies).",
    pw_or_upi: "Or pay directly via UPI:",
    logout: "Logout",
    tb_help: "❓ Help", tb_feedback: "💬 Feedback", tb_share: "📤 Share", tb_install: "⬇ Install App",
    tb_admin: "⚙ Admin Panel", tb_subscribe: "💳 Subscribe",
    tb_subscribed: "SUBSCRIBED", tb_admin_tag: "ADMIN", tb_uses_left: "free use(s) left",
    verify_title: "EMAIL NOT VERIFIED YET", verify_resend: "Resend Verification Email", verify_done: "✓ I've Verified — Refresh",
    phone_required_label: "Phone Number", phone_required_star: "*",
    verify_box_msg: "⚠️ Your email is not verified yet.", verify_box_msg2: "Check the verification link sent during signup (inbox/spam).",
    resend_btn: "Resend Verification Email"
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
    lang_label: "भाषा",
    pw_title: "🔒 फ्री ट्रायल खत्म", pw_sub: "आपने {n} फ्री कैलकुलेशन इस्तेमाल कर लिए हैं।\nआगे इस्तेमाल के लिए सब्सक्राइब करें।",
    pw_trial_used: "✓ 1-दिन का ट्रायल पहले इस्तेमाल हो चुका है (सिर्फ एक बार)",
    pw_try_day: "1 दिन आज़माएं — ₹1 (सिर्फ एक बार)",
    pw_monthly: "मासिक — ₹299/माह", pw_yearly: "वार्षिक — ₹2999/साल",
    pw_afterpay: "पेमेंट के बाद अपना", pw_email_word: "ईमेल", pw_and: "और", pw_screenshot_word: "पेमेंट स्क्रीनशॉट", pw_via_whatsapp: "व्हाट्सएप पर भेजें:",
    pw_activate_note: "थोड़ी देर में (एडमिन वेरिफाई करने के बाद) एक्सेस मिल जाएगा।",
    pw_or_upi: "या सीधे UPI से भी भेज सकते हैं:",
    logout: "लॉग आउट",
    tb_help: "❓ मदद", tb_feedback: "💬 फीडबैक", tb_share: "📤 शेयर", tb_install: "⬇ ऐप इंस्टॉल करें",
    tb_admin: "⚙ एडमिन पैनल", tb_subscribe: "💳 सब्सक्राइब करें",
    tb_subscribed: "सब्सक्राइब्ड", tb_admin_tag: "एडमिन", tb_uses_left: "फ्री उपयोग बचे",
    verify_title: "ईमेल अभी वेरीफाई नहीं हुआ", verify_resend: "वेरिफिकेशन ईमेल दोबारा भेजें", verify_done: "✓ मैंने वेरीफाई कर लिया — रिफ्रेश करें",
    phone_required_label: "फ़ोन नंबर", phone_required_star: "*",
    verify_box_msg: "⚠️ आपका ईमेल अभी वेरीफाई नहीं हुआ है।", verify_box_msg2: "साइनअप के समय भेजा गया वेरिफिकेशन लिंक चेक करें (इनबॉक्स/स्पैम)।",
    resend_btn: "वेरिफिकेशन ईमेल दोबारा भेजें"
  }
};

function getLang(){ return localStorage.getItem("appLang") || "en"; }
function setLang(l){ localStorage.setItem("appLang", l); applyLang(); if(typeof onLangChange==="function")onLangChange(); }
function t(key,vars){
  const dict = TRANSLATIONS[getLang()] || TRANSLATIONS.en;
  let str = dict[key] !== undefined ? dict[key] : (TRANSLATIONS.en[key] || key);
  if(vars) Object.keys(vars).forEach(k=>{ str = str.replace("{"+k+"}", vars[k]); });
  return str;
}
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
