'use client'

import { currentUser } from '@/lib/mockData'
import { Calendar, Download, Dumbbell, Edit, FileText, User } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)

  // Mock data for the profile
  const nextAppointment = {
    date: 'November 28, 2025',
    time: '10:30 AM',
    therapist: 'Dr. Wang',
    location: 'Rehabilitation Center A'
  }

  const exercisePlan = {
    filename: 'rehabilitation-exercise-plan-alex.pdf',
    updatedDate: 'November 15, 2025',
    size: '2.3 MB'
  }

  const handleDownloadPlan = () => {
    // Mock download functionality
    alert('Downloading exercise plan...')
  }

  const handleEditProfile = () => {
    setIsEditing(!isEditing)
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      {/* Profile Banner */}
      <div className="bg-[#8573bd] px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 bg-[#E8B98A] rounded-full flex items-center justify-center border-2 border-[#E8B98A]">
                  <User className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#8573bd] rounded-full border-2 border-white"></div>
              </div>

              {/* User Info */}
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">{currentUser.name}</h1>
                <p className="text-white text-sm mb-1">{currentUser.email}</p>
                <div className="flex items-center text-[#EAE6F5] text-sm">
                  <div className="w-2 h-2 bg-[#E8B98A] rounded-full mr-2"></div>
                  <span>Online</span>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <button
              onClick={handleEditProfile}
              className="flex items-center px-4 py-2 border border-white text-white rounded-lg hover:bg-white hover:text-[#8573bd] transition-colors"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {/* Next Appointment Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 md:col-span-2 lg:col-span-1">
            <div className="flex items-center mb-4">
              <Calendar className="w-5 h-5 text-[#8573bd] mr-2" />
              <h2 className="text-lg font-semibold text-[#0F1620]">Next Appointment</h2>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-2xl font-bold text-[#0F1620] mb-1">
                  {nextAppointment.date}
                </p>
                <p className="text-xl font-semibold text-[#0F1620]">
                  {nextAppointment.time}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-[#5B626D] text-sm">
                  Therapist: {nextAppointment.therapist}
                </p>
                <p className="text-[#5B626D] text-sm">
                  Location: {nextAppointment.location}
                </p>
              </div>

              <div className="flex space-x-3 pt-2">
                <button className="text-[#8573bd] text-sm hover:underline">
                  Reschedule
                </button>
                <button className="text-red-500 text-sm hover:underline">
                  Cancel
                </button>
              </div>
            </div>
          </div>

          {/* Exercise Plan Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 md:col-span-2">
            <div className="flex items-center mb-4">
              <Dumbbell className="w-5 h-5 text-[#8573bd] mr-2" />
              <h2 className="text-lg font-semibold text-[#0F1620]">My Exercise Plan</h2>
            </div>

            <p className="text-[#5B626D] text-sm mb-6">
              This is your personalized rehabilitation exercise plan created by Dr. Wang. Please download and follow consistently.
            </p>

            {/* PDF Preview Module */}
            <div className="border border-gray-200 rounded-lg p-4 hover:border-[#8573bd] transition-colors cursor-pointer group">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* PDF Icon */}
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-red-600" />
                  </div>

                  {/* File Info */}
                  <div>
                    <p className="font-medium text-[#0F1620] group-hover:text-[#8573bd] transition-colors">
                      {exercisePlan.filename}
                    </p>
                    <p className="text-[#5B626D] text-sm">
                      Updated: {exercisePlan.updatedDate} • {exercisePlan.size}
                    </p>
                  </div>
                </div>

                {/* Download Button */}
                <button
                  onClick={handleDownloadPlan}
                  className="bg-[#8573bd] text-white px-4 py-2 rounded-lg hover:bg-[#E8B98A] transition-colors flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </button>
              </div>
            </div>
          </div>

          {/* Personal Details Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 md:col-span-2 lg:col-span-1">
            <div className="flex items-center mb-4">
              <User className="w-5 h-5 text-[#8573bd] mr-2" />
              <h2 className="text-lg font-semibold text-[#0F1620]">Personal Details</h2>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-[#5B626D] text-sm">Name</span>
                <span className="text-[#0F1620] font-medium">{currentUser.name}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#5B626D] text-sm">Email</span>
                <span className="text-[#0F1620] font-medium">{currentUser.email}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#5B626D] text-sm">Primary Therapist</span>
                <span className="text-[#0F1620] font-medium">Dr. Wang</span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#5B626D] text-sm">Injury Type</span>
                <span className="text-[#0F1620] font-medium">{currentUser.injuryType}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#5B626D] text-sm">Join Date</span>
                <span className="text-[#0F1620] font-medium">{currentUser.joinDate}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#5B626D] text-sm">Phone</span>
                <span className="text-[#0F1620] font-medium">+1 (555) 123-4567</span>
              </div>
            </div>
          </div>

          {/* Recovery Progress Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 md:col-span-2">
            <div className="flex items-center mb-4">
              <Calendar className="w-5 h-5 text-[#8573bd] mr-2" />
              <h2 className="text-lg font-semibold text-[#0F1620]">Recovery Progress</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#8573bd] mb-1">85%</div>
                <div className="text-[#5B626D] text-sm">Overall Progress</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-[#0F1620] mb-1">42</div>
                <div className="text-[#5B626D] text-sm">Recovery Days</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-[#0F1620] mb-1">28</div>
                <div className="text-[#5B626D] text-sm">Completed Sessions</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-[#0F1620] mb-1">5</div>
                <div className="text-[#5B626D] text-sm">Appointments</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between text-sm text-[#5B626D] mb-2">
                <span>Recovery Progress</span>
                <span>85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-[#8573bd] h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 md:col-span-2 lg:col-span-1">
            <div className="flex items-center mb-4">
              <Calendar className="w-5 h-5 text-[#8573bd] mr-2" />
              <h2 className="text-lg font-semibold text-[#0F1620]">Quick Actions</h2>
            </div>

            <div className="space-y-3">
              <Link
                href="/dashboard/calendar"
                className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-[#8573bd] hover:bg-[#8573bd]/5 transition-colors group"
              >
                <Calendar className="w-5 h-5 text-[#5B626D] group-hover:text-[#8573bd] mr-3" />
                <span className="text-[#0F1620] group-hover:text-[#8573bd] font-medium">Book Therapy</span>
              </Link>

              <Link
                href="/dashboard/lobby"
                className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-[#8573bd] hover:bg-[#8573bd]/5 transition-colors group"
              >
                <User className="w-5 h-5 text-[#5B626D] group-hover:text-[#8573bd] mr-3" />
                <span className="text-[#0F1620] group-hover:text-[#8573bd] font-medium">Community</span>
              </Link>

              <Link
                href="/dashboard/knowledge"
                className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-[#8573bd] hover:bg-[#8573bd]/5 transition-colors group"
              >
                <FileText className="w-5 h-5 text-[#5B626D] group-hover:text-[#8573bd] mr-3" />
                <span className="text-[#0F1620] group-hover:text-[#8573bd] font-medium">Knowledge Base</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
