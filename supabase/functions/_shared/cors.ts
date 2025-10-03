/**
 * CORS Headers for Supabase Edge Functions
 *
 * Allows requests from web and mobile apps
 */

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

/**
 * Handle OPTIONS request for CORS preflight
 */
export function handleCorsPrelight() {
  return new Response('ok', { headers: corsHeaders });
}

/**
 * Create JSON response with CORS headers
 */
export function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
}

/**
 * Create error response with CORS headers
 */
export function errorResponse(message: string, status = 400) {
  return jsonResponse({ error: message }, status);
}
