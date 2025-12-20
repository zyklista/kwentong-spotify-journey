#!/usr/bin/env node

/**
 * Diagnostic script to check Edge Function environment and connectivity
 * Run with: node scripts/diagnose-edge-function.js
 */

const SUPABASE_URL = "https://yvmqcqrewqvwroxinzvn.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2bXFjcXJld3F2d3JveGluenZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyMzQxMDEsImV4cCI6MjA3MjgxMDEwMX0.R0dPQK8ELH3OXmwxbJaEMa2CIU4E6G0hWEwj-sKK9Vc";

async function testBasicConnectivity() {
  console.log('🔍 Testing basic connectivity to Edge Function...\n');

  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/contact_submissions`, {
      method: 'GET', // This should return 405 Method Not Allowed
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });

    console.log('📡 Response status:', response.status);
    console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

    if (response.status === 405) {
      console.log('✅ Edge Function is responding (405 expected for GET request)');
    } else {
      console.log('⚠️ Unexpected response status');
    }

  } catch (error) {
    console.log('❌ Network connectivity test failed');
    console.error('Error:', error.message);
  }
}

async function testCors() {
  console.log('\n🔍 Testing CORS preflight...\n');

  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/contact_submissions`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:3000',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'content-type,authorization',
      },
    });

    console.log('📡 CORS Response status:', response.status);
    console.log('📡 CORS Headers:', {
      'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
      'access-control-allow-methods': response.headers.get('access-control-allow-methods'),
      'access-control-allow-headers': response.headers.get('access-control-allow-headers'),
    });

    if (response.status === 200) {
      console.log('✅ CORS preflight working');
    } else {
      console.log('❌ CORS preflight failed');
    }

  } catch (error) {
    console.log('❌ CORS test failed');
    console.error('Error:', error.message);
  }
}

async function testInvalidRequest() {
  console.log('\n🔍 Testing with invalid request (should return 400)...\n');

  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/contact_submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({}), // Empty body should trigger validation
    });

    const result = await response.json();

    console.log('📡 Response status:', response.status);
    console.log('📡 Response data:', JSON.stringify(result, null, 2));

    if (response.status === 400 && !result.success) {
      console.log('✅ Validation working correctly');
    } else {
      console.log('❌ Validation not working as expected');
    }

  } catch (error) {
    console.log('❌ Invalid request test failed');
    console.error('Error:', error.message);
  }
}

async function testDatabaseConnection() {
  console.log('\n🔍 Testing database connectivity...\n');

  try {
    // Test with minimal valid data
    const testData = {
      name: "Test User",
      email: `diag-${Date.now()}@example.com`,
      phone: "+1234567890",
      service: "test",
      message: "Database connectivity test"
    };

    const response = await fetch(`${SUPABASE_URL}/functions/v1/contact_submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(testData),
    });

    const result = await response.json();

    console.log('📡 Database test response status:', response.status);
    console.log('📡 Database test response:', JSON.stringify(result, null, 2));

    if (response.ok && result.success) {
      console.log('✅ Database connection working');
      console.log('🆔 Record saved with ID:', result.id);
      console.log('📧 Brevo status:', result.brevoAdded ? '✅ Added' : '❌ Not added');
    } else {
      console.log('❌ Database test failed');
      console.log('Error details:', result.error);
    }

  } catch (error) {
    console.log('❌ Database connectivity test failed');
    console.error('Error:', error.message);
  }
}

// Run diagnostics
async function runDiagnostics() {
  console.log('🔧 Edge Function Diagnostic Tool');
  console.log('================================\n');

  await testBasicConnectivity();
  await testCors();
  await testInvalidRequest();
  await testDatabaseConnection();

  console.log('\n🏁 Diagnostics completed!');
  console.log('\n💡 If you see 503 errors, check:');
  console.log('1. Environment variables in Supabase dashboard');
  console.log('2. Database table exists (run migration)');
  console.log('3. Edge function is deployed');
  console.log('4. Brevo API key is valid (optional)');
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args.includes('--connectivity-only')) {
  testBasicConnectivity().catch(console.error);
} else if (args.includes('--cors-only')) {
  testCors().catch(console.error);
} else if (args.includes('--validation-only')) {
  testInvalidRequest().catch(console.error);
} else if (args.includes('--database-only')) {
  testDatabaseConnection().catch(console.error);
} else {
  runDiagnostics().catch(console.error);
}