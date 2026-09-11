import { FormEvent, useEffect, useState } from 'react';
import { Save, Shield, Users } from 'lucide-react';
import { api } from '../lib/api';
import type { Role, User } from '../types';
import { ErrorNotice, LoadingBlock, PageHeader } from '../components/UI';

interface Settings { schoolName: string; allowedDomain: string; driveFolderId: string; incidentEmail: string; reviewReminderDays: number; }

export function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    Promise.all([api<{items: User[]}>('/admin/users'), api<{settings: Settings}>('/admin/settings')])
      .then(([u,s]) => { setUsers(u.items); setSettings(s.settings); }).catch((e) => setError(e.message));
  }, []);
  async function save(e: FormEvent) {
    e.preventDefault(); if (!settings) return;
    try { await api('/admin/settings', { method:'PUT', body:JSON.stringify(settings) }); setMessage('บันทึกการตั้งค่าแล้ว'); setError(''); }
    catch (err) { setError(err instanceof Error ? err.message : 'บันทึกไม่สำเร็จ'); }
  }
  async function setRole(userId: string, role: Role) {
    try { const result = await api<{item: User}>(`/admin/users/${userId}/roles`, { method:'PUT', body:JSON.stringify({ roles:[role] }) }); setUsers(users.map((u) => u.id === userId ? result.item : u)); }
    catch (err) { setError(err instanceof Error ? err.message : 'กำหนดสิทธิ์ไม่สำเร็จ'); }
  }
  if (error && !settings) return <ErrorNotice message={error}/>;
  if (!settings) return <LoadingBlock/>;
  return <div className="page">
    <PageHeader title="ตั้งค่าระบบ" description="สำหรับผู้ดูแลระบบ กำหนดสิทธิ์ หน่วยงาน และค่าควบคุมส่วนกลาง" />
    {error && <ErrorNotice message={error}/>} {message && <div className="success-notice">{message}</div>}
    <section className="admin-grid">
      <form className="panel form-panel" onSubmit={save}><div className="panel-heading"><div><h2>ค่าควบคุมส่วนกลาง</h2><p>ใช้กับการเข้าสู่ระบบและการแจ้งเตือน</p></div><Shield/></div><div className="form-grid">
        <label className="full"><span>ชื่อสถานศึกษา</span><input value={settings.schoolName} onChange={(e)=>setSettings({...settings,schoolName:e.target.value})}/></label>
        <label><span>โดเมนที่อนุญาต</span><input value={settings.allowedDomain} onChange={(e)=>setSettings({...settings,allowedDomain:e.target.value})}/></label>
        <label><span>แจ้งเตือนล่วงหน้า (วัน)</span><input type="number" min="1" max="365" value={settings.reviewReminderDays} onChange={(e)=>setSettings({...settings,reviewReminderDays:Number(e.target.value)})}/></label>
        <label className="full"><span>Google Shared Drive Folder ID</span><input value={settings.driveFolderId} onChange={(e)=>setSettings({...settings,driveFolderId:e.target.value})}/></label>
        <label className="full"><span>อีเมลรับแจ้งเหตุเร่งด่วน</span><input type="email" value={settings.incidentEmail} onChange={(e)=>setSettings({...settings,incidentEmail:e.target.value})}/></label>
      </div><div className="form-actions"><button className="button primary"><Save size={17}/>บันทึกการตั้งค่า</button></div></form>
      <section className="panel"><div className="panel-heading"><div><h2>ผู้ใช้งานและสิทธิ์</h2><p>บัญชีจะถูกสร้างเมื่อเข้าสู่ระบบครั้งแรก</p></div><Users/></div><div className="user-list">{users.map((u)=><article key={u.id}><span className="avatar">{u.name.charAt(0)}</span><div><strong>{u.name}</strong><small>{u.email} · {u.department}</small></div><select value={u.roles[0] || 'USER'} onChange={(e)=>setRole(u.id,e.target.value as Role)}><option value="USER">ผู้ใช้งาน</option><option value="DEPARTMENT_HEAD">หัวหน้าหน่วยงาน</option><option value="DATA_OWNER">เจ้าของข้อมูล</option><option value="SYSTEM_OWNER">เจ้าของระบบ</option><option value="SECURITY">ผู้ดูแลความมั่นคงปลอดภัย</option><option value="COMMITTEE">คณะกรรมการ</option><option value="AUDITOR">ผู้ตรวจสอบ</option><option value="DIRECTOR">ผู้อำนวยการ/ผู้ดูแลระบบ</option></select></article>)}</div></section>
    </section>
  </div>;
}
