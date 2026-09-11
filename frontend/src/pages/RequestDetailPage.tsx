import { FormEvent, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle2, FileUp, Send, ShieldAlert } from 'lucide-react';
import { api } from '../lib/api';
import type { GovernanceRequest } from '../types';
import { ErrorNotice, LoadingBlock, PageHeader, StatusBadge } from '../components/UI';

export function RequestDetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState<GovernanceRequest | null>(null);
  const [error, setError] = useState('');
  const [comment, setComment] = useState('');
  const [busy, setBusy] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);
  const load = () => api<{ item: GovernanceRequest }>(`/requests/${id}`).then((r) => setItem(r.item)).catch((e) => setError(e.message));
  useEffect(() => { void load(); }, [id]);
  async function decide(decision: string) {
    try { setBusy(true); await api(`/requests/${id}/decision`, { method: 'POST', body: JSON.stringify({ decision, comment }) }); setComment(''); await load(); }
    catch (e) { setError(e instanceof Error ? e.message : 'ดำเนินการไม่สำเร็จ'); } finally { setBusy(false); }
  }
  async function addNote(event: FormEvent) {
    event.preventDefault(); if (!comment.trim()) return;
    try { setBusy(true); await api(`/requests/${id}/timeline`, { method: 'POST', body: JSON.stringify({ action: 'COMMENT', note: comment }) }); setComment(''); await load(); }
    catch (e) { setError(e instanceof Error ? e.message : 'บันทึกไม่สำเร็จ'); } finally { setBusy(false); }
  }
  async function upload(file?: File) {
    if (!file || !id) return;
    try {
      setBusy(true); setUploadMessage('กำลังเตรียมพื้นที่จัดเก็บ...');
      const session = await api<{uploadUrl:string}>('/files/upload-session', { method:'POST', body:JSON.stringify({ entityType:'REQUEST', entityId:id, fileName:file.name, mimeType:file.type || 'application/octet-stream', sizeBytes:file.size }) });
      let drive: {id?:string;webViewLink?:string} = {};
      if (!session.uploadUrl.startsWith('demo://')) {
        setUploadMessage('กำลังอัปโหลดไปยัง Google Drive...');
        const response = await fetch(session.uploadUrl, { method:'PUT', headers:{'Content-Type':file.type || 'application/octet-stream'}, body:file });
        if (!response.ok) throw new Error('Google Drive ปฏิเสธการอัปโหลด');
        drive = await response.json();
      }
      await api('/files/confirm', { method:'POST', body:JSON.stringify({ entityType:'REQUEST', entityId:id, fileName:file.name, mimeType:file.type || 'application/octet-stream', sizeBytes:file.size, driveFileId:drive.id, driveWebUrl:drive.webViewLink, uploadUrl:session.uploadUrl }) });
      setUploadMessage('บันทึกหลักฐานแล้ว');
    } catch (e) { setError(e instanceof Error ? e.message : 'อัปโหลดไม่สำเร็จ'); }
    finally { setBusy(false); if(fileInput.current) fileInput.current.value=''; }
  }
  if (error && !item) return <ErrorNotice message={error}/>;
  if (!item) return <LoadingBlock/>;
  return <div className="page">
    <PageHeader title={item.title} description={`${item.requestNo} · ${item.type}`} action={<div className="header-status"><StatusBadge value={item.riskLevel}/><StatusBadge value={item.status}/></div>}/>
    {error && <ErrorNotice message={error}/>}<div className="detail-grid">
      <section className="panel detail-main">
        <h2>รายละเอียดคำขอ</h2><dl className="detail-list"><div><dt>วัตถุประสงค์</dt><dd>{item.objective}</dd></div><div><dt>รายละเอียด</dt><dd>{item.description || '-'}</dd></div><div><dt>เจ้าของงาน</dt><dd>{item.ownerName}</dd></div><div><dt>หน่วยงาน</dt><dd>{item.department}</dd></div><div><dt>ระดับข้อมูล</dt><dd>{item.dataClassification}</dd></div><div><dt>คะแนนความเสี่ยง</dt><dd>{item.riskScore} · <StatusBadge value={item.riskLevel}/></dd></div></dl>
        <div className="section-title"><h2>ประวัติการดำเนินงาน</h2></div><div className="timeline">{item.timeline?.map((entry) => <div key={entry.id}><i/><section><strong>{entry.action}</strong><p>{entry.note || 'ไม่มีรายละเอียดเพิ่มเติม'}</p><small>{entry.actorName} · {new Date(entry.createdAt).toLocaleString('th-TH')}</small></section></div>)}</div>
      </section>
      <aside className="detail-side">
        <section className="panel"><h2>การดำเนินการ</h2><textarea rows={4} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="ระบุความเห็นหรือเงื่อนไข"/><div className="decision-grid"><button disabled={busy} className="button success" onClick={() => decide('APPROVED')}><CheckCircle2 size={17}/>อนุมัติ</button><button disabled={busy} className="button warning" onClick={() => decide('NEED_INFO')}><Send size={17}/>ขอแก้ไข</button><button disabled={busy} className="button danger" onClick={() => decide('REJECTED')}><ShieldAlert size={17}/>ไม่อนุมัติ</button></div><form onSubmit={addNote}><button disabled={busy || !comment.trim()} className="button secondary full">บันทึกความเห็น</button></form></section>
        <section className="panel"><h2>หลักฐานประกอบ</h2><div className="upload-drop"><FileUp/><strong>แนบเอกสาร</strong><span>PDF, DOCX, XLSX, PNG หรือ JPG · ไม่เกิน 50 MB</span><input ref={fileInput} hidden type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg" onChange={(e)=>upload(e.target.files?.[0])}/><button disabled={busy} className="button secondary" type="button" onClick={()=>fileInput.current?.click()}>เลือกไฟล์</button>{uploadMessage&&<small>{uploadMessage}</small>}</div></section>
        <section className="panel"><h2>ผลการพิจารณา</h2>{item.approvals?.length ? item.approvals.map((a) => <div className="approval-item" key={a.id}><StatusBadge value={a.decision}/><p>{a.comment || '-'}</p><small>{a.approverName} · {new Date(a.createdAt).toLocaleDateString('th-TH')}</small></div>) : <p className="muted">ยังไม่มีผลการพิจารณา</p>}</section>
      </aside>
    </div>
  </div>;
}
