import { useEffect, useState } from 'react'
import { RefreshCw, Search } from 'lucide-react'
import { leaveApi } from '../services/api'
import LeaveTable from '../components/LeaveTable'

export default function Requests({ user, notify }) {
  const admin = user.role === 'ADMIN'
  const [leaves,setLeaves] = useState([])
  const [filter,setFilter] = useState('ALL')
  const [search,setSearch] = useState('')
  const [loading,setLoading] = useState(true)
  const [error,setError] = useState('')
  async function load(){
    setLoading(true);setError('')
    try {setLeaves(admin?await leaveApi.getAll():await leaveApi.getMine(user.username))}
    catch(e){setError(e.message)}
    finally{setLoading(false)}
  }
  useEffect(()=>{load()},[user.username,admin])
  async function decide(leave,status){
    let comment=''
    if(status==='REJECTED') comment=window.prompt('Optional reason for rejection:')||''
    if(!window.confirm(`${status==='APPROVED'?'Approve':'Reject'} this leave request?`)) return
    try {await leaveApi.decide(leave.id,{status,comment});notify(`Request ${status.toLowerCase()}.`);await load()}
    catch(e){notify(e.message,'error')}
  }
  const shown=leaves.filter(l=>(filter==='ALL'||l.status===filter)&&`${l.employeeName||''} ${l.username||''} ${l.reason||''} ${l.leaveType||''}`.toLowerCase().includes(search.toLowerCase()))
  return <div className="page-content">
    <div className="section-title-row requests-title"><div><h3>{admin?'All leave requests':'My leave requests'}</h3><p>{admin?'Review and manage employee applications.':'View the history and status of your applications.'}</p></div><button className="secondary-button" onClick={load}><RefreshCw size={15}/> Refresh</button></div>
    {error&&<div className="alert-error">{error}</div>}
    <section className="content-card">
      <div className="card-heading"><div><h3>Request history <span className="count-pill">{shown.length}</span></h3><p>Search and filter leave applications.</p></div><div className="heading-actions"><label className="search-box"><Search size={15}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search requests"/></label><select className="filter-select" value={filter} onChange={e=>setFilter(e.target.value)}><option value="ALL">All statuses</option><option value="PENDING">Pending</option><option value="APPROVED">Approved</option><option value="REJECTED">Rejected</option></select></div></div>
      {loading?<div className="loading-state">Loading requests…</div>:<LeaveTable leaves={shown} admin={admin} onDecision={decide} emptyText="Try another search or filter."/>}
    </section>
  </div>
}
