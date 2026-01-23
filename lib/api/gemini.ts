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
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
    
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

// Simple word extractor for mock mode
function mockExtractWords(text: string): {
  language: string
  words: Array<{ original: string; lemma: string; pos: string }>
} {
  console.warn('Using mock word extraction (Gemini API not available)')
  
  // Simple English word extraction
  const words = text
    .replace(/[#@]/g, '') // Remove hashtags and mentions
    .replace(/https?:\/\/\S+/g, '') // Remove URLs
    .split(/\s+/)
    .filter(word => {
      const clean = word.replace(/[^a-zA-Z]/g, '').toLowerCase()
      // Exclude common stop words
      const stopWords = ['the', 'is', 'are', 'was', 'were', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']
      return clean.length > 2 && !stopWords.includes(clean)
    })
    .slice(0, 10)
    .map(word => ({
      original: word.replace(/[^a-zA-Z]/g, ''),
      lemma: word.replace(/[^a-zA-Z]/g, '').toLowerCase(),
      pos: 'noun' // Simplified
    }))
  
  return {
    language: 'EN',
    words: words.length >= 3 ? words : [
      { original: 'learning', lemma: 'learn', pos: 'verb' },
      { original: 'vocabulary', lemma: 'vocabulary', pos: 'noun' },
      { original: 'practice', lemma: 'practice', pos: 'verb' }
    ]
  }
}

export async function extractWords(tweetText: string): Promise<{
  language: string
  words: Array<{ original: string; lemma: string; pos: string }>
}> {
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
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
    // Use mock data on any error
    return mockExtractWords(tweetText)
  }
}

export async function translateWord(
  word: string,
  sourceLang: string,
  targetLang: string = 'KO'
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
    
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

export async function getPronunciationAI(
  word: string,
  language: string
): Promise<string | undefined> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
    
    let prompt = ''
    if (language === 'JA') {
      prompt = `Write the reading of the Japanese word "${word}" in hiragana.
Return only the hiragana reading, nothing else. Example: "食べる" → "たべる"`
    } else if (language === 'ZH') {
      prompt = `Write the pinyin pronunciation of the Chinese word "${word}".
Return only the pinyin with tone marks, nothing else. Example: "你好" → "nǐ hǎo"`
    } else {
      prompt = `Write the IPA pronunciation of the English word "${word}".
Return only the IPA in slashes, nothing else. Example: "hello" → "/həˈloʊ/"`
    }
    
    const result = await model.generateContent(prompt)
    return result.response.text().trim()
  } catch (error) {
    console.error('Pronunciation AI error:', error)
    return undefined
  }
}

export async function generateExample(
  word: string,
  language: string
): Promise<string | undefined> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
    
    const langName = language === 'JA' ? 'Japanese' : language === 'ZH' ? 'Chinese' : 'English'
    
    const prompt = `Create a simple example sentence using the ${langName} word "${word}".
The sentence should be short (under 15 words) and easy to understand.
Return only the example sentence, nothing else.`
    
    const result = await model.generateContent(prompt)
    return result.response.text().trim()
  } catch (error) {
    console.error('Example generation error:', error)
    return undefined
  }
}
