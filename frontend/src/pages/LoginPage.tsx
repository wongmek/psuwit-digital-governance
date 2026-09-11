import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, LockKeyhole, ShieldCheck } from 'lucide-react';
import { useAuth } from '../state/AuthContext';

declare global {
  interface Window {
    google?: { accounts: { id: { initialize: (options: object) => void; renderButton: (element: HTMLElement, options: object) => void } } };
  }
}

export function LoginPage() {
  const { loginWithGoogle, loginDemo } = useAuth();
  const googleButton = useRef<HTMLDivElement>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const demo = import.meta.env.VITE_DEMO_MODE === 'true';

  useEffect(() => {
    if (!clientId) return;
    const render = () => {
      if (!window.google || !googleButton.current) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async ({ credential }: { credential: string }) => {
          try { setBusy(true); setError(''); await loginWithGoogle(credential); }
          catch (e) { setError(e instanceof Error ? e.message : 'ไม่สามารถเข้าสู่ระบบได้'); }
          finally { setBusy(false); }
        },
      });
      window.google.accounts.id.renderButton(googleButton.current, { theme: 'outline', size: 'large', width: 320, text: 'signin_with' });
    };
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = render;
    document.head.appendChild(script);
    return () => script.remove();
  }, [clientId, loginWithGoogle]);

  async function handleDemo() {
    try { setBusy(true); setError(''); await loginDemo(); }
    catch (e) { setError(e instanceof Error ? e.message : 'ไม่สามารถเปิดระบบสาธิตได้'); }
    finally { setBusy(false); }
  }

  return (
    <main className="login-page">
      <section className="login-intro">
        <div className="login-school">โรงเรียน มอ.วิทยานุสรณ์</div>
        <h1>ระบบบริหารการกำกับดูแล<br/><span>เทคโนโลยีดิจิทัล</span></h1>
        <p>ศูนย์กลางการกำกับดูแลปัญญาประดิษฐ์ ข้อมูล ระบบดิจิทัล และความมั่นคงปลอดภัยไซเบอร์</p>
        <div className="login-points">
          <div><CheckCircle2 /><span>รับเรื่อง ประเมิน และอนุมัติในระบบเดียว</span></div>
          <div><ShieldCheck /><span>ติดตามความเสี่ยง เหตุการณ์ และหลักฐาน</span></div>
          <div><LockKeyhole /><span>จำกัดสิทธิ์ด้วยบัญชี Google Workspace</span></div>
        </div>
      </section>
      <section className="login-panel">
        <div className="login-card">
          <div className="login-logo">DG</div>
          <h2>เข้าสู่ระบบ</h2>
          <p>ใช้บัญชีบุคลากรของโรงเรียน <strong>@psuwit.ac.th</strong></p>
          {clientId ? <div ref={googleButton} className="google-button" /> : <div className="setup-hint">กรุณากำหนด VITE_GOOGLE_CLIENT_ID เพื่อเปิด Google Login</div>}
          {demo && <button className="button secondary full" disabled={busy} onClick={handleDemo}>{busy ? 'กำลังเข้าสู่ระบบ...' : 'เข้าใช้ระบบสาธิต'}</button>}
          {error && <div className="error-notice">{error}</div>}
          <small>การเข้าใช้งานถือว่าผู้ใช้ยอมรับแนวปฏิบัติด้าน AI ข้อมูล และความมั่นคงปลอดภัยของโรงเรียน</small>
        </div>
      </section>
    </main>
  );
}
