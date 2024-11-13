// src/types/global.d.ts
declare global {
    namespace NodeJS {
      interface ProcessEnv {
        NODE_ENV: 'development' | 'production' | 'test';
        PORT: string;
        MONGODB_URI: string;
        JWT_SECRET: string;
        LOG_LEVEL?: 'error' | 'warn' | 'info' | 'debug';
      }
    }
  
    namespace Express {
      interface Request {
        user?: {
          id: string;
          role: string;
          name: string;
          email: string;
        };
      }
    }
  }
  
  export {};