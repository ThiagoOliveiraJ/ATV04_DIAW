export default function StatBar({ label, value, color }) {
  const pct = Math.min(100, (value / 200) * 100)
  return (
    <div className="stat-row">
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
      <div className="stat-track">
        <div className="stat-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}
