# 📊 Patient Risk Scenarios - Testing Guide

This document outlines the diverse patient scenarios available for testing the AI Patient Care System. Each patient represents a different risk profile and dropout reason.

## 🎯 Patient Overview (Total: 12 patients)

### ✅ Low Risk Patients (Risk Score: 1-4)

#### 1. **John Smith** - The Model Patient
- **Injury**: Knee Rehabilitation
- **Risk Score**: ~1/10 ⭐
- **Key Indicators**:
  - 85% exercise compliance
  - Active on platform (5 logins/week)
  - Recent community engagement (2 days ago)
  - Improving pain trend
  - Positive sentiment
- **Reason**: Everything going well - no intervention needed

#### 2. **Emma Davis** - Making Good Progress
- **Injury**: Ankle Rehabilitation  
- **Risk Score**: ~3/10 ⭐
- **Key Indicators**:
  - 70% exercise compliance
  - Moderate platform activity
  - Steady progress
  - Neutral sentiment
- **Reason**: Normal recovery trajectory - low concern

---

### ⚠️ Medium Risk Patients (Risk Score: 5-6)

#### 3. **Carlos Rodriguez** - Work-Life Balance Issues
- **Injury**: ACL Tear Recovery
- **Risk Score**: ~7/10 ⚠️
- **Key Indicators**:
  - 45% compliance (declining)
  - Infrequent logins
  - 15 days since last post
  - Frustrated sentiment: "Overwhelmed with work and rehab"
- **Dropout Reason**: **Time Management / Burnout**
- **AI Should Suggest**: Flexible scheduling, shorter exercise sessions

#### 4. **David Kim** - Plateau and Boredom
- **Injury**: Elbow Tendonitis
- **Risk Score**: ~7/10 ⚠️
- **Key Indicators**:
  - 40% compliance
  - Stagnant pain trend
  - 22 days since community interaction
  - Sentiment: "Getting bored with exercises"
- **Dropout Reason**: **Lack of Progress / Exercise Monotony**
- **AI Should Suggest**: Exercise variety, new challenges

#### 5. **Thomas Anderson** - Impatience
- **Injury**: Wrist Fracture Recovery
- **Risk Score**: ~7/10 ⚠️
- **Key Indicators**:
  - 50% compliance
  - Multiple cancellations (2)
  - Sentiment: "Getting impatient, range of motion still limited"
- **Dropout Reason**: **Unrealistic Expectations**
- **AI Should Suggest**: Education on recovery timeline, celebrate small wins

---

### 🚨 High Risk Patients (Risk Score: 7-10)

#### 6. **Sarah Johnson** - Loss of Motivation (YOUR TEST EMAIL)
- **Email**: yangqiqi789@gmail.com ✉️
- **Injury**: Shoulder Rehabilitation
- **Risk Score**: ~10/10 🚨
- **Key Indicators**:
  - 35% compliance (very low)
  - Only 1 login last week
  - 20 days without community activity
  - 1 last-minute cancellation
  - Stagnant progress
  - Negative sentiment: "No progress, getting discouraged"
- **Dropout Reason**: **Perceived Lack of Progress + Isolation**
- **AI Should Generate**: Empathetic email acknowledging frustration, community encouragement

#### 7. **Mike Wilson** - Extreme Dropout Risk
- **Injury**: Spine Rehabilitation
- **Risk Score**: ~10/10 🚨
- **Key Indicators**:
  - 20% compliance (critical)
  - 0 logins last week
  - 35 days inactive on community
  - 2 cancellations + 1 no-show
  - Worsening pain trend
  - Very negative sentiment: "Not working, losing hope"
- **Dropout Reason**: **Complete Disengagement + Pain Increase**
- **AI Should Generate**: Urgent care email, suggest therapist check-in

#### 8. **Lisa Chen** - Treatment Doubt
- **Injury**: Rotator Cuff Repair
- **Risk Score**: ~9/10 🚨
- **Key Indicators**:
  - 30% compliance
  - 0 logins
  - 28 days without posting
  - 2 no-shows
  - Worsening pain
  - Sentiment: "Not sure exercises are right for me, more painful"
- **Dropout Reason**: **Loss of Trust in Treatment**
- **AI Should Generate**: Email validating concerns, encourage therapist consultation

#### 9. **Nina Patel** - Family Overwhelm
- **Injury**: Meniscus Repair
- **Risk Score**: ~8/10 🚨
- **Key Indicators**:
  - 25% compliance
  - 1 cancellation + 1 no-show
  - Worsening pain
  - Sentiment: "Too busy with family, knee hurts during exercises"
- **Dropout Reason**: **External Life Stressors + Pain**
- **AI Should Generate**: Supportive email, suggest simplified routine

#### 10. **Rachel Green** - Complete Frustration
- **Injury**: Lower Back Pain Management
- **Risk Score**: ~10/10 🚨
- **Key Indicators**:
  - 15% compliance (extremely low)
  - 0 logins
  - 40 days inactive
  - 3 cancellations + 1 no-show
  - Worsening pain
  - Very frustrated: "Nothing helps, feeling defeated"
- **Dropout Reason**: **Treatment Ineffectiveness + Hopelessness**
- **AI Should Generate**: Crisis-level care email, urgent therapist referral

#### 11. **Marcus Thompson** - Anxiety About Progress
- **Injury**: Hip Replacement Recovery
- **Risk Score**: ~7/10 ⚠️
- **Key Indicators**:
  - 55% compliance
  - 2 cancellations
  - Stagnant progress
  - Anxious sentiment: "Expected to be further along, is this normal?"
- **Dropout Reason**: **Anxiety / Lack of Benchmarking**
- **AI Should Generate**: Reassuring email, education on typical recovery

#### 12. **Sophia Martinez** - Fear of Re-injury
- **Injury**: Hamstring Strain Recovery
- **Risk Score**: ~7/10 ⚠️
- **Key Indicators**:
  - 35% compliance
  - 1 no-show
  - New patient (2 weeks)
  - Uncertain sentiment: "Not sure doing exercises correctly, afraid of re-injury"
- **Dropout Reason**: **Fear / Lack of Confidence**
- **AI Should Generate**: Encouraging email, offer form-check resources

---

## 🧪 Testing Scenarios

### Scenario 1: Test Single High-Risk Patient (Your Email)
```bash
curl -X POST http://localhost:3000/api/analyze-patients \
  -H "Content-Type: application/json" \
  -d '{"patientIds": ["2"]}'
```
**Expected**: Sarah Johnson (yangqiqi789@gmail.com) gets risk score ~10, email sent

### Scenario 2: Test All Critical Patients
```bash
curl -X POST http://localhost:3000/api/analyze-patients \
  -H "Content-Type: application/json" \
  -d '{"patientIds": ["2", "3", "6", "10"]}'
```
**Expected**: 4 emails sent to most critical patients

### Scenario 3: Test Full Analysis (All Patients)
```bash
curl -X POST http://localhost:3000/api/analyze-patients \
  -H "Content-Type: application/json" \
  -d '{}'
```
**Expected**: ~8-9 patients flagged as high-risk (score ≥7)

### Scenario 4: Test Different Dropout Reasons
Use the admin panel to analyze all patients and observe:
- Different AI reasoning for each patient
- Personalized email content based on specific concerns
- Varied recommendations

---

## 📧 Expected Email Themes by Dropout Reason

| Dropout Reason | Example Patient | Email Should Emphasize |
|----------------|-----------------|------------------------|
| **Lack of Progress** | Sarah, David | Community support, "progress takes time" |
| **Pain Increase** | Mike, Lisa, Nina | Validate concerns, encourage therapist contact |
| **Time/Overwhelm** | Carlos, Nina | Flexibility, simplified routines |
| **Boredom** | David | New challenges, community tips |
| **Anxiety** | Marcus, Sophia | Reassurance, education, benchmarks |
| **Loss of Hope** | Rachel, Mike | Urgent support, alternative approaches |
| **Treatment Doubt** | Lisa | Trust-building, therapist consultation |
| **Fear** | Sophia | Confidence-building, safety assurance |

---

## 🎯 AI Analysis Accuracy Check

After running analysis, verify the AI correctly identifies:

✅ **Primary Risk Factors**:
- Low compliance (< 50%)
- Platform disengagement (< 2 logins/week)
- Community silence (> 14 days)
- Appointment issues (cancellations/no-shows)
- Worsening/stagnant pain trend
- Negative sentiment in posts

✅ **Personalization**:
- Email addresses patient by name
- Mentions their specific injury
- Reflects their unique concerns from sentiment analysis
- Provides relevant community link

✅ **Tone**:
- Warm and empathetic (not clinical)
- Non-judgmental
- Community-focused (not institution-focused)
- Action-oriented but gentle

---

## 🔍 Quick Reference: Risk Scores by Patient

| Patient | Risk | Compliance | Activity | Main Issue |
|---------|------|------------|----------|------------|
| John Smith | ⭐ 1/10 | 85% | High | None |
| Emma Davis | ⭐ 3/10 | 70% | Medium | None |
| Carlos Rodriguez | ⚠️ 7/10 | 45% | Low | Work overload |
| David Kim | ⚠️ 7/10 | 40% | Low | Bored/plateau |
| Thomas Anderson | ⚠️ 7/10 | 50% | Medium | Impatient |
| Marcus Thompson | ⚠️ 7/10 | 55% | Low | Anxious |
| Sophia Martinez | ⚠️ 7/10 | 35% | Low | Fearful |
| **Sarah Johnson** | 🚨 10/10 | 35% | Very Low | Discouraged |
| Nina Patel | 🚨 8/10 | 25% | Low | Family burden |
| Lisa Chen | 🚨 9/10 | 30% | None | Treatment doubt |
| **Mike Wilson** | 🚨 10/10 | 20% | None | Hopeless |
| **Rachel Green** | 🚨 10/10 | 15% | None | Defeated |

---

## 💡 Pro Tips for Testing

1. **Check Browser Console** (F12 → Console) to see:
   - AI analysis reasoning for each patient
   - Generated email content (in demo mode)
   - Detailed logs of the process

2. **Use Admin Panel** for visual analysis:
   - Navigate to `http://localhost:3000/admin/patient-care`
   - Click "View Details" to see full AI output
   - Compare reasoning across different patients

3. **Test Email Personalization**:
   - Temporarily change different patients' emails to yours
   - Observe how AI tailors messages to different situations

4. **Monitor Risk Patterns**:
   - Note which combinations of factors trigger highest risk scores
   - Verify AI weighs sentiment heavily (as it should)

---

## 🎓 Learning Outcomes

This diverse dataset demonstrates:

✅ **AI's ability to**:
- Identify multiple dropout risk patterns
- Provide nuanced, context-aware analysis
- Generate personalized, empathetic communications
- Prioritize patients by urgency

✅ **System's capability to**:
- Handle various patient scenarios
- Scale to larger patient populations
- Provide actionable insights to care teams
- Automate early intervention at scale

---

**Ready to test?** Start with Sarah Johnson (patient ID: 2) and see the magic happen! ✨

