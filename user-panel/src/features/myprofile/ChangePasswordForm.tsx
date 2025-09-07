import React, { useState } from "react"
import { CheckIcon, LockClosedIcon } from "@radix-ui/react-icons"

interface ChangePasswordFormProps {
  // You can add props here if needed, such as user ID or callbacks
}

export default function ChangePasswordForm({ }: ChangePasswordFormProps) {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  })
  
  const [isSavingPassword, setIsSavingPassword] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")
  const [passwordError, setPasswordError] = useState("")

  const handleSavePassword = async () => {
    // Validate passwords
    if (!passwordData.currentPassword) {
      setPasswordError("Current password is required")
      return
    }
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setPasswordError("New password and confirmation do not match")
      return
    }
    if (passwordData.newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long")
      return
    }

    setIsSavingPassword(true)
    try {
      // Note: You'll need to implement password change endpoint in your API
      // await changePasswordFn({
      //   currentPassword: passwordData.currentPassword,
      //   newPassword: passwordData.newPassword
      // })
      
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setPasswordData({ currentPassword: "", newPassword: "", confirmNewPassword: "" })
      setPasswordError("")
      setSaveMessage("Password updated successfully!")
      setTimeout(() => setSaveMessage(""), 3000)
    } catch (error) {
      setPasswordError("Failed to update password. Please try again.")
    } finally {
      setIsSavingPassword(false)
    }
  }

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }))
    setPasswordError("")
  }

  return (
    <div className="bg-white">
      <div className="p-4 sm:p-6">
        {/* Header with icon */}
        <div className="flex items-center mb-4 sm:mb-6">
          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mr-3 sm:hidden">
            <LockClosedIcon className="w-4 h-4 text-emerald-600" />
          </div>
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">Change Password</h2>
        </div>
        
        <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-1 lg:grid-cols-3 sm:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Current Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm hover:border-gray-400 transition-colors"
              required
              placeholder="Enter current password"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              New Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm hover:border-gray-400 transition-colors"
              required
              placeholder="Enter new password"
            />
            <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Confirm New Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={passwordData.confirmNewPassword}
              onChange={(e) => handlePasswordChange('confirmNewPassword', e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm hover:border-gray-400 transition-colors"
              required
              placeholder="Confirm new password"
            />
          </div>
        </div>

        {/* Error and Success Messages */}
        {(passwordError || saveMessage) && (
          <div className="mt-4">
            {passwordError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{passwordError}</p>
              </div>
            )}
            {saveMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <div className="flex items-center text-emerald-600">
                  <CheckIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="text-sm font-medium">{saveMessage}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end mt-6 sm:mt-8">
          <button
            onClick={handleSavePassword}
            disabled={isSavingPassword}
            className="w-full sm:w-auto px-4 sm:px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
          >
            {isSavingPassword ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Updating...
              </>
            ) : (
              "Update Password"
            )}
          </button>
        </div>

        {/* Password Requirements - Mobile only */}
        <div className="mt-4 sm:hidden">
          <div className="bg-gray-50 rounded-lg p-3">
            <h4 className="text-xs font-medium text-gray-700 mb-2">Password Requirements:</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li className="flex items-center">
                <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                At least 8 characters long
              </li>
              <li className="flex items-center">
                <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                Use a mix of letters and numbers
              </li>
              <li className="flex items-center">
                <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                Avoid common passwords
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}