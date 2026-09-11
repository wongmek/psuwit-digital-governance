import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import type { AuthenticatedRequest } from '../common/types';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}
  private setCookies(res: Response, user: Awaited<ReturnType<AuthService['demoLogin']>>) {
    const production = process.env.NODE_ENV === 'production';
    const token=this.auth.sign(user),csrf=this.auth.csrf();
    res.cookie('psuwit_session', token, { httpOnly:true, secure:production, sameSite:production?'none':'lax', maxAge:8*60*60*1000, path:'/' });
    res.cookie('psuwit_csrf', csrf, { httpOnly:false, secure:production, sameSite:production?'none':'lax', maxAge:8*60*60*1000, path:'/' });
    return { user, token, csrf };
  }
  @Post('google') async google(@Body('credential') credential: string, @Res({passthrough:true}) res: Response) { return this.setCookies(res, await this.auth.googleLogin(credential)); }
  @Post('demo') async demo(@Res({passthrough:true}) res: Response) { return this.setCookies(res, await this.auth.demoLogin()); }
  @Get('me') me(@Req() req: AuthenticatedRequest) { return { user:req.user }; }
  @Post('logout') logout(@Req() _req: Request, @Res({passthrough:true}) res: Response) { res.clearCookie('psuwit_session'); res.clearCookie('psuwit_csrf'); return { ok:true }; }
}
