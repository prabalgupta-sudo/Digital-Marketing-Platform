import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class MultiTenantMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // In a real scenario, we would verify the Octa ID / JWT here
    // For this demo, we extract a 'tenant-id' or 'octa-id' from headers
    const octaId = req.headers['x-octa-id'] as string;
    
    if (!octaId) {
      // For demo purposes, we'll default to a 'guest' tenant if not provided,
      // but in production, this would throw an error.
      req['tenantId'] = 'default-tenant';
    } else {
      req['tenantId'] = octaId;
    }
    
    next();
  }
}
