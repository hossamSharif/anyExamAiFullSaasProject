# anyExamAi Content Ingestion Scripts

This directory contains scripts for ingesting and managing Arabic educational content in the anyExamAi database.

## Setup

1. Install dependencies:
```bash
cd scripts
pnpm install
```

2. Ensure your `.env.local` file in the project root has the required Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key (optional, for admin operations)
```

## Available Scripts

### Content Ingestion

Ingest Arabic educational content from `data/arabic-content.json` into the database:

```bash
pnpm ingest
```

This script will:
- Read Arabic content from the JSON file
- Chunk content preserving Arabic word boundaries
- Validate and clean Arabic text
- Insert chunks into the `content_chunks` table
- Display progress and summary statistics

### Data Structure

The `data/arabic-content.json` file contains:
- **10 subjects** in Arabic (الرياضيات، الفيزياء، الكيمياء، etc.)
- Multiple **topics** per subject
- Multiple **content pieces** per topic
- **Difficulty levels**: easy, medium, hard

## Content Chunking

The ingestion script implements intelligent chunking for Arabic text:
- Preserves paragraph boundaries when possible
- Splits by sentences (.) when paragraphs are too long
- Maximum chunk size: 500 characters (configurable)
- Maintains context and readability

## Validation

All content is validated before insertion:
- Must contain Arabic characters (Unicode range U+0600-U+06FF)
- Minimum length: 10 characters
- Removes extra whitespace
- Normalizes text formatting

## Database Schema

Content is inserted into the `content_chunks` table:
```typescript
{
  id: uuid,
  content: text,          // The Arabic text chunk
  subject: text,          // Subject name in Arabic
  topic: text,            // Topic name in Arabic
  metadata: jsonb,        // { difficulty, source, chunk_index }
  language: text,         // 'ar' for Arabic
  embedding: vector,      // Initially null, filled by Story 2.2
  created_at: timestamp,
  updated_at: timestamp
}
```

## Re-running the Script

The script can be re-run to add new content. Duplicate content may be inserted if the same JSON is processed multiple times. To avoid duplicates, clear the table first or implement deduplication logic.

## Monitoring

The script outputs:
- Progress for each subject and topic
- Number of chunks created per topic
- Success/failure statistics
- Final summary with total chunks and success rate

## Next Steps

After running this script:
1. **Story 2.2**: Run the embedding generation Edge Function to populate the `embedding` field
2. **Story 2.3**: Implement vector similarity search to query the content
3. **Story 2.4-2.10**: Build the UI and exam generation features
