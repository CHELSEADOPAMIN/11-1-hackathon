'use client'

import { AIMatchResult, PatientProfile } from '@/lib/mockData'
import { cn } from '@/lib/utils'
import { Brain, CheckCircle, Target, TrendingUp, Users, X, Zap } from 'lucide-react'

interface AIMatchDetailsProps {
  matchResult: AIMatchResult
  patientProfile: PatientProfile
  isOpen: boolean
  onClose: () => void
  onJoin: (partyId: string) => void
}

export default function AIMatchDetails({
  matchResult,
  patientProfile,
  isOpen,
  onClose,
  onJoin
}: AIMatchDetailsProps) {
  if (!isOpen) return null

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100'
    if (score >= 60) return 'text-[#8573bd] bg-[#EAE6F5]'
    return 'text-orange-600 bg-orange-100'
  }

  const getPhaseDescription = (phase: string) => {
    switch (phase) {
      case 'early': return 'Early Recovery (0-3 months)'
      case 'mid': return 'Mid Recovery (3-6 months)'
      case 'late': return 'Late Recovery (6+ months)'
      case 'maintenance': return 'Maintenance Phase'
      default: return phase
    }
  }

  const getGoalDescription = (goal: string) => {
    switch (goal) {
      case 'sport': return 'Return to Sports'
      case 'work': return 'Return to Work'
      case 'daily_life': return 'Daily Life Activities'
      case 'professional_athlete': return 'Professional Athletics'
      default: return goal
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Brain className="w-6 h-6 text-[#8573bd] mr-3" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">AI Match Analysis</h2>
              <p className="text-gray-600 text-sm">Why we recommend this group for you</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Match Score */}
        <div className="p-6 border-b border-gray-200">
          <div className="text-center">
            <div className={cn(
              "inline-flex items-center px-6 py-3 rounded-full text-2xl font-bold",
              getMatchScoreColor(matchResult.matchScore)
            )}>
              {matchResult.matchScore}% Match
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mt-3 mb-2">
              {matchResult.partyName}
            </h3>
            <p className="text-gray-600">
              {matchResult.expectedBenefit}
            </p>
          </div>
        </div>

        {/* Detailed Analysis */}
        <div className="p-6 space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Match Analysis</h3>

          {/* Recovery Phase */}
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">Recovery Phase Compatibility</h4>
              <p className="text-gray-600 text-sm mt-1">
                You're in the <strong>{getPhaseDescription(patientProfile.currentPhase)}</strong> phase
                with <strong>{patientProfile.recoveryProgress}%</strong> progress completed.
              </p>
              <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                <p className="text-blue-800 text-sm">
                  Group members are typically in similar recovery phases, ensuring relevant discussions
                  and shared experiences at your current stage.
                </p>
              </div>
            </div>
          </div>

          {/* Training Intensity */}
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Zap className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">Training Intensity Match</h4>
              <p className="text-gray-600 text-sm mt-1">
                Your training schedule: <strong>{patientProfile.weeklyTrainingDays} days/week</strong>,
                <strong> {patientProfile.dailyTrainingMinutes} minutes/day</strong>
              </p>
              <div className="mt-2 p-3 bg-green-50 rounded-lg">
                <p className="text-green-800 text-sm">
                  Compliance rate: <strong>{patientProfile.complianceRate}%</strong> -
                  You'll connect with members who have similar dedication levels.
                </p>
              </div>
            </div>
          </div>

          {/* Goals Alignment */}
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Target className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">Goal Alignment</h4>
              <p className="text-gray-600 text-sm mt-1">
                Your goal: <strong>{getGoalDescription(patientProfile.recoveryGoal)}</strong>
                {patientProfile.targetSport && (
                  <span> - <strong>{patientProfile.targetSport}</strong></span>
                )}
              </p>
              <div className="mt-2 p-3 bg-orange-50 rounded-lg">
                <p className="text-orange-800 text-sm">
                  Timeline: <strong>{patientProfile.targetTimeline} months</strong> -
                  Connect with others who share similar timelines and objectives.
                </p>
              </div>
            </div>
          </div>

          {/* Community Dynamics */}
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">Community Dynamics</h4>
              <p className="text-gray-600 text-sm mt-1">
                Your profile: <strong>{patientProfile.ageGroup}</strong>,
                <strong> {patientProfile.activityLevel}</strong> activity level
              </p>
              <div className="mt-2 p-3 bg-purple-50 rounded-lg">
                <p className="text-purple-800 text-sm">
                  Helpfulness score: <strong>{patientProfile.helpfulnessScore}/10</strong> -
                  You'll fit well with the group's supportive environment.
                </p>
              </div>
            </div>
          </div>

          {/* Match Reasons */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Key Matching Factors</h4>
            <div className="space-y-2">
              {matchResult.reasons.map((reason, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{reason}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-gray-200 flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Maybe Later
          </button>
          <button
            onClick={() => {
              onJoin(matchResult.partyId)
              onClose()
            }}
            className="flex-1 px-4 py-2 bg-[#8573bd] text-white rounded-lg hover:bg-[#E8B98A] transition-colors font-medium"
          >
            Join This Group
          </button>
        </div>
      </div>
    </div>
  )
}
