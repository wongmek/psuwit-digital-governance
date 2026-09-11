import { Body, Controller, Get, Param, Put, Req } from '@nestjs/common';
import { Roles } from '../auth/roles';
import type { AuthenticatedRequest } from '../common/types';
import { StoreService } from '../store/store.service';

@Roles('DIRECTOR')
@Controller('admin')
export class AdminController{
  constructor(private readonly store:StoreService){}
  @Get('users')async users(){return{items:await this.store.listUsers()};}
  @Put('users/:id/roles')async roles(@Param('id')id:string,@Body('roles')roles:string[],@Req()req:AuthenticatedRequest){return{item:await this.store.setRoles(id,roles||['USER'],req.user)};}
  @Get('settings')async settings(){return{settings:await this.store.getSettings()};}
  @Put('settings')async save(@Body()body:any,@Req()req:AuthenticatedRequest){return{settings:await this.store.saveSettings(body,req.user)};}
}
