import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

if (!process.env.OPENAI_API_KEY) {
  console.error('❌ Missing OPENAI_API_KEY in environment variables')
  console.error('   Please add OPENAI_API_KEY to your .env.local file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

interface EmbeddingResult {
  mode: string
  result: {
    success: number
    failed: number
    total: number
    errors: string[]
    cost_estimate: number
    tokens_used: number
  }
  message: string
}

/**
 * Call the generate-embeddings Edge Function
 */
async function callEmbeddingFunction(
  mode: 'batch' | 'single',
  options: { chunkId?: string; limit?: number; offset?: number } = {}
): Promise<EmbeddingResult> {
  const { data, error } = await supabase.functions.invoke('generate-embeddings', {
    body: {
      mode,
      ...options,
    },
  })

  if (error) {
    throw new Error(`Edge Function error: ${error.message}`)
  }

  return data
}

/**
 * Generate embeddings for all chunks without embeddings
 */
async function generateAllEmbeddings() {
  console.log('🚀 Starting embedding generation for all chunks...\n')

  // First, count how many chunks need embeddings
  const { count: totalCount, error: countError } = await supabase
    .from('content_chunks')
    .select('*', { count: 'exact', head: true })
    .is('embedding', null)

  if (countError) {
    throw new Error(`Failed to count chunks: ${countError.message}`)
  }

  console.log(`📊 Total chunks without embeddings: ${totalCount}\n`)

  if (totalCount === 0) {
    console.log('✅ All chunks already have embeddings!')
    return
  }

  const BATCH_SIZE = 100
  let offset = 0
  let totalSuccess = 0
  let totalFailed = 0
  let totalCost = 0
  let totalTokens = 0
  const allErrors: string[] = []

  while (offset < totalCount!) {
    const batchNumber = Math.floor(offset / BATCH_SIZE) + 1
    const totalBatches = Math.ceil(totalCount! / BATCH_SIZE)

    console.log(`📦 Processing batch ${batchNumber}/${totalBatches} (offset: ${offset})`)

    try {
      const result = await callEmbeddingFunction('batch', {
        limit: BATCH_SIZE,
        offset,
      })

      totalSuccess += result.result.success
      totalFailed += result.result.failed
      totalCost += result.result.cost_estimate
      totalTokens += result.result.tokens_used
      allErrors.push(...result.result.errors)

      console.log(`   ✅ Success: ${result.result.success}`)
      console.log(`   ❌ Failed: ${result.result.failed}`)
      console.log(`   💰 Cost: $${result.result.cost_estimate.toFixed(6)}`)
      console.log(`   📝 Tokens: ${result.result.tokens_used}`)

      if (result.result.errors.length > 0) {
        console.log(`   ⚠️  Errors:`)
        result.result.errors.forEach((error) => {
          console.log(`      - ${error}`)
        })
      }

      console.log()

      // If we processed fewer than BATCH_SIZE, we're done
      if (result.result.total < BATCH_SIZE) {
        break
      }

      offset += BATCH_SIZE

      // Add a small delay between batches to avoid rate limits
      if (offset < totalCount!) {
        console.log('⏳ Waiting 2 seconds before next batch...\n')
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }
    } catch (error) {
      console.error(`❌ Batch ${batchNumber} failed:`, error)
      allErrors.push(
        `Batch ${batchNumber} error: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
      break
    }
  }

  console.log('='.repeat(60))
  console.log('📊 Embedding Generation Summary:')
  console.log(`  Total chunks processed: ${totalSuccess + totalFailed}`)
  console.log(`  Successfully embedded: ${totalSuccess}`)
  console.log(`  Failed: ${totalFailed}`)
  console.log(`  Total tokens used: ${totalTokens.toLocaleString()}`)
  console.log(`  Total cost: $${totalCost.toFixed(6)}`)
  console.log(`  Success rate: ${((totalSuccess / (totalSuccess + totalFailed)) * 100).toFixed(2)}%`)

  if (allErrors.length > 0) {
    console.log(`\n⚠️  Errors encountered (${allErrors.length}):`)
    allErrors.forEach((error, index) => {
      console.log(`  ${index + 1}. ${error}`)
    })
  }

  console.log('='.repeat(60))
  console.log('\n✨ Embedding generation complete!')
}

// Run the embedding generation
generateAllEmbeddings()
  .then(() => {
    console.log('✅ Script completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Script failed:', error)
    process.exit(1)
  })
