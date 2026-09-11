import type { ReactNode } from 'react';
import { Search } from 'lucide-react';

const statusMap: Record<string, string> = {
  DRAFT: 'ฉบับร่าง', SUBMITTED: 'รอตรวจสอบ', REVIEWING: 'อยู่ระหว่างประเมิน',
  NEED_INFO: 'ขอข้อมูลเพิ่มเติม', PENDING_APPROVAL: 'รออนุมัติ', APPROVED: 'อนุมัติ',
  APPROVED_WITH_CONDITIONS: 'อนุมัติแบบมีเงื่อนไข', REJECTED: 'ไม่อนุมัติ',
  ACTIVE: 'เปิดใช้งาน', SUSPENDED: 'ระงับใช้งาน', CLOSED: 'ปิดงาน',
  OPEN: 'เปิดรายการ', IN_PROGRESS: 'กำลังดำเนินการ', RESOLVED: 'แก้ไขแล้ว',
  LOW: 'ต่ำ', MEDIUM: 'ปานกลาง', HIGH: 'สูง', CRITICAL: 'วิกฤต',
};

export function StatusBadge({ value }: { value: string }) {
  return <span className={`status status-${value.toLowerCase()}`}>{statusMap[value] || value}</span>;
}

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return <header className="page-header"><div><h1>{title}</h1>{description && <p>{description}</p>}</div>{action}</header>;
}

export function SearchBox({ value, onChange, placeholder = 'ค้นหา...' }: { value: string; onChange: (value: string) => void; placeholder?: string }) {
  return <label className="search-box"><Search size={18} /><input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} /></label>;
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return <div className="empty-state"><DatabaseIcon /><strong>{title}</strong><p>{description}</p></div>;
}

function DatabaseIcon() {
  return <svg viewBox="0 0 48 48" width="48" height="48" aria-hidden="true"><ellipse cx="24" cy="10" rx="16" ry="6" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M8 10v13c0 3.3 7.2 6 16 6s16-2.7 16-6V10M8 23v13c0 3.3 7.2 6 16 6s16-2.7 16-6V23" fill="none" stroke="currentColor" strokeWidth="2"/></svg>;
}

export function LoadingBlock() {
  return <div className="loading-block"><div className="spinner" /><span>กำลังโหลดข้อมูล...</span></div>;
}

export function ErrorNotice({ message }: { message: string }) {
  return <div className="error-notice" role="alert">{message}</div>;
}
