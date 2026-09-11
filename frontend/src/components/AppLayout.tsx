import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  AlertTriangle,
  BarChart3,
  BookOpenCheck,
  ChevronLeft,
  ClipboardList,
  Database,
  LogOut,
  Menu,
  PlusCircle,
  Settings,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useAuth } from '../state/AuthContext';

const nav = [
  { to: '/', label: 'ภาพรวม', icon: BarChart3, end: true },
  { to: '/requests', label: 'คำขอและการอนุมัติ', icon: ClipboardList },
  { to: '/requests/new', label: 'สร้างคำขอ', icon: PlusCircle },
  { to: '/registers', label: 'ทะเบียนกลาง', icon: Database },
  { to: '/risks', label: 'ความเสี่ยง', icon: ShieldCheck },
  { to: '/incidents', label: 'รายงานเหตุการณ์', icon: AlertTriangle },
  { to: '/reports', label: 'รายงานและหลักฐาน', icon: BookOpenCheck },
  { to: '/admin', label: 'ตั้งค่าระบบ', icon: Settings, admin: true },
];

export function AppLayout() {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className={`app-shell ${collapsed ? 'is-collapsed' : ''}`}>
      <button className="mobile-menu" onClick={() => setOpen(true)} aria-label="เปิดเมนู"><Menu /></button>
      {open && <button className="sidebar-backdrop" onClick={() => setOpen(false)} aria-label="ปิดเมนู" />}
      <aside className={`sidebar ${open ? 'is-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark">DG</div>
          <div className="brand-copy"><strong>PSUWIT</strong><span>Digital Governance</span></div>
          <button className="mobile-close" onClick={() => setOpen(false)} aria-label="ปิดเมนู"><X /></button>
        </div>
        <nav aria-label="เมนูหลัก">
          {nav.filter((item) => !item.admin || user?.roles.includes('DIRECTOR')).map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} onClick={() => setOpen(false)} title={label}>
              <Icon size={20} /><span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="profile-mini">
            <span className="avatar">{user?.name?.charAt(0) || 'U'}</span>
            <div><strong>{user?.name}</strong><span>{user?.department}</span></div>
          </div>
          <button className="icon-action" onClick={logout} title="ออกจากระบบ"><LogOut size={19} /></button>
        </div>
        <button className="collapse-button" onClick={() => setCollapsed(!collapsed)} title="ย่อเมนู"><ChevronLeft size={17} /></button>
      </aside>
      <main className="main-content"><Outlet /></main>
    </div>
  );
}
