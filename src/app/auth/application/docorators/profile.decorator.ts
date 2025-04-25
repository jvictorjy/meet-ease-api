import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetProfile = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const profile = request.user?.profile;

    if (!profile) {
      return null;
    }

    return data ? profile[data] : profile;
  },
);

export const GetUserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.userId;
  },
);
