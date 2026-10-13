import { CalendarDays } from 'lucide-react'
import StatusBadge from './StatusBadge'
import { dateRange, typeLabel } from '../utils'

export default function LeaveTable({ leaves = [], admin = false, onDecision, emptyText = 'No leave requests to show yet.' }) {
  if (!leaves.length) return <div className="empty-state"><span className="empty-icon"><CalendarDays size={23}/></span><strong>Nothing here yet</strong><p>{emptyText}</p></div>
  return <div className="table-scroll"><table className="data-table">
    <thead><tr>{admin && <th>EMPLOYEE</th>}<th>LEAVE TYPE</th><th>DATES</th><th>DAYS</th><th>STATUS</th><th>REASON</th>{admin && <th>ACTION</th>}</tr></thead>
    <tbody>{leaves.map(leave => <tr key={leave.id}>
      {admin && <td><div className="employee-cell"><span className="avatar tiny">{(leave.employeeName || leave.username || 'E').slice(0,1).toUpperCase()}</span><span><strong>{leave.employeeName || leave.username}</strong><small>{leave.username}</small></span></div></td>}
      <td><strong className="type-cell">{typeLabel(leave.leaveType)}</strong></td>
      <td className="date-cell">{dateRange(leave.startDate, leave.endDate)}</td>
      <td>{leave.days ?? '—'}</td><td><StatusBadge status={leave.status}/></td>
      <td><span className="reason-cell" title={leave.reason}>{leave.reason}</span></td>
      {admin && <td>{leave.status === 'PENDING' ? <div className="decision-actions">
        <button className="mini-approve" onClick={() => onDecision(leave, 'APPROVED')}>Approve</button>
        <button className="mini-reject" onClick={() => onDecision(leave, 'REJECTED')}>Reject</button>
      </div> : <span className="muted">Reviewed</span>}</td>}
    </tr>)}</tbody>
  </table></div>
}
