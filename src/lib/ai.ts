import { GoogleGenerativeAI } from '@google/generative-ai'
import { PatientRiskData, RiskAnalysisResult } from './mockData'

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || 'demo-key')

// Get the Gemini model (updated model name)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

/**
 * Analyze patient risk using Gemini AI
 */
export async function analyzePatientRisk(patientData: PatientRiskData): Promise<RiskAnalysisResult> {
  // Check if we have a valid API key
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY === 'demo-key' ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY === 'your_gemini_api_key_here' ||
    process.env.DEMO_MODE === 'true') {
    console.log('🤖 [DEMO] Using fallback analysis for:', patientData.patientName)
    return generateFallbackAnalysis(patientData)
  }

  const prompt = `
# AI Role
You are an experienced physical therapy assistant. Your task is to analyze patient data and identify patients who may be at risk of dropping out of treatment.

# Task Instructions
Please analyze the following JSON patient data. Based on this data, provide a risk score from 1 to 10 (1 = very safe, 10 = extremely dangerous) and your analysis reasoning.

You MUST return your analysis in JSON format.

# Patient Data
${JSON.stringify(patientData, null, 2)}

# Your Output Format (MUST be JSON)
{
  "riskScore": 8,
  "reasoning": "The patient's home exercise compliance is extremely low, platform activity has significantly decreased. There was one last-minute appointment cancellation, and sentiment analysis of community posts shows clear frustration and negative emotions. Overall, the patient's treatment motivation is rapidly declining, with very high dropout risk.",
  "recommendations": [
    "Schedule immediate check-in call with patient",
    "Review and adjust exercise program difficulty",
    "Provide additional motivation and support resources"
  ]
}

Please analyze the patient data and respond in the exact JSON format shown above.
`

  try {
    console.log('🤖 Calling Gemini AI for patient:', patientData.patientName)
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Parse the JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in AI response')
    }

    const analysisResult: RiskAnalysisResult = JSON.parse(jsonMatch[0])

    // Validate the result
    if (typeof analysisResult.riskScore !== 'number' ||
      typeof analysisResult.reasoning !== 'string' ||
      !Array.isArray(analysisResult.recommendations)) {
      throw new Error('Invalid AI response format')
    }

    console.log('✅ AI analysis completed for:', patientData.patientName)
    return analysisResult
  } catch (error) {
    console.error('❌ Error analyzing patient risk with AI:', error)
    console.log('🔄 Falling back to rule-based analysis for:', patientData.patientName)

    // Fallback analysis based on simple rules
    return generateFallbackAnalysis(patientData)
  }
}

/**
 * Generate personalized care email using Gemini AI
 */
export async function generateCareEmail(
  patientData: PatientRiskData,
  riskAnalysis: RiskAnalysisResult
): Promise<string> {
  // Check if we have a valid API key
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY === 'demo-key' ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY === 'your_gemini_api_key_here' ||
    process.env.DEMO_MODE === 'true') {
    console.log('📧 [DEMO] Using fallback email template for:', patientData.patientName)
    return generateFallbackEmail(patientData)
  }

  const prompt = `
# AI Role
You are a care specialist from the "Healing Together" community. Your tone is warm, genuine, and encouraging, but never mechanical or preachy.

# Task Instructions
Please write a short (about 100-150 words) care email for the following patient. The email should:
1. Address them by name
2. Acknowledge that recovery can be challenging (subtly relate to their injury)
3. Emphasize they are not alone and that the community has many companions in similar situations
4. Encourage them to return to our community and include the community link
5. The tone should be from the community greeting, not clinic supervision

# Patient Information
{
  "patientName": "${patientData.patientName}",
  "injury": "${patientData.injury}",
  "reasonForConcern": "${riskAnalysis.reasoning}"
}

# Community Link
${process.env.NEXT_PUBLIC_APP_URL || 'https://healing-together-ruddy.vercel.app'}

# Your Output (Email Body)
Please generate a caring, personalized email that feels genuine and supportive.
`

  try {
    console.log('📧 Generating AI care email for:', patientData.patientName)
    const result = await model.generateContent(prompt)
    const response = await result.response
    console.log('✅ AI email generated for:', patientData.patientName)
    return response.text()
  } catch (error) {
    console.error('❌ Error generating care email with AI:', error)
    console.log('🔄 Using fallback email template for:', patientData.patientName)

    // Fallback email template
    return generateFallbackEmail(patientData)
  }
}

/**
 * Fallback analysis when AI is not available
 */
function generateFallbackAnalysis(patientData: PatientRiskData): RiskAnalysisResult {
  let riskScore = 1
  const reasons: string[] = []
  const recommendations: string[] = []

  // Analyze compliance
  const compliance = parseInt(patientData.data.hepComplianceLastWeek.replace('%', ''))
  if (compliance < 50) {
    riskScore += 3
    reasons.push('Low home exercise compliance')
    recommendations.push('Review and simplify exercise program')
  }

  // Analyze activity
  if (patientData.data.loginsLastWeek < 2) {
    riskScore += 2
    reasons.push('Decreased platform activity')
    recommendations.push('Send engagement reminder')
  }

  // Analyze appointments
  if (patientData.data.recentAppointments.lastMinuteCancellations > 0 ||
    patientData.data.recentAppointments.noShows > 0) {
    riskScore += 2
    reasons.push('Appointment attendance issues')
    recommendations.push('Schedule check-in call')
  }

  // Analyze sentiment
  if (patientData.data.recentPostSentiment.toLowerCase().includes('negative')) {
    riskScore += 2
    reasons.push('Negative sentiment in community posts')
    recommendations.push('Provide additional emotional support')
  }

  // Analyze pain trend
  if (patientData.data.painScoreTrend === 'worsening') {
    riskScore += 1
    reasons.push('Worsening pain trend')
    recommendations.push('Review treatment plan with therapist')
  }

  return {
    riskScore: Math.min(riskScore, 10),
    reasoning: reasons.length > 0 ? reasons.join(', ') : 'Patient appears to be progressing well',
    recommendations: recommendations.length > 0 ? recommendations : ['Continue current treatment plan']
  }
}

/**
 * Fallback email when AI is not available
 */
function generateFallbackEmail(patientData: PatientRiskData): string {
  return `Subject: A Greeting from Healing Together Community 👋

Hi ${patientData.patientName},

Just wanted to reach out and say hello. We know that recovering from ${patientData.injury.toLowerCase()} can be a long and challenging journey, especially when progress feels slow.

Please remember, you're not fighting this alone. In our "Healing Together" community, there are many friends who are going through similar experiences, and their insights and encouragement might give you new strength.

If you have time, come back and see everyone. You might discover some useful tips, or just chat with the community. We're all here to support you!

Looking forward to seeing you again: ${process.env.NEXT_PUBLIC_APP_URL || 'https://healing-together-ruddy.vercel.app'}

Best regards,
Your Healing Together Team`
}
