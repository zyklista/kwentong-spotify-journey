#!/bin/bash
set -e

echo "=== Supabase CLI Setup and Deployment ==="
echo ""

# Install Supabase CLI
if ! command -v supabase &> /dev/null; then
    echo "Installing Supabase CLI..."
    
    # Download latest CLI
    curl -sL https://github.com/supabase/cli/releases/latest/download/supabase_linux_amd64.tar.gz -o /tmp/supabase_cli.tar.gz
    
    # Extract
    tar -xzf /tmp/supabase_cli.tar.gz -C /tmp/
    
    # Remove existing if present
    sudo rm -rf /usr/local/bin/supabase
    
    # Move to PATH
    sudo mv /tmp/supabase /usr/local/bin/
    
    # Cleanup
    rm /tmp/supabase_cli.tar.gz
    
    echo "✓ Supabase CLI installed"
else
    echo "✓ Supabase CLI already installed"
fi

echo ""
supabase --version
echo ""

# Check if logged in
echo "Checking Supabase authentication..."
if ! supabase projects list &> /dev/null; then
    echo ""
    echo "You need to login to Supabase."
    echo "This will open your browser for authentication."
    read -p "Press Enter to continue..."
    supabase login
fi

echo ""
echo "=== Deploying media-sync Edge Function ==="
echo ""

# Get script directory and project root
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

cd "$PROJECT_ROOT"
echo "Working directory: $(pwd)"
echo "Checking function path..."

if [ ! -f "supabase/functions/media-sync/index.ts" ]; then
    echo "ERROR: Function file not found at supabase/functions/media-sync/index.ts"
    exit 1
fi

echo "✓ Function file found"
echo ""

supabase functions deploy media-sync --project-ref yvmqcqrewqvwroxinzvn

echo ""
echo "=== Deployment Complete! ==="
echo ""
echo "Next steps:"
echo "1. Verify secrets are set in Supabase Dashboard:"
echo "   https://supabase.com/dashboard/project/yvmqcqrewqvwroxinzvn/functions/media-sync"
echo ""
echo "   Required secrets:"
echo "   - YOUTUBE_DATA_API_KEY"
echo "   - SUPABASE_SERVICE_ROLE_KEY"
echo "   - SUPABASE_URL (https://yvmqcqrewqvwroxinzvn.supabase.co)"
echo ""
echo "2. Test the function by clicking 'Sync Now' button in your frontend"
echo ""
