// 测试 AI 匹配 API 的脚本
const testPatientProfile = {
  userId: '1',
  injuryType: 'Knee Rehabilitation',
  injuryDate: '2024-08-15',
  surgeryDate: '2024-08-20',
  currentPhase: 'mid',
  recoveryProgress: 42,
  weeklyTrainingDays: 5,
  dailyTrainingMinutes: 45,
  complianceRate: 78,
  currentDifficulty: 'intermediate',
  recoveryGoal: 'sport',
  targetSport: 'Basketball',
  targetTimeline: 6,
  averageSentimentScore: 0.3,
  activityLevel: 'high',
  helpfulnessScore: 7,
  ageGroup: '18-30',
  occupation: 'Software Engineer'
}

async function testAPI() {
  try {
    console.log('🧪 Testing AI Matching API...')

    const response = await fetch('http://localhost:3003/api/match-patients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        patientProfile: testPatientProfile
      })
    })

    console.log('📡 Response status:', response.status)

    if (response.ok) {
      const result = await response.json()
      console.log('✅ API Test Success!')
      console.log('📊 Recommendations:', result.recommendations?.length || 0)
      console.log('🆕 Suggest new group:', result.suggestNewGroup)

      if (result.recommendations) {
        result.recommendations.forEach((rec, index) => {
          console.log(`\n${index + 1}. ${rec.partyName} (${rec.matchScore}% match)`)
          console.log(`   Reasons: ${rec.reasons.join(', ')}`)
        })
      }

      if (result.newGroupSuggestion) {
        console.log('\n🆕 New Group Suggestion:', result.newGroupSuggestion.name)
      }
    } else {
      const errorText = await response.text()
      console.error('❌ API Test Failed:', response.status, errorText)
    }
  } catch (error) {
    console.error('❌ Network Error:', error.message)
  }
}

testAPI()
