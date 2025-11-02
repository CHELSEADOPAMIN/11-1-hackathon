import { AIRecommendationResponse, PatientProfile, availableParties, patientProfiles } from '@/lib/mockData'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || 'demo-key')
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

/**
 * AI 智能患者匹配 API
 */
export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const requestBody = await req.json()
    const patientProfile: PatientProfile = requestBody.patientProfile

    if (!patientProfile) {
      return NextResponse.json(
        { error: 'Patient profile is required' },
        { status: 400 }
      )
    }

    // Check if we have a valid API key
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
      process.env.GOOGLE_GENERATIVE_AI_API_KEY === 'demo-key' ||
      process.env.GOOGLE_GENERATIVE_AI_API_KEY === 'your_gemini_api_key_here' ||
      process.env.DEMO_MODE === 'true') {
      console.log('🤖 [DEMO] Using fallback matching for:', patientProfile.userId)
      return NextResponse.json(generateFallbackMatching(patientProfile));
    }

    try {
      const prompt = `
# AI Role
You are an expert rehabilitation community manager and data analyst. Your task is to analyze patient profiles and recommend the best community group matches based on multiple dimensions of compatibility.

# Patient Profile to Match
${JSON.stringify(patientProfile, null, 2)}

# Available Community Groups
${JSON.stringify(availableParties, null, 2)}

# Other Patient Profiles (for context)
${JSON.stringify(patientProfiles.filter(p => p.userId !== patientProfile.userId), null, 2)}

# Matching Criteria
Analyze the patient's profile across these key dimensions:

1. **Recovery Phase Compatibility**
   - Current phase (early/mid/late/maintenance)
   - Recovery progress percentage
   - Time since injury/surgery

2. **Training Intensity Matching**
   - Weekly training days
   - Daily training minutes
   - Compliance rate
   - Current difficulty level

3. **Goal Alignment**
   - Recovery goal (work/sport/daily_life/professional_athlete)
   - Target sport (if applicable)
   - Timeline expectations

4. **Emotional & Social Compatibility**
   - Sentiment score (positive/negative)
   - Activity level
   - Helpfulness score
   - Age group

5. **Injury Type Relevance**
   - Primary injury type
   - Related rehabilitation needs

# Task
1. Calculate match scores (0-100) for each available group
2. Provide top 3 recommendations with detailed reasoning
3. Consider if a new specialized group should be created
4. Focus on creating supportive, motivating matches

# Output Format (MUST be valid JSON)
{
  "recommendations": [
    {
      "userId": "${patientProfile.userId}",
      "partyId": "party-1",
      "partyName": "Group Name",
      "matchScore": 95,
      "reasons": [
        "Similar recovery phase (mid-stage, 40-50% progress)",
        "Matching training intensity (5-6 days/week)",
        "Same sport goal (basketball)",
        "Compatible age group and activity level"
      ],
      "expectedBenefit": "High motivation through peer learning and shared goals"
    }
  ],
  "suggestNewGroup": false,
  "newGroupSuggestion": {
    "name": "Basketball Return Squad - 6 Month Goal",
    "targetMembers": ["user-1", "user-3"],
    "reason": "Unique combination of basketball goals and 6-month timeline not well covered by existing groups",
    "estimatedSize": 8
  }
}

Please analyze the patient data and respond in the exact JSON format shown above.
`

      console.log('🤖 Calling Gemini AI for patient matching:', patientProfile.userId)
      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      // Parse the JSON response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in AI response')
      }

      const matchingResult: AIRecommendationResponse = JSON.parse(jsonMatch[0])

      // Validate the result
      if (!matchingResult.recommendations || !Array.isArray(matchingResult.recommendations)) {
        throw new Error('Invalid AI response format')
      }

      console.log('✅ AI matching completed for:', patientProfile.userId)
      return NextResponse.json(matchingResult);

    } catch (aiError) {
      console.error('❌ Error in AI patient matching:', aiError)
      console.log('🔄 Falling back to rule-based matching')

      // Fallback to rule-based matching
      const fallbackResult = generateFallbackMatching(patientProfile)
      return NextResponse.json(fallbackResult);
    }

  } catch (parseError) {
    console.error('❌ Error parsing request body:', parseError)
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }
}

/**
 * 备用规则匹配算法
 */
function generateFallbackMatching(patientProfile: PatientProfile): AIRecommendationResponse {
  const recommendations = []

  // 基于规则的匹配逻辑
  for (const party of availableParties) {
    let matchScore = 0
    const reasons = []

    // 1. 伤病类型匹配 (30分)
    if (party.category.toLowerCase() === patientProfile.injuryType.toLowerCase().split(' ')[0]) {
      matchScore += 30
      reasons.push(`Same injury type: ${party.category}`)
    } else if (party.category.toLowerCase().includes(patientProfile.injuryType.toLowerCase().split(' ')[0])) {
      matchScore += 20
      reasons.push(`Related injury type: ${party.category}`)
    }

    // 2. 康复阶段匹配 (25分)
    // 根据小组名称推断适合的阶段
    if (party.name.toLowerCase().includes('advanced') && patientProfile.currentPhase === 'late') {
      matchScore += 25
      reasons.push('Advanced group matches your late recovery phase')
    } else if (!party.name.toLowerCase().includes('advanced') && patientProfile.currentPhase !== 'late') {
      matchScore += 20
      reasons.push('Group suitable for your current recovery phase')
    }

    // 3. 训练强度匹配 (20分)
    if (patientProfile.weeklyTrainingDays >= 5 && party.name.toLowerCase().includes('warrior')) {
      matchScore += 20
      reasons.push('High training intensity matches group focus')
    } else if (patientProfile.weeklyTrainingDays >= 3) {
      matchScore += 15
      reasons.push('Moderate training intensity suitable for group')
    }

    // 4. 目标匹配 (15分)
    if (patientProfile.recoveryGoal === 'sport' && party.name.toLowerCase().includes('training')) {
      matchScore += 15
      reasons.push('Sport-focused goal aligns with group objectives')
    } else if (patientProfile.recoveryGoal === 'work' || patientProfile.recoveryGoal === 'daily_life') {
      matchScore += 10
      reasons.push('Recovery goal compatible with group support')
    }

    // 5. 情感状态匹配 (10分)
    if (patientProfile.averageSentimentScore > 0 && patientProfile.helpfulnessScore > 6) {
      matchScore += 10
      reasons.push('Positive attitude will contribute to group dynamics')
    } else if (patientProfile.averageSentimentScore < 0) {
      matchScore += 5
      reasons.push('Group support will help improve motivation')
    }

    if (matchScore > 40) { // 只推荐匹配度 > 40% 的小组
      recommendations.push({
        userId: patientProfile.userId,
        partyId: party.id,
        partyName: party.name,
        matchScore,
        reasons,
        expectedBenefit: matchScore > 70
          ? 'High compatibility for mutual support and motivation'
          : 'Good foundation for community support and learning'
      })
    }
  }

  // 按匹配度排序，取前3个
  recommendations.sort((a, b) => b.matchScore - a.matchScore)
  const topRecommendations = recommendations.slice(0, 3)

  // 判断是否建议创建新小组
  const suggestNewGroup = topRecommendations.length === 0 || topRecommendations[0].matchScore < 60

  let newGroupSuggestion = undefined
  if (suggestNewGroup) {
    // 寻找相似的患者
    const similarPatients = patientProfiles.filter(p =>
      p.userId !== patientProfile.userId &&
      p.injuryType === patientProfile.injuryType &&
      Math.abs(p.recoveryProgress - patientProfile.recoveryProgress) < 20 &&
      p.recoveryGoal === patientProfile.recoveryGoal
    )

    if (similarPatients.length > 0) {
      const goalText = patientProfile.recoveryGoal === 'sport' ?
        `${patientProfile.targetSport || 'Sport'} Return` :
        patientProfile.recoveryGoal === 'work' ? 'Work Return' : 'Daily Life Recovery'

      newGroupSuggestion = {
        name: `${patientProfile.injuryType} ${goalText} - ${patientProfile.targetTimeline}M Goal`,
        targetMembers: [patientProfile.userId, ...similarPatients.slice(0, 2).map(p => p.userId)],
        reason: `Specialized group for ${patientProfile.injuryType} patients with ${goalText.toLowerCase()} goals`,
        estimatedSize: Math.min(similarPatients.length + 3, 12)
      }
    }
  }

  return {
    recommendations: topRecommendations,
    suggestNewGroup,
    newGroupSuggestion
  }
}
