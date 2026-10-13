import { LayoutDashboard, ClipboardList, LogOut, CalendarDays } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { initials } from '../utils'

export default function Sidebar({ user, onLogout }) {
  const admin = user?.role === 'ADMIN'
  return <aside className="sidebar">
    <div className="brand"><span className="brand-logo">LF</span><span>LeaveFlow</span></div>
    <div className="side-label">WORKSPACE</div>
    <NavLink to="/" end className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}><LayoutDashboard size={18}/><span>Dashboard</span></NavLink>
    <NavLink to="/requests" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}><ClipboardList size={18}/><span>{admin ? 'All requests' : 'My requests'}</span></NavLink>
    <div className="sidebar-spacer"/>
    <div className="profile-mini">
      <span className="avatar">{initials(user?.fullName)}</span>
      <span className="profile-text"><strong>{user?.fullName}</strong><small>{admin ? 'Administrator' : 'Employee'}</small></span>
      <button className="icon-button logout" onClick={onLogout} title="Sign out"><LogOut size={17}/></button>
    </div>
    <div className="side-footer"><CalendarDays size={14}/> Time-off made simpler</div>
  </aside>
}
