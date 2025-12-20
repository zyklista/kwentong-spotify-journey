#!/bin/bash
set -e

echo "=== Deploying Survey Submissions Edge Function ==="
echo ""

# Get script directory and project root
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

cd "$PROJECT_ROOT"
echo "Working directory: $(pwd)"
echo "Checking function path..."

if [ ! -f "supabase/functions/survey_submissions/index.ts" ]; then
    echo "ERROR: Function file not found at supabase/functions/survey_submissions/index.ts"
    exit 1
fi

echo "✓ Function file found"
echo ""

supabase functions deploy survey_submissions --project-ref yvmqcqrewqvwroxinzvn

echo ""
echo "=== Deployment Complete! ==="
echo ""
echo "Next steps:"
echo "1. Verify secrets are set in Supabase Dashboard:"
echo "   https://supabase.com/dashboard/project/yvmqcqrewqvwroxinzvn/functions/survey_submissions"
echo ""
echo "   Required secrets:"
echo "   - BREVO_CONTACT_FORM_API_KEY"
echo "   - SUPABASE_SERVICE_ROLE_KEY"
echo "   - SUPABASE_URL (https://yvmqcqrewqvwroxinzvn.supabase.co)"
echo ""
echo "2. Test the function:"
echo "   npm run test:survey"
echo ""

