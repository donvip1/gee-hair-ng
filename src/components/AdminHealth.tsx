"use client";

import { useEffect, useState } from "react";
import { Activity, RefreshCw } from "lucide-react";

type Health = {
  ready: boolean;
  status: "ready" | "unconfigured" | "unhealthy";
  checkedAt: string;
  environment: string;
  deployment: string;
  configured: boolean;
  endpoint?: { host: string; deploymentRef: string; usesExecUrl: boolean } | null;
  probe?: { release: string };
  health?: { productCount: number; sheetName: string; driveFolderName: string };
  error?: string;
};

export function AdminHealth() {
  const [data, setData] = useState<Health | null>(null);
  const [loading, setLoading] = useState(true);
  const load = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/health", { cache: "no-store" });
      setData(await response.json() as Health);
    } finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, []);

  return (
    <section className="admin-health" aria-labelledby="health-title">
      <div className="admin-health-head"><div><p className="eyebrow">Production readiness</p><h2 id="health-title">System health</h2></div><button type="button" className="pill" onClick={() => void load()} disabled={loading}><RefreshCw size={14} /> {loading ? "Checking…" : "Check now"}</button></div>
      {!data ? <p>Checking the protected catalog connection…</p> : (
        <div className={`health-summary health-${data.status}`}>
          <Activity size={23} />
          <div><strong>{data.ready ? "Live catalog ready" : data.status === "unconfigured" ? "Catalog setup required" : "Catalog connection needs attention"}</strong><p>{data.ready && data.health ? `${data.health.productCount} product${data.health.productCount === 1 ? "" : "s"} · ${data.health.sheetName} · ${data.health.driveFolderName}` : data.error || "Complete the private Apps Script and Vercel environment setup."}</p><small>{data.environment} · deployment {data.deployment} · {data.endpoint ? `${data.endpoint.host} …${data.endpoint.deploymentRef}` : "no endpoint"}{data.probe?.release ? ` · release ${data.probe.release}` : ""} · checked {new Date(data.checkedAt).toLocaleString()}</small></div>
        </div>
      )}
    </section>
  );
}
