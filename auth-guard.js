// ═══════════════════════════════════════════════════════════════
// AUTH GUARD — blocks the calculator until logged in, and enforces
// the free-trial (3 uses) + paid subscription (monthly/yearly) gate.
// ═══════════════════════════════════════════════════════════════

let CURRENT_UID=null, CURRENT_USER_DATA=null;

function ov(html){document.getElementById("auth-overlay").innerHTML=html;document.getElementById("auth-overlay").style.display="flex";}
function hideOverlay(){document.getElementById("auth-overlay").style.display="none";}

function isSubscriptionActive(d){
  if(!d)return false;
  if(!d.subscriptionExpiry)return false;
  const expiryMs=d.subscriptionExpiry.toMillis?d.subscriptionExpiry.toMillis():new Date(d.subscriptionExpiry).getTime();
  return (d.plan==="monthly"||d.plan==="yearly") && expiryMs>Date.now();
}

function showPaywall(){
  ov(`
    <div style="max-width:380px;background:#111827;border:1px solid #1e3050;border-radius:10px;padding:26px;text-align:center">
      <div style="font-size:16px;color:#f59e0b;letter-spacing:2px;margin-bottom:6px">🔒 FREE TRIAL KHATAM</div>
      <div style="font-size:11px;color:#94a3b8;margin-bottom:18px;line-height:1.6">
        Aapne ${FREE_TRIAL_USES} free calculations use kar liye hain.<br>
        Aage use karne ke liye subscribe karo.
      </div>

      <div style="background:#0b1120;border:1px solid #334155;border-radius:8px;padding:16px;margin-bottom:16px">
        <div style="font-size:11px;color:#e2e8f0;margin-bottom:10px">
          <b style="color:#38bdf8">Monthly:</b> ₹299 &nbsp;|&nbsp; <b style="color:#f59e0b">Yearly:</b> ₹2999
        </div>
        <div style="font-size:10px;color:#94a3b8;margin-bottom:8px">Is UPI ID par payment karo:</div>
        <div style="font-size:15px;color:#22c55e;font-weight:bold;letter-spacing:1px;user-select:all;background:#052e16;border-radius:6px;padding:8px;margin-bottom:10px">
          ${UPI_ID}
        </div>
        <div style="font-size:9px;color:#64748b;line-height:1.6">
          Payment ke baad apna <b style="color:#94a3b8">email</b> aur <b style="color:#94a3b8">payment screenshot</b> yahan bhejo:<br>
          <a href="https://wa.me/${SUPPORT_WHATSAPP}" target="_blank" style="color:#38bdf8;text-decoration:none">WhatsApp: +91 ${SUPPORT_WHATSAPP.slice(2)}</a><br>
          Access thodi der mein (admin verify karke) activate ho jayega.
        </div>
      </div>

      <div style="font-size:10px;color:#64748b">
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
    ${isAdmin?`<a href="admin.html" style="color:#38bdf8;text-decoration:none">Admin Panel</a> &nbsp;·&nbsp;`:""}
    <a href="#" id="logoutLink" style="color:#ef4444;text-decoration:none">Logout</a>`;
  document.getElementById("logoutLink").onclick=(e)=>{e.preventDefault();auth.signOut().then(()=>location.href="login.html");};
}

async function refreshUserDataAndGate(){
  const docRef=db.collection("users").doc(CURRENT_UID);
  const snap=await docRef.get();
  if(!snap.exists){
    // Safety net: doc missing (e.g. old account) — create it.
    await docRef.set({email:auth.currentUser.email,usageCount:0,plan:"trial",subscriptionExpiry:null,isAdmin:auth.currentUser.email.toLowerCase()===ADMIN_EMAIL.toLowerCase(),createdAt:firebase.firestore.FieldValue.serverTimestamp()});
    return refreshUserDataAndGate();
  }
  const d=snap.data();
  CURRENT_USER_DATA=d;
  const active=isSubscriptionActive(d);
  const usesLeft=Math.max(0,FREE_TRIAL_USES-(d.usageCount||0));
  injectTopBar(d.email,usesLeft,active,d.isAdmin);
  if(d.isAdmin||active||usesLeft>0){
    hideOverlay();
  }else{
    showPaywall();
  }
  return{active,usesLeft,isAdmin:d.isAdmin};
}

async function consumeOneUse(){
  if(!CURRENT_UID)return false;
  const status=await refreshUserDataAndGate();
  if(status.isAdmin||status.active)return true; // unlimited, don't touch counter
  if(status.usesLeft<=0){showPaywall();return false;}
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
  if(!user){window.location.href="login.html";return;}
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
