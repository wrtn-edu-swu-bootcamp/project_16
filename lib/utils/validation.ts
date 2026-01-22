import { z } from 'zod'

export const tweetUrlSchema = z
  .string()
  .url()
  .regex(/(twitter\.com|x\.com)\/\w+\/status\/\d+/, 'Invalid tweet URL')

export const wordSchema = z.object({
  lemma: z.string().min(1).max(100),
  original: z.string().min(1).max(100),
  language: z.enum(['EN', 'JA', 'ZH']),
  partOfSpeech: z.enum(['NOUN', 'VERB', 'ADJECTIVE', 'ADVERB']),
  translation: z.string().min(1),
  definition: z.string().optional(),
  ipaNotation: z.string().optional(),
  hangulNotation: z.string().optional(),
  example: z.string()
})
