"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LockKeyhole } from "lucide-react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const submit = async () => {
    setLoading(true);
    const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    setLoading(false);
    if (!response.ok) { setError("Incorrect password or too many attempts. Try again later."); return; }
    router.push("/admin");
  };
  return <div className="app-page page-shell" style={{ maxWidth: 620 }}><div className="auth-card"><LockKeyhole size={28} /><p className="eyebrow">Store management</p><h1 style={{ fontSize: 65 }}>Admin <em>login.</em></h1><p>Use the private store password configured in Vercel.</p><div className="field"><label htmlFor="admin-password">Admin password</label><input id="admin-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} onKeyDown={(event) => event.key === "Enter" && submit()} /></div>{error && <p className="form-error">{error}</p>}<button className="button button-dark full-button" style={{ marginTop: 20 }} onClick={submit} disabled={loading}>{loading ? "Checking…" : "Open dashboard"}</button></div></div>;
}
