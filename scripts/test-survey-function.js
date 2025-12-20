#!/usr/bin/env node

/**
 * Diagnostic script to test the Survey Edge Function
 * Run with: node scripts/test-survey-function.js
 */

const SUPABASE_URL = "https://yvmqcqrewqvwroxinzvn.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2bXFjcXJld3F2d3JveGluenZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyMzQxMDEsImV4cCI6MjA3MjgxMDEwMX0.R0dPQK8ELH3OXmwxbJaEMa2CIU4E6G0hWEwj-sKK9Vc";

async function testSurveySubmission() {
  console.log('🧪 Testing Survey Edge Function...\n');

  try {
    // Test with valid survey data
    const testData = {
      name: "Test User",
      email: `survey-test-${Date.now()}@example.com`,
      rating: 5,
      feedback: "This is a test survey submission for diagnostic purposes.",
      interviewExperience: "Great experience with the podcast interviews!",
      interviewSuggestions: "More technical interviews would be great.",
      interviewFavorite: "The last interview was my favorite."
    };

    console.log('📤 Sending test survey data:', testData);
    console.log('📤 Data types:', {
      name: typeof testData.name,
      email: typeof testData.email,
      rating: typeof testData.rating,
      feedback: typeof testData.feedback,
      interviewExperience: typeof testData.interviewExperience,
      interviewSuggestions: typeof testData.interviewSuggestions,
      interviewFavorite: typeof testData.interviewFavorite
    });

    const response = await fetch(`${SUPABASE_URL}/functions/v1/survey-submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(testData),
    });

    const result = await response.json();

    console.log('📡 Response status:', response.status);
    console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
    console.log('📡 Response data:', JSON.stringify(result, null, 2));

    if (response.status === 200 && result.success) {
      console.log('✅ Survey submission successful!');
      console.log('✅ Database saved:', result.databaseSaved);
      console.log('✅ Brevo added:', result.brevoAdded);
      if (result.brevoError) {
        console.log('⚠️  Brevo error:', result.brevoError);
      }
      if (result.data) {
        console.log('💾 Database record:', result.data);
      }
    } else {
      console.log('❌ Survey submission failed');
      console.log('❌ Error details:', result.error);
      if (result.details) {
        console.log('❌ Details:', result.details);
      }
    }

  } catch (error) {
    console.log('❌ Test failed');
    console.error('Error:', error.message);
  }
}

async function testValidation() {
  console.log('\n🧪 Testing Survey Validation...\n');

  try {
    // Test with invalid data (missing required fields)
    const invalidData = {
      name: "Test User",
      email: "", // Empty email
      rating: 0, // Invalid rating
      feedback: "", // Empty feedback
    };

    const response = await fetch(`${SUPABASE_URL}/functions/v1/survey-submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(invalidData),
    });

    const result = await response.json();

    console.log('📡 Validation Response status:', response.status);
    console.log('📡 Validation Response data:', JSON.stringify(result, null, 2));

    if (response.status === 400 && !result.success) {
      console.log('✅ Validation working correctly');
    } else {
      console.log('❌ Validation not working as expected');
    }

  } catch (error) {
    console.log('❌ Validation test failed');
    console.error('Error:', error.message);
  }
}

// Run tests
async function runTests() {
  await testSurveySubmission();
  await testValidation();
}

runTests();