import { useState, useEffect } from "react";
import payHeader from "../components/payHeader";
const metrics = [
  { label: "Revenue", value: "$2.4M", change: "+12.5%", up: true },
  { label: "Active Users", value: "84,291", change: "+8.3%", up: true },
  { label: "Churn Rate", value: "2.1%", change: "-0.4%", up: false },
  { label: "Avg. Session", value: "6m 42s", change: "+1m 12s", up: true },
];

const activity = [
  { user: "Nora Kim", action: "upgraded to Pro", time: "2m ago", avatar: "NK" },
  { user: "Leo Marsh", action: "submitted support ticket #4821", time: "9m ago", avatar: "LM" },
  { user: "Priya Nair", action: "exported Q1 report", time: "17m ago", avatar: "PN" },
  { user: "Sam Torres", action: "added 3 team members", time: "31m ago", avatar: "ST" },
  { user: "Juno Wei", action: "enabled 2FA", time: "1h ago", avatar: "JW" },
];

const bars = [42, 67, 53, 88, 74, 95, 61, 79, 55, 83, 70, 91];
const months = ["J","F","M","A","M","J","J","A","S","O","N","D"];

export default function Dashboard() {
  const [active, setActive] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={styles.root}>
      <style>{css}</style>


      {/* Main */}
      <main style={styles.main}>
        <payHeader />

        {/* Metric Cards */}
        <div style={styles.metricGrid}>
          {metrics.map((m, i) => (
            <div key={m.label} style={styles.card} className="card-hover">
              <p style={styles.cardLabel}>{m.label}</p>
              <p style={styles.cardValue}>{m.value}</p>
              <span style={{ ...styles.cardBadge, background: m.up ? "#0d2b1a" : "#2b0d0d", color: m.up ? "#4ade80" : "#f87171" }}>
                {m.change}
              </span>
              <div style={{ ...styles.cardAccent, background: m.up ? "#4ade80" : "#f87171" }} />
            </div>
          ))}
        </div>

        {/* Chart + Activity */}
        <div style={styles.lower}>
          {/* Bar Chart */}
          <div style={styles.chartCard}>
            <div style={styles.chartHeader}>
              <span style={styles.chartTitle}>MONTHLY REVENUE</span>
              <span style={styles.chartSub}>2025 — FY</span>
            </div>
            <div style={styles.barWrap}>
              {bars.map((h, i) => (
                <div key={i} style={styles.barCol}>
                  <div
                    style={{ ...styles.bar, height: `${h}%` }}
                    className={`bar bar-${i}`}
                  />
                  <span style={styles.barLabel}>{months[i]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div style={styles.activityCard}>
            <div style={styles.chartHeader}>
              <span style={styles.chartTitle}>RECENT ACTIVITY</span>
              <span style={{ ...styles.chartSub, color: "#c084fc" }}>● LIVE</span>
            </div>
            <div style={styles.feed}>
              {activity.map((a, i) => (
                <div key={i} style={styles.feedItem} className="feed-item">
                  <div style={styles.feedAvatar}>{a.avatar}</div>
                  <div style={styles.feedText}>
                    <span style={styles.feedUser}>{a.user}</span>
                    <span style={styles.feedAction}> {a.action}</span>
                    <div style={styles.feedTime}>{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  root: {
    display: "flex",
    minHeight: "100vh",
    background: "#080b10",
    color: "#e2e8f0",
    fontFamily: "'Courier New', 'Lucida Console', monospace",
    overflow: "hidden",
  },
  sidebar: {
    width: 220,
    background: "#0c1017",
    borderRight: "1px solid #1e2733",
    display: "flex",
    flexDirection: "column",
    padding: "32px 0",
    flexShrink: 0,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "0 24px 32px",
    borderBottom: "1px solid #1e2733",
    marginBottom: 24,
  },
  logoMark: { fontSize: 22, color: "#c084fc" },
  logoText: { fontSize: 18, fontWeight: 700, letterSpacing: "0.25em", color: "#f1f5f9" },
  nav: { display: "flex", flexDirection: "column", gap: 2, padding: "0 12px" },
  navItem: {
    background: "none",
    border: "none",
    color: "#64748b",
    fontSize: 12,
    letterSpacing: "0.15em",
    padding: "10px 12px",
    textAlign: "left",
    cursor: "pointer",
    borderRadius: 6,
    display: "flex",
    alignItems: "center",
    gap: 10,
    transition: "all 0.2s",
  },
  navActive: { background: "#131b27", color: "#e2e8f0" },
  navDot: { width: 5, height: 5, borderRadius: "50%", background: "#c084fc", flexShrink: 0 },
  sidebarBottom: {
    marginTop: "auto",
    padding: "16px 24px",
    display: "flex",
    alignItems: "center",
    gap: 8,
    borderTop: "1px solid #1e2733",
  },
  statusDot: { width: 7, height: 7, borderRadius: "50%", background: "#4ade80" },
  statusText: { fontSize: 10, color: "#4ade80", letterSpacing: "0.1em" },
  main: { flex: 1, display: "flex", flexDirection: "column", padding: "32px 36px", gap: 28, overflowY: "auto" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    borderBottom: "1px solid #1e2733",
    paddingBottom: 20,
  },
  headerEyebrow: { fontSize: 10, letterSpacing: "0.2em", color: "#475569", marginBottom: 4 },
  headerTitle: { fontSize: 32, fontWeight: 700, color: "#f1f5f9", margin: 0, letterSpacing: "-0.02em" },
  headerRight: { display: "flex", alignItems: "center", gap: 14 },
  pulse: { width: 8, height: 8, borderRadius: "50%", background: "#c084fc" },
  liveText: { fontSize: 10, color: "#c084fc", letterSpacing: "0.2em" },
  avatar: {
    width: 36, height: 36, borderRadius: "50%",
    background: "linear-gradient(135deg, #7c3aed, #c084fc)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 11, fontWeight: 700, color: "#fff",
  },
  metricGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 },
  card: {
    background: "#0c1017",
    border: "1px solid #1e2733",
    borderRadius: 10,
    padding: "22px 20px",
    position: "relative",
    overflow: "hidden",
    cursor: "pointer",
    transition: "border-color 0.2s",
  },
  cardLabel: { fontSize: 10, color: "#475569", letterSpacing: "0.2em", margin: "0 0 10px" },
  cardValue: { fontSize: 28, fontWeight: 700, color: "#f1f5f9", margin: "0 0 12px", letterSpacing: "-0.02em" },
  cardBadge: { fontSize: 11, padding: "3px 8px", borderRadius: 4, letterSpacing: "0.05em" },
  cardAccent: { position: "absolute", top: 0, right: 0, width: 3, height: "100%", borderRadius: "0 10px 10px 0", opacity: 0.6 },
  lower: { display: "grid", gridTemplateColumns: "1fr 380px", gap: 20, flex: 1 },
  chartCard: {
    background: "#0c1017",
    border: "1px solid #1e2733",
    borderRadius: 10,
    padding: "24px",
    display: "flex",
    flexDirection: "column",
  },
  chartHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  chartTitle: { fontSize: 10, letterSpacing: "0.2em", color: "#94a3b8" },
  chartSub: { fontSize: 10, color: "#475569", letterSpacing: "0.1em" },
  barWrap: { display: "flex", gap: 8, alignItems: "flex-end", flex: 1, height: 160 },
  barCol: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%", gap: 6 },
  bar: {
    width: "100%",
    background: "linear-gradient(180deg, #c084fc 0%, #7c3aed 100%)",
    borderRadius: "3px 3px 0 0",
    transition: "height 0.8s cubic-bezier(.4,0,.2,1)",
    minHeight: 4,
  },
  barLabel: { fontSize: 9, color: "#475569", letterSpacing: "0.05em" },
  activityCard: {
    background: "#0c1017",
    border: "1px solid #1e2733",
    borderRadius: 10,
    padding: "24px",
    overflow: "hidden",
  },
  feed: { display: "flex", flexDirection: "column", gap: 18, marginTop: 4 },
  feedItem: { display: "flex", gap: 12, alignItems: "flex-start" },
  feedAvatar: {
    width: 30, height: 30, borderRadius: 6,
    background: "#131b27",
    border: "1px solid #1e2733",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 9, fontWeight: 700, color: "#94a3b8", flexShrink: 0,
  },
  feedText: { flex: 1 },
  feedUser: { fontSize: 12, color: "#e2e8f0", fontWeight: 600 },
  feedAction: { fontSize: 12, color: "#64748b" },
  feedTime: { fontSize: 10, color: "#334155", marginTop: 3, letterSpacing: "0.05em" },
};

const css = `
  * { box-sizing: border-box; }
  body { margin: 0; }
  .card-hover:hover { border-color: #334155 !important; }
  .feed-item { transition: opacity 0.2s; }
  .feed-item:hover { opacity: 0.8; }
  .pulse { animation: pulseAnim 1.8s ease-in-out infinite; }
  @keyframes pulseAnim {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.85); }
  }
  ${bars.map((_, i) => `
    .bar-${i} { animation: growBar 0.6s ${i * 0.05}s cubic-bezier(.4,0,.2,1) both; }
  `).join("")}
  @keyframes growBar {
    from { transform: scaleY(0); transform-origin: bottom; }
    to { transform: scaleY(1); transform-origin: bottom; }
  }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #080b10; }
  ::-webkit-scrollbar-thumb { background: #1e2733; border-radius: 2px; }
`;