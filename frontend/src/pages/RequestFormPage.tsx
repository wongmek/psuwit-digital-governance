import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import type { GovernanceRequest } from '../types';
import { ErrorNotice, PageHeader } from '../components/UI';

const types = ['การใช้เครื่องมือ AI','การพัฒนาหรือเปิดใช้ระบบ','การจัดเก็บหรือใช้ข้อมูล','การแบ่งปันข้อมูลภายนอก','การเชื่อมต่อ API/ฐานข้อมูล','การใช้ Cloud/Hosting','การจัดซื้อบริการดิจิทัล','การเปลี่ยนแปลงหรือปิดระบบ','การขอข้อยกเว้น'];

export function RequestFormPage() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ type: types[0], title: '', objective: '', description: '', department: '', dataClassification: 'INTERNAL', containsPersonalData: false, externalProvider: '', requestedGoLiveDate: '' });
  function update(name: string, value: string | boolean) { setForm((current) => ({ ...current, [name]: value })); }
  async function submit(event: FormEvent) {
    event.preventDefault();
    try { setBusy(true); setError(''); const result = await api<{ item: GovernanceRequest }>('/requests', { method: 'POST', body: JSON.stringify(form) }); navigate(`/requests/${result.item.id}`); }
    catch (e) { setError(e instanceof Error ? e.message : 'บันทึกคำขอไม่สำเร็จ'); }
    finally { setBusy(false); }
  }
  return <div className="page narrow-page">
    <PageHeader title="สร้างคำขอใหม่" description="ระบุข้อมูลให้ครบถ้วนเพื่อใช้จำแนก ประเมิน และกำหนดผู้พิจารณา"/>
    {error && <ErrorNotice message={error}/>}<form className="panel form-panel" onSubmit={submit}>
      <fieldset><legend>ข้อมูลคำขอ</legend><div className="form-grid">
        <label className="full"><span>ประเภทคำขอ *</span><select value={form.type} onChange={(e) => update('type', e.target.value)}>{types.map((type) => <option key={type}>{type}</option>)}</select></label>
        <label className="full"><span>ชื่อเรื่อง *</span><input required maxLength={200} value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="ระบุชื่อเครื่องมือ ระบบ หรือกิจกรรม"/></label>
        <label className="full"><span>วัตถุประสงค์ *</span><textarea required rows={3} value={form.objective} onChange={(e) => update('objective', e.target.value)} placeholder="อธิบายเหตุผล ความจำเป็น และผลที่คาดว่าจะได้รับ"/></label>
        <label className="full"><span>รายละเอียดการดำเนินงาน</span><textarea rows={4} value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="กลุ่มผู้ใช้ ขอบเขตข้อมูล การเชื่อมต่อ และผู้ให้บริการ"/></label>
        <label><span>ฝ่าย/กลุ่มสาระ *</span><input required value={form.department} onChange={(e) => update('department', e.target.value)}/></label>
        <label><span>วันที่คาดว่าจะเปิดใช้</span><input type="date" value={form.requestedGoLiveDate} onChange={(e) => update('requestedGoLiveDate', e.target.value)}/></label>
      </div></fieldset>
      <fieldset><legend>ข้อมูลและผู้ให้บริการ</legend><div className="form-grid">
        <label><span>ระดับข้อมูล *</span><select value={form.dataClassification} onChange={(e) => update('dataClassification', e.target.value)}><option value="PUBLIC">ข้อมูลสาธารณะ</option><option value="INTERNAL">ข้อมูลใช้ภายใน</option><option value="CONFIDENTIAL">ข้อมูลส่วนบุคคล/ลับ</option><option value="RESTRICTED">ข้อมูลอ่อนไหว/จำกัดสูง</option></select></label>
        <label><span>ผู้ให้บริการภายนอก</span><input value={form.externalProvider} onChange={(e) => update('externalProvider', e.target.value)} placeholder="ถ้ามี"/></label>
        <label className="checkbox-row full"><input type="checkbox" checked={form.containsPersonalData} onChange={(e) => update('containsPersonalData', e.target.checked)}/><span>คำขอนี้เกี่ยวข้องกับข้อมูลส่วนบุคคลของนักเรียน บุคลากร หรือผู้ปกครอง</span></label>
      </div></fieldset>
      <div className="form-actions"><button className="button ghost" type="button" onClick={() => navigate(-1)}>ยกเลิก</button><button className="button primary" disabled={busy}>{busy ? 'กำลังบันทึก...' : 'บันทึกและส่งคำขอ'}</button></div>
    </form>
  </div>;
}
