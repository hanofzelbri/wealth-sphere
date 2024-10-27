import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }

  canActivate(context: ExecutionContext) {
    try {
      const request = context.switchToHttp().getRequest();
      const token = request.headers.authorization.split('Bearer ').pop();
      const user = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);

      request['user'] = { userId: user.sub };
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }
}
