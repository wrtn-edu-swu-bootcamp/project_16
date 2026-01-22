import { Client } from '@notionhq/client'
import { decrypt } from '../utils/encryption'
import { prisma } from '../db/prisma'

export async function getNotionClient(userId: string): Promise<Client | null> {
  const integration = await prisma.notionIntegration.findUnique({
    where: { userId }
  })

  if (!integration || !integration.isActive) {
    return null
  }

  const accessToken = decrypt(integration.accessToken)
  return new Client({ auth: accessToken })
}

export async function syncWordToNotion(
  userId: string,
  word: {
    lemma: string
    translation: string
    pronunciation?: string
    example: string
    language: string
    partOfSpeech: string
    tweetUrl?: string
  }
) {
  const integration = await prisma.notionIntegration.findUnique({
    where: { userId }
  })

  if (!integration || !integration.isActive || !integration.databaseId) {
    throw new Error('NOTION_NOT_CONNECTED')
  }

  const accessToken = decrypt(integration.accessToken)
  const notion = new Client({ auth: accessToken })

  // Check for duplicates using queryDatabase method from @notionhq/client
  const queryResponse: any = await (notion.databases as any).query({
    database_id: integration.databaseId,
    filter: {
      property: '단어',
      title: {
        equals: word.lemma
      }
    }
  })

  if (queryResponse.results.length > 0) {
    // Update existing page
    const pageId = queryResponse.results[0].id
    await notion.pages.update({
      page_id: pageId,
      properties: {
        '뜻': {
          rich_text: [{ text: { content: word.translation } }]
        },
        '발음': word.pronunciation
          ? {
              rich_text: [{ text: { content: word.pronunciation } }]
            }
          : { rich_text: [] },
        '예문': {
          rich_text: [{ text: { content: word.example } }]
        }
      }
    })
  } else {
    // Create new page
    await notion.pages.create({
      parent: { database_id: integration.databaseId },
      properties: {
        '단어': {
          title: [{ text: { content: word.lemma } }]
        },
        '뜻': {
          rich_text: [{ text: { content: word.translation } }]
        },
        '발음': word.pronunciation
          ? {
              rich_text: [{ text: { content: word.pronunciation } }]
            }
          : { rich_text: [] },
        '예문': {
          rich_text: [{ text: { content: word.example } }]
        },
        '언어': {
          select: { name: getLanguageName(word.language) }
        },
        '품사': {
          select: { name: getPartOfSpeechName(word.partOfSpeech) }
        },
        '출처': word.tweetUrl
          ? {
              url: word.tweetUrl
            }
          : { url: '' },
        '학습 날짜': {
          date: { start: new Date().toISOString() }
        },
        '상태': {
          select: { name: '학습중' }
        }
      }
    })
  }

  // Update last sync time
  await prisma.notionIntegration.update({
    where: { userId },
    data: { lastSyncAt: new Date() }
  })
}

function getLanguageName(lang: string): string {
  const map: Record<string, string> = {
    EN: '영어',
    JA: '일본어',
    ZH: '중국어',
    KO: '한국어'
  }
  return map[lang] || lang
}

function getPartOfSpeechName(pos: string): string {
  const map: Record<string, string> = {
    NOUN: '명사',
    VERB: '동사',
    ADJECTIVE: '형용사',
    ADVERB: '부사'
  }
  return map[pos] || pos
}
