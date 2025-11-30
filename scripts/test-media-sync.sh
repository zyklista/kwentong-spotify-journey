#!/bin/bash
# Test script to manually trigger media-sync Edge Function

# Your Supabase Edge Function URL
MEDIA_SYNC_URL="https://yvmqcqrewqvwroxinzvn.supabase.co/functions/v1/media-sync"
CHANNEL_ID="UCANMUQ39X4PcnUENrxFocbw"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2bXFjcXJld3F2d3JveGluenZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyMzQxMDEsImV4cCI6MjA3MjgxMDEwMX0.R0dPQK8ELH3OXmwxbJaEMa2CIU4E6G0hWEwj-sKK9Vc"

echo "Testing media-sync Edge Function..."
echo "URL: ${MEDIA_SYNC_URL}"
echo ""

# First test: Check if function is accessible (without persist)
echo "1. Testing function accessibility (no persist):"
curl -s -w "\nHTTP Status: %{http_code}\n" \
  "${MEDIA_SYNC_URL}?channel_id=${CHANNEL_ID}&min_duration=300" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
  -H "apikey: ${SUPABASE_ANON_KEY}" | head -100

echo ""
echo "---"
echo ""

# Second test: Trigger actual sync with persistence
echo "2. Triggering sync WITH persistence (writing to DB):"
curl -s -w "\nHTTP Status: %{http_code}\n" \
  "${MEDIA_SYNC_URL}?channel_id=${CHANNEL_ID}&persist=true&min_duration=300" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
  -H "apikey: ${SUPABASE_ANON_KEY}"

echo ""
echo "---"
echo "Done. Check the output above for 'items' array and 'persisted' object."
echo "If you see 'error' or HTTP 500/401, check Supabase Edge Function secrets:"
echo "  - YOUTUBE_DATA_API_KEY"
echo "  - SUPABASE_SERVICE_ROLE_KEY"
echo "  - SUPABASE_URL"
