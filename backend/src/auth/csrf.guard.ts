import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class CsrfGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (['GET','HEAD','OPTIONS'].includes(request.method) || String(request.path).includes('/auth/') || String(request.headers.authorization||'').startsWith('Bearer ')) return true;
    if (!request.cookies?.psuwit_csrf || request.cookies.psuwit_csrf !== request.headers['x-csrf-token']) throw new ForbiddenException('CSRF token ไม่ถูกต้อง');
    return true;
  }
}
