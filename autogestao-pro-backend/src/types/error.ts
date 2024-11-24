// src/types/error.ts
export interface AppErrorType extends Error {
    message: string;
    stack?: string;
    code?: string;
    status?: number;
  }