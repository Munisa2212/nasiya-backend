import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/decorators/rbuc.decorators';

@Injectable()
export class RbucGuard implements CanActivate {

  constructor(private readonly reflector: Reflector){}

  canActivate(context: ExecutionContext): boolean{
    const roles = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ])

    const req = context.switchToHttp().getRequest()

    if(!roles.length){
      return true
    }

    if(roles.includes(req["user-role"])){
      return true
    }else{
      throw new UnauthorizedException("You don't have access")
    }
  }
}