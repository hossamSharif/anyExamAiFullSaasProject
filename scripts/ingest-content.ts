import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

interface ContentPiece {
  content: string
  difficulty: string
}

interface Topic {
  name: string
  content: string[]
  difficulty: string
}

interface Subject {
  name: string
  topics: Topic[]
}

interface ContentData {
  subjects: Subject[]
}

// Difficulty mapping
const difficultyLevels = ['easy', 'medium', 'hard'] as const
type Difficulty = typeof difficultyLevels[number]

/**
 * Chunk Arabic content preserving word boundaries
 * Each paragraph is treated as a separate chunk to preserve context
 */
function chunkContent(content: string[], maxChunkSize: number = 500): string[] {
  const chunks: string[] = []

  for (const paragraph of content) {
    // If paragraph is smaller than max size, use it as is
    if (paragraph.length <= maxChunkSize) {
      chunks.push(paragraph.trim())
      continue
    }

    // Otherwise, split by sentences (Arabic sentences end with .)
    const sentences = paragraph.split('.')
    let currentChunk = ''

    for (const sentence of sentences) {
      const trimmed = sentence.trim()
      if (!trimmed) continue

      // If adding this sentence would exceed max size, save current chunk and start new
      if (currentChunk && (currentChunk.length + trimmed.length + 1) > maxChunkSize) {
        chunks.push(currentChunk.trim())
        currentChunk = trimmed + '.'
      } else {
        currentChunk += (currentChunk ? ' ' : '') + trimmed + '.'
      }
    }

    // Add remaining chunk
    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim())
    }
  }

  return chunks
}

/**
 * Validate Arabic text
 */
function validateArabicContent(content: string): boolean {
  // Check if content contains Arabic characters
  const arabicRegex = /[\u0600-\u06FF]/
  return arabicRegex.test(content) && content.trim().length > 10
}

/**
 * Clean and normalize Arabic text
 */
function cleanArabicText(text: string): string {
  // Remove extra whitespace
  return text
    .replace(/\s+/g, ' ')
    .trim()
    // Normalize Arabic characters
    .replace(/[ًٌٍَُِّْ]/g, '') // Remove tashkeel (optional)
}

async function ingestContent() {
  console.log('🚀 Starting Arabic content ingestion...')

  // Read the JSON file
  const dataPath = path.join(__dirname, 'data', 'arabic-content.json')
  const rawData = fs.readFileSync(dataPath, 'utf-8')
  const data: ContentData = JSON.parse(rawData)

  console.log(`📚 Found ${data.subjects.length} subjects`)

  let totalChunks = 0
  let successfulChunks = 0
  let failedChunks = 0

  // Process each subject
  for (const subject of data.subjects) {
    console.log(`\n📖 Processing subject: ${subject.name}`)

    for (const topic of subject.topics) {
      console.log(`  📝 Processing topic: ${topic.name}`)

      // Chunk the content
      const chunks = chunkContent(topic.content)
      console.log(`    ✂️  Created ${chunks.length} chunks`)

      // Insert each chunk into the database
      for (const chunk of chunks) {
        totalChunks++

        // Validate content
        if (!validateArabicContent(chunk)) {
          console.warn(`    ⚠️  Skipping invalid chunk`)
          failedChunks++
          continue
        }

        // Clean content
        const cleanedContent = cleanArabicText(chunk)

        // Prepare chunk data
        const chunkData = {
          content: cleanedContent,
          subject: subject.name,
          topic: topic.name,
          metadata: {
            difficulty: topic.difficulty,
            source: 'curated',
            chunk_index: chunks.indexOf(chunk)
          },
          language: 'ar'
          // embedding will be null initially, will be filled by Story 2.2
        }

        // Insert into database
        const { error } = await supabase
          .from('content_chunks')
          .insert(chunkData)

        if (error) {
          console.error(`    ❌ Error inserting chunk: ${error.message}`)
          failedChunks++
        } else {
          successfulChunks++
        }
      }

      console.log(`    ✅ Inserted ${chunks.length} chunks for topic: ${topic.name}`)
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('📊 Ingestion Summary:')
  console.log(`  Total chunks processed: ${totalChunks}`)
  console.log(`  Successfully inserted: ${successfulChunks}`)
  console.log(`  Failed: ${failedChunks}`)
  console.log(`  Success rate: ${((successfulChunks / totalChunks) * 100).toFixed(2)}%`)
  console.log('='.repeat(60))
  console.log('\n✨ Content ingestion complete!')
}

// Run the ingestion
ingestContent()
  .then(() => {
    console.log('✅ Script completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Script failed:', error)
    process.exit(1)
  })
