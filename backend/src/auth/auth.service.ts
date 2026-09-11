import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'node:crypto';
import { StoreService } from '../store/store.service';
import type { SessionUser } from '../common/types';

@Injectable()
export class AuthService {
  private readonly google = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  constructor(private readonly store: StoreService) {}
  async googleLogin(credential: string) {
    if (!process.env.GOOGLE_CLIENT_ID) throw new UnauthorizedException('ยังไม่ได้ตั้งค่า Google Client ID');
    const ticket = await this.google.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID });
    const profile = ticket.getPayload();
    if (!profile?.email || !profile.email_verified) throw new UnauthorizedException('ไม่สามารถยืนยันบัญชี Google ได้');
    const domain = process.env.ALLOWED_GOOGLE_DOMAIN || 'psuwit.ac.th';
    if (!profile.email.toLowerCase().endsWith(`@${domain.toLowerCase()}`)) throw new ForbiddenException(`อนุญาตเฉพาะบัญชี @${domain}`);
    return this.store.upsertUser({ email: profile.email, name: profile.name || profile.email, department: 'ยังไม่ระบุ', roles: ['USER'] });
  }
  async demoLogin() {
    if (process.env.DEMO_MODE !== 'true') throw new ForbiddenException('ไม่ได้เปิดโหมดสาธิต');
    return this.store.getDemoAdmin();
  }
  sign(user: SessionUser) {
    return jwt.sign(user, process.env.JWT_SECRET || 'demo-only-secret-change-before-production', { expiresIn: '8h', issuer: 'psuwit-governance' });
  }
  verify(token: string) {
    try { return jwt.verify(token, process.env.JWT_SECRET || 'demo-only-secret-change-before-production', { issuer: 'psuwit-governance' }) as SessionUser; }
    catch { throw new UnauthorizedException('เซสชันหมดอายุ กรุณาเข้าสู่ระบบอีกครั้ง'); }
  }
  csrf() { return randomBytes(24).toString('hex'); }
}
