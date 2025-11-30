#!/bin/bash
# Deploy media-sync Edge Function to Supabase

set -e

echo "Installing Supabase CLI..."
if ! command -v supabase &> /dev/null; then
    if [ -f "supabase_linux_amd64.tar.gz" ]; then
        tar -xzf supabase_linux_amd64.tar.gz
        sudo mv supabase /usr/local/bin/
    else
        echo "Downloading Supabase CLI..."
        curl -sL https://github.com/supabase/cli/releases/latest/download/supabase_linux_amd64.tar.gz -o supabase_linux_amd64.tar.gz
        tar -xzf supabase_linux_amd64.tar.gz
        sudo mv supabase /usr/local/bin/
    fi
fi

echo "Supabase CLI version:"
supabase --version

echo ""
echo "Deploying media-sync function..."
echo "Note: You need to be logged in to Supabase. Run 'supabase login' if needed."
echo ""

supabase functions deploy media-sync --project-ref yvmqcqrewqvwroxinzvn

echo ""
echo "Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Verify secrets are set in Supabase Dashboard > Edge Functions > media-sync:"
echo "   - YOUTUBE_DATA_API_KEY"
echo "   - SUPABASE_SERVICE_ROLE_KEY"
echo "   - SUPABASE_URL"
echo ""
echo "2. Click 'Sync Now' button in your frontend to test"
