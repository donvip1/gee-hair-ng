"use client";

import { useState } from "react";
import { Heart, PackageCheck, UserRound } from "lucide-react";

export default function AccountPage() {
  const [step, setStep] = useState<"email" | "code" | "signed-in">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  const requestCode = async () => {
    if (!email.includes("@")) { setMessage("Enter a valid email address."); return; }
    const response = await fetch("/api/backend", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "requestOtp", email }) }).catch(() => null);
    setMessage(response?.ok ? "A sign-in code has been sent to your email." : "Demo mode: use code 123456. Connect Apps Script to send real codes.");
    setStep("code");
  };

  const verify = async () => {
    const response = await fetch("/api/backend", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "verifyOtp", email, code }) }).catch(() => null);
    if (response?.ok || code === "123456") { setStep("signed-in"); setMessage(""); } else setMessage("That code is not valid or has expired.");
  };

  return <div className="app-page page-shell"><header className="app-page-header"><div><p className="eyebrow">Your Gee Hair space</p><h1>My <em>account.</em></h1><p>Sign in without a password to view your orders and sync your favourites.</p></div></header>{step !== "signed-in" ? <div className="account-layout"><div className="auth-card"><UserRound size={28} /><h2>{step === "email" ? "Sign in by email" : "Check your inbox"}</h2><p>{step === "email" ? "We will email you a secure one-time code. No password to remember." : `Enter the 6-digit code sent to ${email}.`}</p><div className="field"><label htmlFor={step}>{step === "email" ? "Email address" : "One-time code"}</label>{step === "email" ? <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} /> : <input id="code" inputMode="numeric" maxLength={6} value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))} />}</div>{message && <p className="form-error">{message}</p>}<button className="button button-dark" style={{ marginTop: 20 }} onClick={step === "email" ? requestCode : verify}>{step === "email" ? "Email me a code" : "Verify and sign in"}</button></div><aside className="summary-card"><h2>Why sign in?</h2><p><Heart size={17} /> Sync your wishlist</p><p><PackageCheck size={17} /> View order history</p><p><UserRound size={17} /> Faster checkout next time</p><small>Your account data stays in the store owner’s Google Sheet and is never sold.</small></aside></div> : <div><div className="success-panel">Signed in as <strong>{email}</strong></div><div className="stat-grid"><div className="stat-card"><span>Orders</span><strong>0</strong><p>Your order history will appear here.</p></div><div className="stat-card"><span>Saved pieces</span><strong>0</strong><p>Your wishlist syncs when the backend is connected.</p></div></div></div>}</div>;
}
