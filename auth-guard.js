// ═══════════════════════════════════════════════════════════════
// AUTH GUARD — blocks the calculator until logged in, and enforces
// the free-trial (3 uses) + paid subscription (monthly/yearly) gate.
// ═══════════════════════════════════════════════════════════════

window.deferredInstallPrompt=null;
window.addEventListener("beforeinstallprompt",(e)=>{
  e.preventDefault();
  window.deferredInstallPrompt=e;
});

let CURRENT_UID=null, CURRENT_USER_DATA=null;

function ov(html){document.getElementById("auth-overlay").innerHTML=html;document.getElementById("auth-overlay").style.display="flex";}
function hideOverlay(){document.getElementById("auth-overlay").style.display="none";}

function isSubscriptionActive(d){
  if(!d)return false;
  if(!d.subscriptionExpiry)return false;
  const expiryMs=d.subscriptionExpiry.toMillis?d.subscriptionExpiry.toMillis():new Date(d.subscriptionExpiry).getTime();
  return (d.plan==="oneDayTrial"||d.plan==="monthly"||d.plan==="yearly") && expiryMs>Date.now();
}

function showPaywall(dailyTrialUsed){
  const dailyBtn = dailyTrialUsed
    ? `<div style="width:100%;padding:11px;background:#1e293b;border:1px solid #334155;border-radius:6px;color:#64748b;font-size:11px;margin-bottom:8px;box-sizing:border-box">✓ 1-Day Trial already used (one-time only)</div>`
    : `<a href="${PAYMENT_LINKS.oneDayTrial}" target="_blank" style="display:block;width:100%;padding:11px;background:#a78bfa;border:none;border-radius:6px;color:#000;font-weight:bold;font-family:'Courier New',monospace;font-size:12px;cursor:pointer;margin-bottom:8px;text-decoration:none;box-sizing:border-box">TRY 1 DAY — ₹1 (one-time only)</a>`;
  ov(`
    <div style="max-width:380px;background:#111827;border:1px solid #1e3050;border-radius:10px;padding:26px;text-align:center">
      <div style="font-size:16px;color:#f59e0b;letter-spacing:2px;margin-bottom:6px">🔒 FREE TRIAL KHATAM</div>
      <div style="font-size:11px;color:#94a3b8;margin-bottom:18px;line-height:1.6">
        Aapne ${FREE_TRIAL_USES} free calculations use kar liye hain.<br>
        Aage use karne ke liye subscribe karo.
      </div>

      ${dailyBtn}
      <a href="${PAYMENT_LINKS.monthly}" target="_blank" style="display:block;width:100%;padding:11px;background:#38bdf8;border:none;border-radius:6px;color:#000;font-weight:bold;font-family:'Courier New',monospace;font-size:12px;cursor:pointer;margin-bottom:8px;text-decoration:none;box-sizing:border-box">
        MONTHLY — ₹299/month
      </a>
      <a href="${PAYMENT_LINKS.yearly}" target="_blank" style="display:block;width:100%;padding:11px;background:#f59e0b;border:none;border-radius:6px;color:#000;font-weight:bold;font-family:'Courier New',monospace;font-size:12px;cursor:pointer;text-decoration:none;box-sizing:border-box;margin-bottom:16px">
        YEARLY — ₹2999/year
      </a>

      <div style="font-size:9px;color:#64748b;line-height:1.6;border-top:1px solid #1e3050;padding-top:12px">
        Payment ke baad apna <b style="color:#94a3b8">email</b> aur <b style="color:#94a3b8">payment screenshot</b> WhatsApp par bhejo:<br>
        <a href="https://wa.me/${SUPPORT_WHATSAPP}" target="_blank" style="color:#38bdf8;text-decoration:none">WhatsApp: +91 ${SUPPORT_WHATSAPP.slice(2)}</a><br>
        Access thodi der mein (admin verify karke) activate ho jayega.
      </div>

      <div style="font-size:9px;color:#64748b;margin-top:10px">
        Ya seedha UPI se bhi bhej sakte ho: <span style="color:#22c55e;font-weight:bold;user-select:all">${UPI_ID}</span>
      </div>

      <div style="font-size:10px;color:#64748b;margin-top:16px">
        <a href="#" onclick="auth.signOut().then(()=>location.href='login.html');return false;" style="color:#64748b">Logout</a>
      </div>
    </div>
  `);
}

function showLoading(text){
  ov(`<div style="color:#38bdf8;font-size:13px;letter-spacing:2px">${text}</div>`);
}

function injectTopBar(email,usesLeft,isActive,isAdmin){
  let bar=document.getElementById("account-bar");
  if(!bar){
    bar=document.createElement("div");
    bar.id="account-bar";
    bar.style.cssText="display:flex;justify-content:center;align-items:center;gap:14px;padding:6px;font-size:10px;color:#94a3b8;border-bottom:1px solid #1e3050;margin-bottom:8px;flex-wrap:wrap";
    document.body.insertBefore(bar,document.body.firstChild.nextSibling);
  }
  const statusTxt=isAdmin?`<span style="color:#c4b5fd">ADMIN</span>`
    :isActive?`<span style="color:#22c55e">SUBSCRIBED</span>`
    :`<span style="color:#f59e0b">${usesLeft} free use${usesLeft===1?"":"s"} left</span>`;
  bar.innerHTML=`👤 ${email} &nbsp;·&nbsp; ${statusTxt} &nbsp;·&nbsp;
    <a href="help.html" style="color:#38bdf8;text-decoration:none">❓ Help</a> &nbsp;·&nbsp;
    <a href="feedback.html" style="color:#38bdf8;text-decoration:none">💬 Feedback</a> &nbsp;·&nbsp;
    <button id="installBtn" style="background:#052e16;border:1px solid #22c55e;color:#6ee7b7;padding:3px 10px;border-radius:12px;font-size:9px;cursor:pointer;font-family:'Courier New',monospace">⬇ Install App</button> &nbsp;·&nbsp;
    ${isAdmin?`<a href="admin.html" style="color:#38bdf8;text-decoration:none">Admin Panel</a> &nbsp;·&nbsp;`:""}
    <a href="#" id="logoutLink" style="color:#ef4444;text-decoration:none">Logout</a>`;
  document.getElementById("logoutLink").onclick=(e)=>{e.preventDefault();auth.signOut().then(()=>location.href="login.html");};
  document.getElementById("installBtn").onclick=()=>{
    if(window.deferredInstallPrompt){
      window.deferredInstallPrompt.prompt();
    }else{
      alert("Is browser mein automatic install available nahi hai.\n\nAndroid Chrome: top-right menu (⋮) → 'Add to Home screen'\niPhone Safari: Share button (□↑) → 'Add to Home Screen'");
    }
  };
}

async function refreshUserDataAndGate(){
  await ensureUserDoc(auth.currentUser);
  const docRef=db.collection("users").doc(CURRENT_UID);
  const snap=await docRef.get();
  const d=snap.data();
  CURRENT_USER_DATA=d;
  const active=isSubscriptionActive(d);
  const usesLeft=Math.max(0,FREE_TRIAL_USES-(d.usageCount||0));
  injectTopBar(d.email,usesLeft,active,d.isAdmin);
  if(d.isAdmin||active||usesLeft>0){
    hideOverlay();
  }else{
    showPaywall(!!d.dailyTrialUsed);
  }
  return{active,usesLeft,isAdmin:d.isAdmin};
}

async function consumeOneUse(){
  if(!CURRENT_UID)return false;
  const status=await refreshUserDataAndGate();
  if(status.isAdmin||status.active)return true; // unlimited, don't touch counter
  if(status.usesLeft<=0){showPaywall(!!CURRENT_USER_DATA?.dailyTrialUsed);return false;}
  await db.collection("users").doc(CURRENT_UID).update({usageCount:firebase.firestore.FieldValue.increment(1)});
  await refreshUserDataAndGate();
  return true;
}

// NOTE: automatic in-app checkout (startPayment) was removed — Razorpay now
// requires an order_id created server-side for standard checkout, which
// needs a backend (e.g. Firebase Cloud Functions on the Blaze plan). Until
// that's set up, the paywall links out to Razorpay Payment Links instead,
// and the admin grants access manually from admin.html after payment.

// ── Boot sequence ──
showLoading("CHECKING LOGIN...");
auth.onAuthStateChanged(async user=>{
  if(!user){window.location.href="signup.html";return;}
  CURRENT_UID=user.uid;
  showLoading("LOADING ACCOUNT...");
  await refreshUserDataAndGate();

  // Gate the main "CALCULATE ALL CHECKS" button — each explicit click
  // consumes one trial use (subscribed/admin users are unaffected).
  const calcBtn=document.querySelector(".btn-calc");
  if(calcBtn){
    calcBtn.onclick=async function(){
      const ok=await consumeOneUse();
      if(ok && typeof updateAll==="function")updateAll();
    };
  }
});
