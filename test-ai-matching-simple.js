#!/usr/bin/env node

const http = require('http');

// 测试数据
const testPatientProfile = {
  userId: 'test-user-1',
  injuryType: 'Knee ACL Tear',
  injuryDate: '2024-08-01',
  surgeryDate: '2024-08-15',
  currentPhase: 'mid',
  recoveryProgress: 45,
  weeklyTrainingDays: 4,
  dailyTrainingMinutes: 60,
  complianceRate: 85,
  currentDifficulty: 'intermediate',
  recoveryGoal: 'sport',
  targetSport: 'basketball',
  targetTimeline: 6,
  averageSentimentScore: 0.7,
  activityLevel: 'high',
  helpfulnessScore: 8,
  ageGroup: '18-30',
  occupation: 'Student'
};

const postData = JSON.stringify({
  patientProfile: testPatientProfile
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/match-patients',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('🧪 Testing AI Patient Matching API...');
console.log('📊 Test Patient Profile:', testPatientProfile.userId, '-', testPatientProfile.injuryType);

const req = http.request(options, (res) => {
  console.log(`📡 Response Status: ${res.statusCode}`);
  console.log(`📋 Response Headers:`, res.headers);

  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      console.log('\n✅ API Response:');
      console.log('📈 Recommendations:', result.recommendations?.length || 0);

      if (result.recommendations) {
        result.recommendations.forEach((rec, index) => {
          console.log(`\n🎯 Recommendation ${index + 1}:`);
          console.log(`   Group: ${rec.partyName}`);
          console.log(`   Score: ${rec.matchScore}%`);
          console.log(`   Reasons: ${rec.reasons?.join(', ')}`);
        });
      }

      if (result.suggestNewGroup) {
        console.log('\n🆕 New Group Suggestion:', result.newGroupSuggestion?.name);
      }

      console.log('\n🎉 Test completed successfully!');
    } catch (error) {
      console.error('❌ Error parsing response:', error);
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request error:', error.message);
  console.log('💡 Make sure the server is running on http://localhost:3000');
});

req.write(postData);
req.end();
