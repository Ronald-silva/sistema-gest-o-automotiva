// src/types/express.d.ts
declare namespace Express {
    interface Request {
      files?: Array<Multer.File>;
    }
  }