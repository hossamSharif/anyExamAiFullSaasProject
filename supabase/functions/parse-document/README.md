# Parse Document Edge Function

## Overview
Parses uploaded documents (PDF, DOCX, images) and extracts Arabic text for exam generation.

## Features
- PDF parsing with Arabic text support
- Text chunking for embedding generation
- RTL text handling
- Real-time status updates
- Automatic error handling

## Usage

### Invoke from client:
```typescript
const { data, error } = await supabase.functions.invoke('parse-document', {
  body: { documentId: 'uuid-here' }
});
```

### Automatic trigger:
The function can be automatically triggered when a document status changes to 'pending'.

## Environment Variables
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key for database access

## Error Handling
All errors are returned in Arabic and the document status is updated to 'failed' with the error message.

## Database Tables Used
- `documents`: Document metadata
- `document_chunks`: Parsed content chunks

## Notes
- Currently supports PDF files fully
- DOCX support coming soon (requires mammoth.js)
- Image OCR support coming soon (requires Tesseract.js)
- Maximum chunk size: 1000 characters
- Minimum chunk size: 50 characters
- Overlap between chunks: 100 characters
