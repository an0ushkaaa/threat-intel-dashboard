import { useState } from "react";

const typeLabels = { ip: "IP Address", domain: "Domain", email: "Email" };

const typeColors = {
  ip: { background: "#E6F1FB", color: "#0C447C" },
  domain: { background: "#E1F5EE", color: "#085041" },
  email: { background: "#FAEEDA", color: "#633806" },
};

function MetricCard({ label, value, tone }) {
  const colors = { danger: "#A32D2D", safe: "#0F6E56", warn: "#854F0B", neutral: "inherit" };
  return (
    <div style={{ background: "#f5f5f5", borderRadius: 8, padding: "1rem" }}>
      <div style={{ fontSize: 12, color: "#888", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 500, color: colors[tone] || "inherit" }}>{value}</div>
    </div>
  );
}

function RawRow({ k, v }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "0.5px solid #eee", fontSize: 14 }}>
      <span style={{ color: "#888" }}>{k}</span>
      <span style={{ fontWeight: 500, textAlign: "right", maxWidth: "60%", wordBreak: "break-all" }}>
        {typeof v === "object" ? JSON.stringify(v) : String(v)}
      </span>
    </div>
  );
}

function IPResult({ result }) {
  const s = result.summary || {};
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: "1.5rem" }}>
        <MetricCard label="Country" value={s.country || "—"} tone="neutral" />
        <MetricCard label="City" value={s.city || "—"} tone="neutral" />
      </div>
      <div style={{ background: "#fff", border: "0.5px solid #e5e5e5", borderRadius: 12, padding: "1rem 1.25rem" }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: "#888", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 12 }}>Details</div>
        <RawRow k="Org" v={s.org || "—"} />
        <RawRow k="IP" v={s.ip || "—"} />
        {Object.entries(result.raw || {})
          .filter(([k]) => !["country", "city", "org", "ip"].includes(k))
          .map(([k, v]) => <RawRow key={k} k={k} v={v} />)}
      </div>
    </>
  );
}

function DomainResult({ result }) {
  const { malicious = 0, suspicious = 0, harmless = 0, undetected = 0 } = result;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
      <MetricCard label="Malicious" value={malicious} tone={malicious > 0 ? "danger" : "safe"} />
      <MetricCard label="Suspicious" value={suspicious} tone={suspicious > 0 ? "warn" : "safe"} />
      <MetricCard label="Harmless" value={harmless} tone="safe" />
      <MetricCard label="Undetected" value={undetected} tone="neutral" />
    </div>
  );
}

function EmailResult({ result }) {
  const { risk_score = 0, breached = false, breaches = [] } = result;
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: "1.5rem" }}>
        <MetricCard label="Risk Score" value={risk_score} tone={risk_score > 50 ? "danger" : risk_score > 20 ? "warn" : "safe"} />
        <MetricCard label="Status" value={breached ? "Breached" : "Clean"} tone={breached ? "danger" : "safe"} />
      </div>
      {breaches.length > 0 && (
        <div style={{ background: "#fff", border: "0.5px solid #e5e5e5", borderRadius: 12, padding: "1rem 1.25rem" }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: "#888", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 12 }}>Found in breaches</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {breaches.map((b) => (
              <span key={b} style={{ fontSize: 12, padding: "3px 10px", borderRadius: 20, background: "#FCEBEB", color: "#791F1F", fontWeight: 500 }}>{b}</span>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default function App() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  async function runScan() {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetch("http://localhost:8000/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: input.trim() }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "2rem 1.5rem", fontFamily: "sans-serif" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: 22, fontWeight: 500, marginBottom: 4 }}>Threat Intelligence Dashboard</h1>
        <p style={{ fontSize: 14, color: "#888" }}>Scan an IP address, domain, or email for threat indicators</p>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: "2rem" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && runScan()}
          placeholder="e.g. 8.8.8.8, google.com, test@example.com"
          style={{ flex: 1, height: 40, padding: "0 14px", border: "0.5px solid #ccc", borderRadius: 8, fontSize: 14, outline: "none" }}
        />
        <button
          onClick={runScan}
          disabled={loading}
          style={{ height: 40, padding: "0 20px", border: "0.5px solid #ccc", borderRadius: 8, fontSize: 14, cursor: loading ? "not-allowed" : "pointer", background: "#fff", opacity: loading ? 0.6 : 1 }}
        >
          {loading ? "Scanning..." : "Scan ↗"}
        </button>
      </div>

      {error && (
        <div style={{ background: "#FCEBEB", border: "0.5px solid #F09595", borderRadius: 8, padding: "12px 16px", color: "#791F1F", fontSize: 14, marginBottom: "1.5rem" }}>
          Could not reach backend — make sure FastAPI is running on port 8000.<br /><small>{error}</small>
        </div>
      )}

      {data && (
        <>
          <div style={{ display: "inline-flex", alignItems: "center", fontSize: 12, padding: "3px 10px", borderRadius: 20, marginBottom: "1.5rem", fontWeight: 500, ...typeColors[data.type] }}>
            {typeLabels[data.type] || data.type} — {data.input}
          </div>
          {data.result?.error ? (
            <div style={{ background: "#FCEBEB", border: "0.5px solid #F09595", borderRadius: 8, padding: "12px 16px", color: "#791F1F", fontSize: 14 }}>
              {data.result.error}: {data.result.details}
            </div>
          ) : data.type === "ip" ? (
            <IPResult result={data.result} />
          ) : data.type === "domain" ? (
            <DomainResult result={data.result} />
          ) : (
            <EmailResult result={data.result} />
          )}
        </>
      )}

      {!data && !error && !loading && (
        <div style={{ textAlign: "center", padding: "3rem 0", color: "#aaa", fontSize: 14 }}>
          Enter an IP, domain, or email above to begin scanning
        </div>
      )}
    </div>
  );
}