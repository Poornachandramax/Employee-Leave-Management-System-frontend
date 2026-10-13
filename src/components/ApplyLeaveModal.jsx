import { useState } from 'react'
import { X, CalendarDays } from 'lucide-react'
import { leaveApi } from '../services/api'
import { daysInclusive } from '../utils'

export default function ApplyLeaveModal({ user, onClose, onSuccess }) {
  const today = new Date(); const minDate = new Date(today.getTime()-today.getTimezoneOffset()*60000).toISOString().slice(0,10)
  const [form,setForm] = useState({leaveType:'ANNUAL',startDate:'',endDate:'',reason:''})
  const [error,setError] = useState(''); const [busy,setBusy] = useState(false)
  const update=(key,value)=>setForm(old=>({...old,[key]:value}))
  async function submit(e){
    e.preventDefault();setError('')
    if(form.endDate<form.startDate){setError('End date must be on or after the start date.');return}
    if(!form.startDate||!form.endDate){setError('Choose both start and end dates.');return}
    if(!form.reason.trim()){setError('Please enter a reason for your request.');return}
    setBusy(true)
    try{await leaveApi.create({...form,username:user.username,reason:form.reason.trim()});onSuccess('Your leave request has been submitted.')}
    catch(err){setError(err.message)}
    finally{setBusy(false)}
  }
  return <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}>
    <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="apply-title">
      <div className="modal-heading"><span className="modal-icon"><CalendarDays size={20}/></span><div><h2 id="apply-title">Apply for leave</h2><p>Tell us when you need time away.</p></div><button className="icon-button close-modal" onClick={onClose}><X size={19}/></button></div>
      <form onSubmit={submit} className="apply-form">
        <label>Leave type<select value={form.leaveType} onChange={e=>update('leaveType',e.target.value)}><option value="ANNUAL">Annual leave</option><option value="SICK">Sick leave</option><option value="CASUAL">Casual leave</option></select></label>
        <div className="date-fields"><label>Start date<input type="date" min={minDate} value={form.startDate} onChange={e=>{update('startDate',e.target.value);if(form.endDate&&e.target.value>form.endDate)update('endDate',e.target.value)}} required/></label><label>End date<input type="date" min={form.startDate||minDate} value={form.endDate} onChange={e=>update('endDate',e.target.value)} required/></label></div>
        {form.startDate&&form.endDate&&form.endDate>=form.startDate&&<div className="days-preview">{daysInclusive(form.startDate,form.endDate)} calendar day(s) requested</div>}
        <label>Reason<textarea rows="4" maxLength="1000" value={form.reason} onChange={e=>update('reason',e.target.value)} placeholder="Share a short reason for your leave…" required/></label>
        {error&&<div className="form-error">{error}</div>}
        <div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button className="primary-button" disabled={busy}>{busy?'Submitting…':'Submit request'}</button></div>
      </form>
    </section>
  </div>
}
