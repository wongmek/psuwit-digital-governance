import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles';
@Injectable()
export class RolesGuard implements CanActivate{
  constructor(private readonly reflector:Reflector){}
  canActivate(context:ExecutionContext){const required=this.reflector.getAllAndOverride<string[]>(ROLES_KEY,[context.getHandler(),context.getClass()]);if(!required?.length)return true;const roles=context.switchToHttp().getRequest().user?.roles||[];if(!required.some((r)=>roles.includes(r)))throw new ForbiddenException('ไม่มีสิทธิ์ดำเนินการรายการนี้');return true;}
}
