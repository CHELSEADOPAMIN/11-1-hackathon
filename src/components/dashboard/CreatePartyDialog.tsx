'use client'

import { currentUser, userInterests, Party } from '@/lib/mockData'
import { cn } from '@/lib/utils'
import { X, Users } from 'lucide-react'
import { useState } from 'react'

interface CreatePartyDialogProps {
  isOpen: boolean
  onClose: () => void
  onCreateParty: (party: Omit<Party, 'id' | 'memberCount' | 'createdAt'>) => void
}

export default function CreatePartyDialog({
  isOpen,
  onClose,
  onCreateParty
}: CreatePartyDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: userInterests[0] || '',
    maxMembers: 6
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  if (!isOpen) return null

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'maxMembers' ? parseInt(value) || 6 : value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Party name is required'
    } else if (formData.name.length < 3) {
      newErrors.name = 'Party name must be at least 3 characters'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters'
    }

    if (!formData.category) {
      newErrors.category = 'Category is required'
    }

    if (formData.maxMembers < 2 || formData.maxMembers > 6) {
      newErrors.maxMembers = 'Maximum members must be between 2 and 6'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    onCreateParty({
      name: formData.name.trim(),
      description: formData.description.trim(),
      category: formData.category,
      maxMembers: formData.maxMembers,
      organizer: currentUser
    })

    // Reset form
    setFormData({
      name: '',
      description: '',
      category: userInterests[0] || '',
      maxMembers: 6
    })
    setErrors({})
    onClose()
  }

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      category: userInterests[0] || '',
      maxMembers: 6
    })
    setErrors({})
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Create New Party</h2>
              <p className="text-sm text-gray-500 mt-1">Start your own community</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Party Name */}
            <div className="md:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2.5">
                Party Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Knee Recovery Support Group"
                className={cn(
                  "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors",
                  errors.name ? "border-red-300 bg-red-50" : "border-gray-300"
                )}
              />
              {errors.name && (
                <p className="mt-1.5 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2.5">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe what your party is about and what members can expect..."
                rows={5}
                className={cn(
                  "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors resize-none",
                  errors.description ? "border-red-300 bg-red-50" : "border-gray-300"
                )}
              />
              {errors.description && (
                <p className="mt-1.5 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2.5">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={cn(
                  "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors bg-white",
                  errors.category ? "border-red-300 bg-red-50" : "border-gray-300"
                )}
              >
                {userInterests.map((interest) => (
                  <option key={interest} value={interest}>
                    {interest}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1.5 text-sm text-red-600">{errors.category}</p>
              )}
            </div>

            {/* Max Members */}
            <div>
              <label htmlFor="maxMembers" className="block text-sm font-medium text-gray-700 mb-2.5">
                Maximum Members *
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  id="maxMembers"
                  name="maxMembers"
                  value={formData.maxMembers}
                  onChange={handleInputChange}
                  min="2"
                  max="6"
                  className={cn(
                    "w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors",
                    errors.maxMembers ? "border-red-300 bg-red-50" : "border-gray-300"
                  )}
                />
              </div>
              {errors.maxMembers && (
                <p className="mt-1.5 text-sm text-red-600">{errors.maxMembers}</p>
              )}
              <p className="mt-2 text-xs text-gray-500">
                Parties are limited to a maximum of 6 members for focused support
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
            >
              Create Party
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

