import { useState } from 'react'
import { ArrowRight, CalendarDays, ShieldCheck } from 'lucide-react'
import { authApi } from '../services/api'

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('employee')
  const [password, setPassword] = useState('employee123')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault(); setError(''); setBusy(true)
    try { const user = await authApi.login({ username: username.trim(), password }); onLogin(user) }
    catch (err) { setError(err.message) }
    finally { setBusy(false) }
  }

  return <main className="login-page">
    <section className="login-visual">
      <div className="login-brand"><span className="brand-logo">LF</span><span>LeaveFlow</span></div>
      <div className="visual-copy"><span className="visual-pill"><CalendarDays size={14}/> PEOPLE OPERATIONS</span><h1>Your time off,<br/><em>made simple.</em></h1><p>A calmer way to plan leave, keep your team informed, and make room for what matters.</p>
        <div className="visual-feature"><span><ShieldCheck size={18}/></span><div><strong>Clear and transparent</strong><small>One place for requests, approvals and balances.</small></div></div>
      </div>
      <div className="visual-bottom">EMPLOYEE LEAVE MANAGEMENT · WORK BETTER, TOGETHER</div>
    </section>
    <section className="login-side"><div className="login-form-wrap">
      <div className="mobile-brand"><span className="brand-logo">LF</span><span>LeaveFlow</span></div>
      <p className="eyebrow">YOUR WORKSPACE</p><h2>Welcome back</h2><p className="login-subtitle">Sign in to access your leave dashboard.</p>
      <form onSubmit={submit} className="login-form">
        <label>Username<input value={username} onChange={e=>setUsername(e.target.value)} autoComplete="username" required placeholder="Enter your username"/></label>
        <label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password" required placeholder="Enter your password"/></label>
        {error && <div className="form-error">{error}</div>}
        <button className="primary-button login-submit" disabled={busy}>{busy ? 'Signing in…' : <>Sign in <ArrowRight size={17}/></>}</button>
      </form>
      <div className="demo-box"><strong>Demo accounts</strong><button type="button" onClick={()=>{setUsername('employee');setPassword('employee123')}}><span>Employee</span><code>employee / employee123</code></button><button type="button" onClick={()=>{setUsername('admin');setPassword('admin123')}}><span>Admin</span><code>admin / admin123</code></button></div>
      <p className="login-foot">Secure your time. Plan your balance.</p>
    </div></section>
  </main>
}
