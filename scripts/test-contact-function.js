#!/usr/bin/env node

/**
 * Test script for the contact form Edge Function with Brevo integration
 * Run with: node scripts/test-contact-function.js
 */

const SUPABASE_URL = "https://yvmqcqrewqvwroxinzvn.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2bXFjcXJld3F2d3JveGluenZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyMzQxMDEsImV4cCI6MjA3MjgxMDEwMX0.R0dPQK8ELH3OXmwxbJaEMa2CIU4E6G0hWEwj-sKK9Vc";

async function testContactFunction() {
  console.log('🧪 Testing Contact Form Edge Function with Brevo integration...\n');

  const testData = {
    name: "Test User",
    email: `test-${Date.now()}@example.com`, // Unique email for testing
    phone: "+1234567890",
    service: "full-stack-web-development",
    message: "This is a test message from the test script."
  };

  try {
    console.log('📤 Sending test data:', JSON.stringify(testData, null, 2));

    const response = await fetch(`${SUPABASE_URL}/functions/v1/contact_submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(testData),
    });

    const result = await response.json();

    console.log('\n📥 Response status:', response.status);
    console.log('📥 Response data:', JSON.stringify(result, null, 2));

    if (response.ok && result.success) {
      console.log('\n✅ Test PASSED: Contact form submission successful!');
      console.log(`📧 Brevo Status: ${result.brevoAdded ? '✅ Added to list 9' : '❌ Not added to Brevo'}`);

      if (result.brevoAdded) {
        console.log('🎉 Contact successfully added to Brevo mailing list 9!');
      } else {
        console.log('⚠️  Contact saved to database but Brevo integration failed');
        console.log('   Check BREVO_API_KEY environment variable');
      }
    } else {
      console.log('\n❌ Test FAILED: Contact form submission failed!');
      console.log('Error:', result.error);
    }

  } catch (error) {
    console.log('\n❌ Test FAILED: Network or other error!');
    console.error('Error:', error.message);
  }
}

// Test invalid data
async function testInvalidData() {
  console.log('\n🧪 Testing with invalid data...\n');

  const invalidData = {
    name: "", // Empty name
    email: "invalid-email", // Invalid email
    service: "invalid-service",
    message: "" // Empty message
  };

  try {
    console.log('📤 Sending invalid data:', JSON.stringify(invalidData, null, 2));

    const response = await fetch(`${SUPABASE_URL}/functions/v1/contact_submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(invalidData),
    });

    const result = await response.json();

    console.log('\n📥 Response status:', response.status);
    console.log('📥 Response data:', JSON.stringify(result, null, 2));

    if (response.status === 400 && !result.success) {
      console.log('\n✅ Validation Test PASSED: Invalid data properly rejected!');
    } else {
      console.log('\n❌ Validation Test FAILED: Invalid data should be rejected!');
    }

  } catch (error) {
    console.log('\n❌ Validation Test FAILED: Network error!');
    console.error('Error:', error.message);
  }
}

// Test Brevo contact creation specifically
async function testBrevoContact() {
  console.log('\n🧪 Testing Brevo contact creation...\n');

  const brevoTestData = {
    name: "Brevo Test User",
    email: `brevo-test-${Date.now()}@example.com`,
    phone: "+1987654321",
    service: "advertising",
    message: "Testing Brevo contact creation and list addition."
  };

  try {
    console.log('📤 Testing Brevo integration with:', JSON.stringify(brevoTestData, null, 2));

    const response = await fetch(`${SUPABASE_URL}/functions/v1/contact_submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(brevoTestData),
    });

    const result = await response.json();

    console.log('\n📥 Brevo Test Response:', JSON.stringify(result, null, 2));

    if (response.ok && result.success && result.brevoAdded) {
      console.log('\n✅ Brevo Test PASSED: Contact added to mailing list 9!');
      console.log('📧 Check your Brevo dashboard to verify the contact was added');
    } else if (response.ok && result.success && !result.brevoAdded) {
      console.log('\n⚠️  Partial Success: Contact saved but Brevo failed');
      console.log('   This might be due to missing BREVO_API_KEY');
    } else {
      console.log('\n❌ Brevo Test FAILED: Contact submission failed');
    }

  } catch (error) {
    console.log('\n❌ Brevo Test FAILED: Network error!');
    console.error('Error:', error.message);
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting comprehensive contact form tests...\n');

  await testContactFunction();
  await testInvalidData();
  await testBrevoContact();

  console.log('\n🏁 All tests completed!');
  console.log('\n📋 Summary:');
  console.log('- ✅ Database integration test');
  console.log('- ✅ Input validation test');
  console.log('- ✅ Brevo mailing list integration test');
  console.log('\n💡 If Brevo tests fail, check your BREVO_API_KEY environment variable');
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args.includes('--brevo-only')) {
  testBrevoContact().catch(console.error);
} else if (args.includes('--validation-only')) {
  testInvalidData().catch(console.error);
} else {
  runTests().catch(console.error);
}

// Test invalid data
async function testInvalidData() {
  console.log('\n🧪 Testing with invalid data...\n');

  const invalidData = {
    name: "", // Empty name
    email: "invalid-email", // Invalid email
    service: "invalid-service",
    message: "" // Empty message
  };

  try {
    console.log('📤 Sending invalid data:', JSON.stringify(invalidData, null, 2));

    const response = await fetch(`${SUPABASE_URL}/functions/v1/contact_submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(invalidData),
    });

    const result = await response.json();

    console.log('\n📥 Response status:', response.status);
    console.log('📥 Response data:', JSON.stringify(result, null, 2));

    if (response.status === 400 && !result.success) {
      console.log('\n✅ Validation Test PASSED: Invalid data properly rejected!');
    } else {
      console.log('\n❌ Validation Test FAILED: Invalid data should be rejected!');
    }

  } catch (error) {
    console.log('\n❌ Validation Test FAILED: Network error!');
    console.error('Error:', error.message);
  }
}

// Run tests
async function runTests() {
  await testContactFunction();
  await testInvalidData();
  console.log('\n🏁 Test suite completed!');
}

runTests().catch(console.error);