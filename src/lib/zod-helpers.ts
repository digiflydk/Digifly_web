
import { z, ZodError, ZodIssue } from 'zod';

// Helper to extract Zod issues from any error type
export function zodErrorToIssues(error: unknown): ZodIssue[] {
  if (error instanceof ZodError) {
    return error.issues;
  }
  return [];
}
