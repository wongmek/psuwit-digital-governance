import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly auth: AuthService) {}
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const path = request.path || request.url;
    if (request.method === 'OPTIONS' || ['/api/health','/api/auth/google','/api/auth/demo'].some((p) => path === p || path.endsWith(p.replace('/api','')))) return true;
    const authorization=String(request.headers.authorization||'');
    const token = authorization.startsWith('Bearer ')?authorization.slice(7):request.cookies?.psuwit_session;
    if (!token) throw new UnauthorizedException('กรุณาเข้าสู่ระบบ');
    request.user = this.auth.verify(token);
    return true;
  }
}
