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
      <div style="font-size:11px;color:#94a3b8;margin-bottom:20px;line-height:1.6">
        Aapne ${FREE_TRIAL_USES} free calculations use kar liye hain.<br>
        Aage use karne ke liye subscribe karo.
      </div>
      <button onclick="startPayment('monthly')" style="width:100%;padding:12px;background:#38bdf8;border:none;border-radius:6px;color:#000;font-weight:bold;font-family:'Courier New',monospace;font-size:12px;cursor:pointer;margin-bottom:10px">
        MONTHLY — ₹${(PLAN_PRICES.monthly.amount/100).toFixed(0)}/month
      </button>
      <button onclick="startPayment('yearly')" style="width:100%;padding:12px;background:#f59e0b;border:none;border-radius:6px;color:#000;font-weight:bold;font-family:'Courier New',monospace;font-size:12px;cursor:pointer">
        YEARLY — ₹${(PLAN_PRICES.yearly.amount/100).toFixed(0)}/year
      </button>
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

function startPayment(plan){
  if(!window.Razorpay){alert("Payment system load ho raha hai, thoda ruk ke try karo.");return;}
  const p=PLAN_PRICES[plan];
  const options={
    key: RAZORPAY_KEY_ID,
    amount: p.amount,
    currency: "INR",
    name: "IS 800 Beam Design Tool",
    description: `${p.label} Subscription`,
    prefill: {email: auth.currentUser ? auth.currentUser.email : ""},
    theme: {color:"#38bdf8"},
    handler: async function(response){
      // NOTE (MVP-level): this confirms payment using Razorpay's client-side
      // success callback only. For production, verify the payment signature
      // server-side (e.g. a Firebase Cloud Function) before granting access,
      // since a client-side-only flow can in principle be tampered with.
      const expiry=new Date(Date.now()+p.days*24*60*60*1000);
      await db.collection("users").doc(CURRENT_UID).update({
        plan,
        subscriptionExpiry: firebase.firestore.Timestamp.fromDate(expiry),
        lastPaymentId: response.razorpay_payment_id
      });
      await refreshUserDataAndGate();
      alert("Payment successful! Subscription activate ho gaya.");
    }
  };
  const rz=new Razorpay(options);
  rz.open();
}

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
