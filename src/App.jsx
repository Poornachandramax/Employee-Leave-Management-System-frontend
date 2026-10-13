import { useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { CheckCircle2, XCircle } from 'lucide-react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Requests from './pages/Requests'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import ApplyLeaveModal from './components/ApplyLeaveModal'

export default function App() {
  const [user,setUser] = useState(null)
  const [showApply,setShowApply] = useState(false)
  const [notice,setNotice] = useState(null)
  const navigate=useNavigate(); const location=useLocation()
  function notify(message,type='success'){
    setNotice({message,type});window.clearTimeout(window.noticeTimer)
    window.noticeTimer=window.setTimeout(()=>setNotice(null),4000)
  }
  function login(value){setUser(value);navigate('/')}
  function logout(){setUser(null);setShowApply(false);navigate('/')}
  if(!user) return <Login onLogin={login}/>
  const title=location.pathname==='/requests'?(user.role==='ADMIN'?'All requests':'My requests'):'Dashboard'
  return <div className="app-shell">
    <Sidebar user={user} onLogout={logout}/>
    <main className="main-area"><Topbar title={title} user={user}/>
      <Routes>
        <Route path="/" element={<Dashboard user={user} onApply={()=>setShowApply(true)}/>}/>
        <Route path="/requests" element={<Requests user={user} notify={notify}/>}/>
        <Route path="*" element={<Navigate to="/" replace/>}/>
      </Routes>
      <footer className="app-footer"><span>LeaveFlow</span><span>Employee Leave Management System</span><span>Built for better work-life balance</span></footer>
    </main>
    {showApply&&user.role!=='ADMIN'&&<ApplyLeaveModal user={user} onClose={()=>setShowApply(false)} onSuccess={message=>{setShowApply(false);notify(message);navigate('/');window.setTimeout(()=>window.location.reload(),250)}}/>}
    {notice&&<div className={`toast ${notice.type}`}><span className="toast-icon">{notice.type==='success'?<CheckCircle2 size={19}/>:<XCircle size={19}/>}</span>{notice.message}<button onClick={()=>setNotice(null)} aria-label="Dismiss">×</button></div>}
  </div>
}
