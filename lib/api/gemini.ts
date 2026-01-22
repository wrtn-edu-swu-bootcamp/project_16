import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export const WORD_EXTRACTION_PROMPT = `
You are a language learning assistant. Analyze the tweet and extract vocabulary suitable for language learners.

Tweet: "{tweetText}"

Instructions:
1. Detect the language (EN, JA, or ZH)
2. Extract important words:
   - Include: nouns, verbs, adjectives, adverbs
   - Exclude: articles (a, an, the), prepositions (in, on, at), conjunctions (and, but, or), basic pronouns (I, you, he, she, it)
   - For each word, identify its base form (lemma)
3. For hashtags, remove # and treat as regular words
4. Ignore mentions (@username), emojis, numbers, URLs

Return JSON format:
{
  "language": "EN" | "JA" | "ZH",
  "words": [
    {
      "original": "reading",
      "lemma": "read",
      "pos": "verb"
    }
  ]
}

Requirements:
- Extract 3-15 words
- If less than 3 words, return empty array
- Prioritize context-relevant vocabulary
`

export async function detectLanguage(text: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })
    
    const prompt = `Detect the language of this text. Return only one of: EN, JA, ZH, KO
    
Text: "${text}"

Return ONLY the language code, nothing else.`
    
    const result = await model.generateContent(prompt)
    const response = result.response.text().trim()
    return response
  } catch (error) {
    console.error('Language detection error:', error)
    throw new Error('LANGUAGE_DETECTION_FAILED')
  }
}

export async function extractWords(tweetText: string): Promise<{
  language: string
  words: Array<{ original: string; lemma: string; pos: string }>
}> {
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        responseMimeType: 'application/json'
      }
    })
    
    const prompt = WORD_EXTRACTION_PROMPT.replace('{tweetText}', tweetText)
    
    const result = await model.generateContent(prompt)
    const response = result.response.text()
    const data = JSON.parse(response)
    
    if (!data.words || data.words.length < 3) {
      throw new Error('INSUFFICIENT_WORDS')
    }
    
    return data
  } catch (error) {
    console.error('Word extraction error:', error)
    throw error
  }
}

export async function translateWord(
  word: string,
  sourceLang: string,
  targetLang: string = 'KO'
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })
    
    const prompt = `Translate the word "${word}" from ${sourceLang} to ${targetLang}.
Provide the most common 1-2 meanings, separated by commas.
Return only the translation, no explanation.`
    
    const result = await model.generateContent(prompt)
    return result.response.text().trim()
  } catch (error) {
    console.error('Translation error:', error)
    throw new Error('TRANSLATION_FAILED')
  }
}
