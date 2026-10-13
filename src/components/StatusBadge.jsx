export default function StatusBadge({ status }) {
  return <span className={`status-badge ${String(status || 'PENDING').toLowerCase()}`}>{status || 'PENDING'}</span>
}
