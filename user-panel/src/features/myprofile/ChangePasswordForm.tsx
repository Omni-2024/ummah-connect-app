import React, { useState } from "react"
import { CheckIcon } from "@radix-ui/react-icons"

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
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            />
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
            />
          </div>
          {passwordError && (
            <div className="md:col-span-3 text-sm text-red-600">{passwordError}</div>
          )}
          {saveMessage && (
            <div className="md:col-span-3 flex items-center text-emerald-600">
              <CheckIcon className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">{saveMessage}</span>
            </div>
          )}
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={handleSavePassword}
            disabled={isSavingPassword}
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center"
          >
            {isSavingPassword ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Saving...
              </>
            ) : (
              "Update Password"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}