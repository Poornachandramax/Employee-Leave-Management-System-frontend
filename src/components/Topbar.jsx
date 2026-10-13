import { Bell } from 'lucide-react'
export default function Topbar({ title, user }) {
  return <header className="topbar">
    <div><p className="eyebrow">LEAVE MANAGEMENT</p><h1>{title}</h1></div>
    <div className="topbar-user"><span className="online-dot"/><span>{user?.fullName}</span><span className="bell"><Bell size={17}/></span></div>
  </header>
}
