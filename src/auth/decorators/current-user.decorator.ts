import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";

export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
  
    if (!user) throw new InternalServerErrorException('No se ha encontrado el usuario en la petición');
    
    return (!data ? user : user[data])
  }
);