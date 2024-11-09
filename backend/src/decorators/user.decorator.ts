import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { z } from 'zod';

const userSchema = z.object({
  userId: z.string().uuid(),
});

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    const parsedUser = userSchema.safeParse(user);
    if (!parsedUser.success) {
      throw new Error('Invalid user data ' + parsedUser.error.message);
    }

    return parsedUser.data.userId;
  },
);
