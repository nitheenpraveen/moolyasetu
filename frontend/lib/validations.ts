import { z } from 'zod';

// This script runs on the server and crashes the build 
// if a secret is missing, preventing a "broken/insecure" deploy.
const envSchema = z.object({
  AMAZON_TRACKING_ID: z.string().min(1),
  EBAY_APP_ID: z.string().min(1),
  NODE_ENV: z.enum(['development', 'production', 'test']),
});

export const env = envSchema.parse(process.env);
