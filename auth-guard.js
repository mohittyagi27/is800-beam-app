// ═══════════════════════════════════════════════════════════════
// AUTH GUARD — blocks the calculator until logged in (and email
// verified, for email/password accounts), and enforces the
// free-trial (3 uses) + paid subscription (monthly/yearly) gate.
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
    ? `<div style="width:100%;padding:11px;background:#1e293b;border:1px solid #334155;border-radius:6px;color:#64748b;font-size:11px;margin-bottom:8px;box-sizing:border-box">${t("pw_trial_used")}</div>`
    : `<a href="${PAYMENT_LINKS.oneDayTrial}" target="_blank" style="display:block;width:100%;padding:11px;background:#a78bfa;border:none;border-radius:6px;color:#000;font-weight:bold;font-family:'Courier New',monospace;font-size:12px;cursor:pointer;margin-bottom:8px;text-decoration:none;box-sizing:border-box">${t("pw_try_day")}</a>`;
  ov(`
    <div style="max-width:380px;background:#111827;border:1px solid #1e3050;border-radius:10px;padding:26px;text-align:center">
      <div style="font-size:16px;color:#f59e0b;letter-spacing:2px;margin-bottom:6px">${t("pw_title")}</div>
      <div style="font-size:11px;color:#94a3b8;margin-bottom:18px;line-height:1.6;white-space:pre-line">${t("pw_sub",{n:FREE_TRIAL_USES})}</div>

      ${dailyBtn}
      <a href="${PAYMENT_LINKS.monthly}" target="_blank" style="display:block;width:100%;padding:11px;background:#38bdf8;border:none;border-radius:6px;color:#000;font-weight:bold;font-family:'Courier New',monospace;font-size:12px;cursor:pointer;margin-bottom:8px;text-decoration:none;box-sizing:border-box">
        ${t("pw_monthly")}
      </a>
      <a href="${PAYMENT_LINKS.yearly}" target="_blank" style="display:block;width:100%;padding:11px;background:#f59e0b;border:none;border-radius:6px;color:#000;font-weight:bold;font-family:'Courier New',monospace;font-size:12px;cursor:pointer;text-decoration:none;box-sizing:border-box;margin-bottom:16px">
        ${t("pw_yearly")}
      </a>

      <div style="font-size:9px;color:#64748b;line-height:1.6;border-top:1px solid #1e3050;padding-top:12px">
        ${t("pw_afterpay")} <b style="color:#94a3b8">${t("pw_email_word")}</b> ${t("pw_and")} <b style="color:#94a3b8">${t("pw_screenshot_word")}</b> ${t("pw_via_whatsapp")}<br>
        <a href="https://wa.me/${SUPPORT_WHATSAPP}" target="_blank" style="color:#38bdf8;text-decoration:none">WhatsApp: +91 ${SUPPORT_WHATSAPP.slice(2)}</a><br>
        ${t("pw_activate_note")}
      </div>

      <div style="font-size:9px;color:#64748b;margin-top:10px">
        ${t("pw_or_upi")} <span style="color:#22c55e;font-weight:bold;user-select:all">${UPI_ID}</span>
      </div>

      <div style="font-size:10px;color:#64748b;margin-top:16px">
        <a href="#" onclick="auth.signOut().then(()=>location.href='login.html');return false;" style="color:#64748b">${t("logout")}</a>
      </div>
    </div>
  `);
}

function showLoading(text){
  ov(`<div style="color:#38bdf8;font-size:13px;letter-spacing:2px">${text}</div>`);
}

function showVerifyEmailScreen(user){
  ov(`
    <div style="max-width:380px;background:#111827;border:1px solid #1e3050;border-radius:10px;padding:26px;text-align:center">
      <div style="font-size:30px;margin-bottom:10px">📧</div>
      <div style="font-size:14px;color:#f59e0b;letter-spacing:1px;margin-bottom:10px">${t("verify_title")}</div>
      <div style="font-size:11px;color:#94a3b8;line-height:1.6;margin-bottom:16px">
        <b style="color:#e2e8f0">${user.email}</b> pe ek verification link bheja gaya tha.<br>
        Pehle wo link kholo (inbox/spam check karo), phir yahan wapas aakar refresh karo.
      </div>
      <button onclick="user.sendEmailVerification().then(()=>alert('Dobara bhej diya!'))" style="width:100%;padding:11px;background:#38bdf8;border:none;border-radius:6px;color:#000;font-weight:bold;font-family:'Courier New',monospace;font-size:12px;cursor:pointer;margin-bottom:8px">${t("verify_resend")}</button>
      <button onclick="location.reload()" style="width:100%;padding:11px;background:#22c55e;border:none;border-radius:6px;color:#000;font-weight:bold;font-family:'Courier New',monospace;font-size:12px;cursor:pointer">${t("verify_done")}</button>
      <div style="font-size:10px;color:#64748b;margin-top:16px">
        <a href="#" onclick="auth.signOut().then(()=>location.href='login.html');return false;" style="color:#64748b">${t("logout")}</a>
      </div>
    </div>
  `);
}

function shareApp(){
  const url="https://mohittyagi27.github.io/is800-beam-app/";
  const text="IS 800 Steel Beam Design Tool — free online beam/column design checker (IS 800:2007). Try it:";
  if(navigator.share){
    navigator.share({title:"IS 800 Beam Design Tool",text,url}).catch(()=>{});
  }else{
    const waUrl="https://wa.me/?text="+encodeURIComponent(text+" "+url);
    window.open(waUrl,"_blank");
  }
}

// All top-bar actions rendered as the same uniform pill-button style so
// they visually match (Help, Feedback, Share, Install, Admin, Logout).
function pillBtn(label,color,onclickAttr,hrefAttr){
  const tag = hrefAttr ? "a" : "button";
  const hrefPart = hrefAttr ? `href="${hrefAttr}"` : "";
  return `<${tag} ${hrefPart} onclick="${onclickAttr||""}" style="background:transparent;border:1px solid ${color};color:${color};padding:4px 11px;border-radius:14px;font-size:9.5px;cursor:pointer;font-family:'Courier New',monospace;text-decoration:none;display:inline-block">${label}</${tag}>`;
}

function injectTopBar(email,usesLeft,isActive,isAdmin,online){
  let bar=document.getElementById("account-bar");
  if(!bar){
    bar=document.createElement("div");
    bar.id="account-bar";
    bar.style.cssText="display:flex;justify-content:center;align-items:center;gap:8px;padding:8px;font-size:10px;color:#94a3b8;border-bottom:1px solid #1e3050;margin-bottom:8px;flex-wrap:wrap";
    document.body.insertBefore(bar,document.body.firstChild.nextSibling);
  }
  const statusTxt=isAdmin?`<span style="color:#c4b5fd">${t("tb_admin_tag")}</span>`
    :isActive?`<span style="color:#22c55e">${t("tb_subscribed")}</span>`
    :`<span style="color:#f59e0b">${usesLeft} ${t("tb_uses_left")}</span>`;
  bar.innerHTML=`
    <span><span style="color:#22c55e">●</span> ${email}</span>
    <span>${statusTxt}</span>
    ${isActive||isAdmin?"":`<button id="subscribeBtn" style="background:#052e16;border:1px solid #22c55e;color:#6ee7b7;padding:4px 11px;border-radius:14px;font-size:9.5px;cursor:pointer;font-family:'Courier New',monospace;font-weight:bold">${t("tb_subscribe")}</button>`}
    <a href="help.html" style="background:transparent;border:1px solid #38bdf8;color:#38bdf8;padding:4px 11px;border-radius:14px;font-size:9.5px;text-decoration:none">${t("tb_help")}</a>
    <a href="feedback.html" style="background:transparent;border:1px solid #38bdf8;color:#38bdf8;padding:4px 11px;border-radius:14px;font-size:9.5px;text-decoration:none">${t("tb_feedback")}</a>
    <button id="shareBtn" style="background:transparent;border:1px solid #a78bfa;color:#a78bfa;padding:4px 11px;border-radius:14px;font-size:9.5px;cursor:pointer;font-family:'Courier New',monospace">${t("tb_share")}</button>
    <button id="installBtn" style="background:transparent;border:1px solid #22c55e;color:#6ee7b7;padding:4px 11px;border-radius:14px;font-size:9.5px;cursor:pointer;font-family:'Courier New',monospace">${t("tb_install")}</button>
    ${isAdmin?`<a href="admin.html" style="background:transparent;border:1px solid #38bdf8;color:#38bdf8;padding:4px 11px;border-radius:14px;font-size:9.5px;text-decoration:none">${t("tb_admin")}</a>`:""}
    <button id="logoutBtn" style="background:transparent;border:1px solid #ef4444;color:#ef4444;padding:4px 11px;border-radius:14px;font-size:9.5px;cursor:pointer;font-family:'Courier New',monospace">${t("logout")}</button>`;
  document.getElementById("logoutBtn").onclick=()=>{auth.signOut().then(()=>location.href="login.html");};
  document.getElementById("shareBtn").onclick=shareApp;
  const subBtn=document.getElementById("subscribeBtn");
  if(subBtn)subBtn.onclick=()=>showPaywall(!!CURRENT_USER_DATA?.dailyTrialUsed);
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

// ── Online presence (lightweight heartbeat, no Realtime Database needed) ──
// Updates lastActive every 30s while this tab is open. Admin panel treats
// anyone whose lastActive is within the last 2 minutes as "online" (green dot).
function startPresenceHeartbeat(){
  const beat=()=>{
    if(CURRENT_UID) db.collection("users").doc(CURRENT_UID).update({lastActive:firebase.firestore.FieldValue.serverTimestamp()}).catch(()=>{});
  };
  beat();
  setInterval(beat,30000);
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

  // Safety net: if this is an email/password account and the email was
  // never verified (e.g. they navigated back after signup), block access.
  const isPasswordAccount=user.providerData.some(p=>p.providerId==="password");
  if(isPasswordAccount && !user.emailVerified){
    showVerifyEmailScreen(user);
    return;
  }

  CURRENT_UID=user.uid;
  showLoading("LOADING ACCOUNT...");
  await refreshUserDataAndGate();
  startPresenceHeartbeat();

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
