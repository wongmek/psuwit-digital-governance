import { useEffect, useState } from 'react';
import { AlertOctagon, ArrowRight, CalendarClock, CheckCircle2, ClipboardCheck, FileWarning, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import type { DashboardData } from '../types';
import { ErrorNotice, LoadingBlock, PageHeader, StatusBadge } from '../components/UI';
import { useAuth } from '../state/AuthContext';

const metricConfig = [
  { key: 'openRequests', label: 'คำขอที่กำลังดำเนินการ', icon: ClipboardCheck, tone: 'blue' },
  { key: 'pendingApprovals', label: 'รอการพิจารณา', icon: CalendarClock, tone: 'amber' },
  { key: 'highRisks', label: 'ความเสี่ยงสูง/วิกฤต', icon: ShieldAlert, tone: 'red' },
  { key: 'openIncidents', label: 'เหตุการณ์ที่ยังไม่ปิด', icon: AlertOctagon, tone: 'purple' },
] as const;

export function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState('');
  useEffect(() => { api<DashboardData>('/dashboard').then(setData).catch((e) => setError(e.message)); }, []);

  if (error) return <ErrorNotice message={error} />;
  if (!data) return <LoadingBlock />;

  return (
    <div className="page">
      <PageHeader title={`สวัสดี ${user?.name ?? ''}`} description="รายการสำคัญที่ต้องดำเนินการและสถานะการกำกับดูแลของโรงเรียน" action={<Link className="button primary" to="/requests/new">สร้างคำขอใหม่</Link>} />
      <section className="metric-grid">
        {metricConfig.map(({ key, label, icon: Icon, tone }) => <article className="metric-card" key={key}><div className={`metric-icon ${tone}`}><Icon /></div><div><strong>{data.metrics[key]}</strong><span>{label}</span></div></article>)}
      </section>
      <section className="dashboard-grid">
        <article className="panel compliance-panel">
          <div className="panel-heading"><div><h2>ความพร้อมตามมาตรการ</h2><p>ผลจากรายการตรวจและหลักฐานล่าสุด</p></div><CheckCircle2 className="success-icon" /></div>
          <div className="compliance-value"><strong>{data.metrics.complianceRate}%</strong><span>ผ่านเกณฑ์</span></div>
          <div className="progress-track"><div style={{ width: `${data.metrics.complianceRate}%` }} /></div>
          <div className="compliance-meta"><span>ครบกำหนดทบทวน {data.metrics.overdueReviews} รายการ</span><Link to="/reports">ดูรายงาน <ArrowRight size={16}/></Link></div>
        </article>
        <article className="panel status-panel">
          <div className="panel-heading"><div><h2>สถานะคำขอ</h2><p>ภาพรวมรายการในระบบ</p></div></div>
          <div className="status-bars">{data.requestsByStatus.map((item) => <div key={item.label}><span>{item.label}</span><div className="mini-bar"><i style={{ width: `${Math.max(8, item.value * 12)}%` }} /></div><strong>{item.value}</strong></div>)}</div>
        </article>
      </section>
      <section className="content-grid">
        <article className="panel table-panel">
          <div className="panel-heading"><div><h2>คำขอล่าสุด</h2><p>รายการที่มีการปรับปรุงล่าสุด</p></div><Link to="/requests">ดูทั้งหมด</Link></div>
          <div className="table-scroll"><table><thead><tr><th>เลขรับ</th><th>เรื่อง</th><th>ประเภท</th><th>ระดับความเสี่ยง</th><th>สถานะ</th></tr></thead><tbody>{data.recentRequests.map((r) => <tr key={r.id}><td><Link to={`/requests/${r.id}`}>{r.requestNo}</Link></td><td><strong>{r.title}</strong><small>{r.department}</small></td><td>{r.type}</td><td><StatusBadge value={r.riskLevel}/></td><td><StatusBadge value={r.status}/></td></tr>)}</tbody></table></div>
        </article>
        <article className="panel urgent-panel">
          <div className="panel-heading"><div><h2>รายการเร่งด่วน</h2><p>ต้องติดตามหรือแก้ไข</p></div><FileWarning /></div>
          <div className="urgent-list">{data.urgentItems.map((item) => <div key={item.id}><span className={`urgent-dot ${item.level.toLowerCase()}`} /><div><strong>{item.title}</strong><small>{item.type}{item.dueDate ? ` · กำหนด ${item.dueDate}` : ''}</small></div><StatusBadge value={item.level}/></div>)}</div>
        </article>
      </section>
    </div>
  );
}
