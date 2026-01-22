interface DictionaryEntry {
  word: string
  phonetic?: string
  phonetics?: Array<{
    text?: string
    audio?: string
  }>
  meanings?: Array<{
    partOfSpeech: string
    definitions: Array<{
      definition: string
      example?: string
    }>
  }>
}

export async function getDictionaryEntry(
  word: string,
  language: string
): Promise<DictionaryEntry | null> {
  // Free Dictionary API only supports English
  if (language !== 'EN') {
    return null
  }

  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`
    )

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    if (Array.isArray(data) && data.length > 0) {
      return data[0]
    }

    return null
  } catch (error) {
    console.error('Dictionary API error:', error)
    return null
  }
}

export async function getDefinition(word: string, language: string): Promise<string | undefined> {
  const entry = await getDictionaryEntry(word, language)
  
  if (entry && entry.meanings && entry.meanings.length > 0) {
    const firstMeaning = entry.meanings[0]
    if (firstMeaning.definitions && firstMeaning.definitions.length > 0) {
      return firstMeaning.definitions[0].definition
    }
  }

  return undefined
}

export async function getPronunciation(word: string, language: string): Promise<{
  ipa?: string
  audio?: string
} | null> {
  const entry = await getDictionaryEntry(word, language)
  
  if (entry) {
    const pronunciation: { ipa?: string; audio?: string } = {}
    
    if (entry.phonetic) {
      pronunciation.ipa = entry.phonetic
    }
    
    if (entry.phonetics && entry.phonetics.length > 0) {
      const phoneticWithAudio = entry.phonetics.find(p => p.audio)
      if (phoneticWithAudio) {
        pronunciation.audio = phoneticWithAudio.audio
        if (phoneticWithAudio.text) {
          pronunciation.ipa = phoneticWithAudio.text
        }
      } else if (entry.phonetics[0].text) {
        pronunciation.ipa = entry.phonetics[0].text
      }
    }
    
    return pronunciation
  }

  return null
}
