'use client'

import { cn } from '@/lib/utils'
import { AlertTriangle, CheckCircle, Clock, Mail, Play, RefreshCw, Users, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

interface AnalysisResult {
  patientId: string
  patientName: string
  email: string
  riskScore: number
  reasoning: string
  recommendations?: string[]
  emailSent: boolean
  emailContent?: string
  timestamp: string
  error?: string
}

interface AnalysisSummary {
  patientsAnalyzed: number
  highRiskPatients: number
  emailsSent: number
  duration: string
  timestamp: string
}

export default function PatientCareAdminPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<AnalysisResult[]>([])
  const [summary, setSummary] = useState<AnalysisSummary | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedPatient, setSelectedPatient] = useState<AnalysisResult | null>(null)

  // Load initial data
  useEffect(() => {
    loadPatientData()
  }, [])

  const loadPatientData = async () => {
    try {
      const response = await fetch('/api/analyze-patients')
      const data = await response.json()

      if (data.success) {
        // Show current patient status
        console.log('Current patients:', data.patients)
      }
    } catch (error) {
      console.error('Error loading patient data:', error)
    }
  }

  const runAnalysis = async (manual = false) => {
    setIsLoading(true)
    setError(null)

    try {
      const endpoint = manual ? '/api/cron/patient-care' : '/api/analyze-patients'
      const options = manual
        ? {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ secret: 'test-manual-trigger' })
        }
        : { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' }

      const response = await fetch(endpoint, options)
      const data = await response.json()

      if (data.success) {
        setResults(data.results || [])
        setSummary(data.summary || {
          patientsAnalyzed: data.analyzed || 0,
          highRiskPatients: data.highRiskPatients || 0,
          emailsSent: data.emailsSent || 0,
          duration: '0ms',
          timestamp: new Date().toISOString()
        })
      } else {
        setError(data.error || 'Analysis failed')
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }

  const getRiskColor = (score: number) => {
    if (score >= 8) return 'text-red-600 bg-red-50 border-red-200'
    if (score >= 6) return 'text-orange-600 bg-orange-50 border-orange-200'
    if (score >= 4) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    return 'text-green-600 bg-green-50 border-green-200'
  }

  const getRiskLabel = (score: number) => {
    if (score >= 8) return 'Critical'
    if (score >= 6) return 'High'
    if (score >= 4) return 'Medium'
    return 'Low'
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Care AI Dashboard</h1>
          <p className="text-gray-600">Monitor patient engagement and send automated care emails</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Analysis Controls</h2>
              <p className="text-sm text-gray-600">Run patient risk analysis and send care emails</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => runAnalysis(false)}
                disabled={isLoading}
                className={cn(
                  "flex items-center px-4 py-2 rounded-lg font-medium transition-colors",
                  isLoading
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-[#8573bd] text-white hover:bg-[#E8B98A]"
                )}
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Play className="w-4 h-4 mr-2" />
                )}
                Run Analysis
              </button>
              <button
                onClick={() => runAnalysis(true)}
                disabled={isLoading}
                className={cn(
                  "flex items-center px-4 py-2 rounded-lg font-medium border transition-colors",
                  isLoading
                    ? "border-gray-200 text-gray-400 cursor-not-allowed"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                )}
              >
                <Clock className="w-4 h-4 mr-2" />
                Simulate Cron
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <XCircle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-800 font-medium">Error: {error}</span>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-[#EAE6F5] rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#8573bd]" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Patients Analyzed</p>
                  <p className="text-2xl font-bold text-gray-900">{summary.patientsAnalyzed}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">High Risk</p>
                  <p className="text-2xl font-bold text-gray-900">{summary.highRiskPatients}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Emails Sent</p>
                  <p className="text-2xl font-bold text-gray-900">{summary.emailsSent}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-[#E8B98A]" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="text-2xl font-bold text-gray-900">{summary.duration}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Table */}
        {results.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Analysis Results</h2>
              <p className="text-sm text-gray-600 mt-1">
                Last updated: {summary?.timestamp ? new Date(summary.timestamp).toLocaleString() : 'Never'}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Risk Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reasoning
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.map((result) => (
                    <tr key={result.patientId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{result.patientName}</div>
                          <div className="text-sm text-gray-500">{result.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                          getRiskColor(result.riskScore)
                        )}>
                          {result.riskScore}/10 - {getRiskLabel(result.riskScore)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {result.emailSent ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                              <span className="text-sm text-green-700">Sent</span>
                            </>
                          ) : result.riskScore >= 7 ? (
                            <>
                              <XCircle className="w-4 h-4 text-red-500 mr-2" />
                              <span className="text-sm text-red-700">Failed</span>
                            </>
                          ) : (
                            <span className="text-sm text-gray-500">Not needed</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {result.reasoning}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedPatient(result)}
                          className="text-[#8573bd] hover:text-[#E8B98A]"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Patient Detail Modal */}
        {selectedPatient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Patient Details: {selectedPatient.patientName}
                  </h3>
                  <button
                    onClick={() => setSelectedPatient(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Risk Analysis</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <span className="text-sm text-gray-600 mr-2">Risk Score:</span>
                      <span className={cn(
                        "px-2 py-1 rounded text-xs font-medium",
                        getRiskColor(selectedPatient.riskScore)
                      )}>
                        {selectedPatient.riskScore}/10
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{selectedPatient.reasoning}</p>
                  </div>
                </div>

                {selectedPatient.recommendations && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Recommendations</h4>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      {selectedPatient.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedPatient.emailContent && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Generated Email</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                        {selectedPatient.emailContent}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
