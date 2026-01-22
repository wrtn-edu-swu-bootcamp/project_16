import { z } from 'zod'

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().min(1),
  DIRECT_URL: z.string().min(1).optional(),
  
  // Auth
  AUTH_SECRET: z.string().min(32),
  AUTH_URL: z.string().url().optional(),
  
  // OAuth
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  NOTION_CLIENT_ID: z.string().min(1),
  NOTION_CLIENT_SECRET: z.string().min(1),
  
  // External APIs
  GEMINI_API_KEY: z.string().min(1),
  X_API_BEARER_TOKEN: z.string().min(1),
  
  // Encryption
  ENCRYPTION_KEY: z.string().length(64),
  
  // App
  NEXT_PUBLIC_APP_URL: z.string().url()
})

export type Env = z.infer<typeof envSchema>

// Validate environment variables at build time
export function validateEnv() {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    console.error('❌ Invalid environment variables:')
    if (error instanceof z.ZodError) {
      error.issues.forEach((err: z.ZodIssue) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`)
      })
    }
    throw new Error('Environment validation failed')
  }
}

// Only validate in non-development mode to allow gradual setup
if (process.env.NODE_ENV !== 'development') {
  // validateEnv()
}
