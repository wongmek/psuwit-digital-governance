import { useEffect, useState } from 'react';
import { Download, FileCheck2, FolderOpen, ShieldCheck } from 'lucide-react';
import { api, downloadFile } from '../lib/api';
import { ErrorNotice, LoadingBlock, PageHeader } from '../components/UI';

interface Summary {
  requests: number;
  registers: number;
  openRisks: number;
  incidents: number;
  evidenceFiles: number;
  complianceRate: number;
  generatedAt: string;
}

export function ReportsPage() {
  const [data, setData] = useState<Summary | null>(null);
  const [error, setError] = useState('');
  useEffect(() => { api<Summary>('/reports/summary').then(setData).catch((e) => setError(e.message)); }, []);
  if (error) return <ErrorNotice message={error} />;
  if (!data) return <LoadingBlock />;
  return <div className="page">
    <PageHeader title="รายงานและหลักฐาน" description="สรุปผลการกำกับดูแลและส่งออกข้อมูลสำหรับรายงานผู้บริหารหรือการตรวจสอบ" />
    <section className="report-grid">
      <article className="panel report-hero"><ShieldCheck/><div><span>ผลการปฏิบัติตามมาตรการ</span><strong>{data.complianceRate}%</strong><small>ประมวลผล ณ {new Date(data.generatedAt).toLocaleString('th-TH')}</small></div></article>
      <article className="panel report-stat"><FileCheck2/><div><strong>{data.requests}</strong><span>คำขอทั้งหมด</span></div></article>
      <article className="panel report-stat"><FolderOpen/><div><strong>{data.evidenceFiles}</strong><span>หลักฐานที่เชื่อมโยง</span></div></article>
    </section>
    <section className="panel">
      <div className="panel-heading"><div><h2>ชุดรายงานมาตรฐาน</h2><p>ไฟล์ CSV เปิดด้วย Microsoft Excel หรือ Google Sheets ได้</p></div></div>
      <div className="export-list">
        {[
          ['requests','ทะเบียนคำขอและผลการพิจารณา','คำขอ เจ้าของงาน ระดับข้อมูล ความเสี่ยง และสถานะ'],
          ['registers','ทะเบียนสินทรัพย์ดิจิทัล','เครื่องมือ AI ระบบ ชุดข้อมูล ผู้ให้บริการ และบัญชีผู้ดูแล'],
          ['risks','ทะเบียนความเสี่ยง','คะแนน มาตรการควบคุม เจ้าของความเสี่ยง และกำหนดแล้วเสร็จ'],
          ['incidents','ทะเบียนเหตุการณ์','ระดับเหตุ การตอบสนอง ผู้แจ้ง และสถานะการแก้ไข'],
          ['audit','ประวัติการตรวจสอบระบบ','ผู้ดำเนินการ กิจกรรม เวลา และรายการที่เกี่ยวข้อง'],
        ].map(([type,title,description]) => <article key={type}><div><strong>{title}</strong><p>{description}</p></div><button className="button secondary" onClick={() => downloadFile(`/reports/export/${type}`, `psuwit-${type}.csv`).catch((e)=>setError(e.message))}><Download size={17}/>ดาวน์โหลด</button></article>)}
      </div>
    </section>
  </div>;
}
