import { useEffect, useState } from 'react'
import { ArrowUpRight, BriefcaseBusiness, HeartPulse, Sun, Plus, RefreshCw } from 'lucide-react'
import { leaveApi } from '../services/api'
import LeaveTable from '../components/LeaveTable'
import { typeLabel } from '../utils'

function StatCard({ title, value, total, icon: Icon, tone, subtitle }) {
  const pct = total ? Math.max(0, Math.min(100, value / total * 100)) : 0
  return <article className="stat-card"><div className="stat-heading"><span>{title}</span><span className={`stat-icon ${tone}`}><Icon size={18}/></span></div><div className="stat-value">{value}<small> days</small></div><p>{subtitle}</p><div className={`progress-track ${tone}`}><span style={{width:`${pct}%`}}/></div></article>
}

export default function Dashboard({ user, onApply }) {
  const admin = user.role === 'ADMIN'
  const [balance, setBalance] = useState({annual:12,sick:6,casual:6})
  const [leaves, setLeaves] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('ALL')

  async function load() {
    setLoading(true); setError('')
    try {
      if (admin) setLeaves(await leaveApi.getAll())
      else {
        const [rows, bal] = await Promise.all([leaveApi.getMine(user.username), leaveApi.getBalance(user.username)])
        setLeaves(rows); setBalance(bal)
      }
    } catch (e) { setError(e.message) } finally { setLoading(false) }
  }
  useEffect(() => { load() }, [user.username, admin])

  const visible = leaves.filter(l => filter === 'ALL' || l.status === filter)
  const pending = leaves.filter(l => l.status === 'PENDING').length
  const approved = leaves.filter(l => l.status === 'APPROVED').length
  const rejected = leaves.filter(l => l.status === 'REJECTED').length

  return <div className="page-content">
    <section className="welcome-banner"><div><p className="eyebrow light">{admin ? 'ADMINISTRATION' : 'YOUR WORKSPACE'}</p><h2>{admin ? 'Team leave overview' : `Hello, ${user.fullName?.split(' ')[0] || 'there'}!`}</h2><p>{admin ? 'Review requests and keep leave operations moving.' : 'Make time for what matters. Your leave, all in one place.'}</p></div><div className="banner-art"><div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/><span>✦</span></div></section>
    {error && <div className="alert-error"><span>{error}</span><button onClick={load}><RefreshCw size={15}/> Retry</button></div>}
    {admin ? <div className="stats-grid admin-grid">
      <StatCard title="Total requests" value={leaves.length} total={Math.max(leaves.length,1)} icon={BriefcaseBusiness} tone="violet" subtitle="All submitted requests"/>
      <StatCard title="Pending review" value={pending} total={Math.max(leaves.length,1)} icon={RefreshCw} tone="amber" subtitle="Need your attention"/>
      <StatCard title="Approved" value={approved} total={Math.max(leaves.length,1)} icon={HeartPulse} tone="mint" subtitle={`${rejected} rejected requests`}/>
    </div> : <>
      <div className="section-title-row"><div><h3>Your leave balance</h3><p>Available days for your current cycle</p></div><button className="primary-button" onClick={onApply}><Plus size={17}/> Apply for leave</button></div>
      <div className="stats-grid">
        <StatCard title="Annual leave" value={balance.annual ?? 0} total={12} icon={BriefcaseBusiness} tone="violet" subtitle="Days available"/>
        <StatCard title="Sick leave" value={balance.sick ?? 0} total={6} icon={HeartPulse} tone="mint" subtitle="Days available"/>
        <StatCard title="Casual leave" value={balance.casual ?? 0} total={6} icon={Sun} tone="amber" subtitle="Days available"/>
      </div>
    </>}
    <section className="content-card">
      <div className="card-heading"><div><h3>{admin ? 'Leave requests' : 'Recent requests'}</h3><p>{admin ? 'Review employee applications and make decisions.' : 'Keep track of your time-off applications.'}</p></div><div className="heading-actions"><select value={filter} onChange={e=>setFilter(e.target.value)} className="filter-select"><option value="ALL">All statuses</option><option value="PENDING">Pending</option><option value="APPROVED">Approved</option><option value="REJECTED">Rejected</option></select><button className="icon-button" onClick={load} title="Refresh"><RefreshCw size={16}/></button></div></div>
      {loading ? <div className="loading-state">Loading leave requests…</div> : <LeaveTable leaves={visible.slice(0, admin ? 100 : 5)} admin={admin} emptyText="No requests found for this status."/>}
      {!admin && leaves.length > 5 && <div className="table-bottom"><span>Showing the 5 most recent requests</span><span>{leaves.length} total</span></div>}
    </section>
    {!admin && <p className="tip-line"><span>✦</span> Remember: submit leave requests early to give your manager time to review.</p>}
  </div>
}
