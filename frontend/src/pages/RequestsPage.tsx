import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { api } from '../lib/api';
import type { GovernanceRequest } from '../types';
import { EmptyState, ErrorNotice, LoadingBlock, PageHeader, SearchBox, StatusBadge } from '../components/UI';

export function RequestsPage() {
  const [items, setItems] = useState<GovernanceRequest[]>([]);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => { api<{ items: GovernanceRequest[] }>('/requests').then((r) => setItems(r.items)).catch((e) => setError(e.message)).finally(() => setLoading(false)); }, []);
  const filtered = useMemo(() => items.filter((item) => {
    const term = query.toLowerCase();
    return (status === 'ALL' || item.status === status) && [item.requestNo, item.title, item.ownerName, item.department].join(' ').toLowerCase().includes(term);
  }), [items, query, status]);

  return <div className="page">
    <PageHeader title="คำขอและการอนุมัติ" description="ติดตามคำขอด้าน AI ข้อมูล ระบบดิจิทัล และบริการภายนอก" action={<Link className="button primary" to="/requests/new"><Plus size={18}/>สร้างคำขอ</Link>} />
    <section className="panel">
      <div className="toolbar"><SearchBox value={query} onChange={setQuery} placeholder="ค้นหาเลขรับ ชื่อเรื่อง หรือเจ้าของงาน"/><select value={status} onChange={(e) => setStatus(e.target.value)}><option value="ALL">ทุกสถานะ</option><option value="SUBMITTED">รอตรวจสอบ</option><option value="REVIEWING">อยู่ระหว่างประเมิน</option><option value="PENDING_APPROVAL">รออนุมัติ</option><option value="APPROVED">อนุมัติ</option><option value="ACTIVE">เปิดใช้งาน</option><option value="CLOSED">ปิดงาน</option></select></div>
      {error ? <ErrorNotice message={error}/> : loading ? <LoadingBlock/> : filtered.length === 0 ? <EmptyState title="ไม่พบคำขอ" description="ลองเปลี่ยนคำค้นหรือสร้างคำขอใหม่"/> : <div className="table-scroll"><table><thead><tr><th>เลขรับ/วันที่</th><th>เรื่องและเจ้าของงาน</th><th>ประเภท</th><th>ความเสี่ยง</th><th>สถานะ</th><th>ปรับปรุงล่าสุด</th></tr></thead><tbody>{filtered.map((item) => <tr key={item.id}><td><Link to={`/requests/${item.id}`} className="record-link">{item.requestNo}</Link><small>{new Date(item.createdAt).toLocaleDateString('th-TH')}</small></td><td><strong>{item.title}</strong><small>{item.ownerName} · {item.department}</small></td><td>{item.type}</td><td><StatusBadge value={item.riskLevel}/><small>คะแนน {item.riskScore}</small></td><td><StatusBadge value={item.status}/></td><td>{new Date(item.updatedAt).toLocaleDateString('th-TH')}</td></tr>)}</tbody></table></div>}
    </section>
  </div>;
}
