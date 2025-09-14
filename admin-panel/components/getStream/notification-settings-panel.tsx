"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, Volume2, VolumeX, Eye, EyeOff, Clock, TestTube, Settings, X, AlertCircle } from "lucide-react"

interface NotificationSettingsPanelProps {
    isOpen: boolean
    onClose: () => void
    soundEnabled: boolean
    desktopNotificationsEnabled: boolean
    showMessagePreview: boolean
    notificationDuration: number
    quietHoursEnabled: boolean
    quietHoursStart: string
    quietHoursEnd: string
    permissionStatus: NotificationPermission
    onUpdateSettings: (settings: any) => void
    onRequestPermission: () => Promise<boolean>
    onTestNotification: () => void
}

export const NotificationSettingsPanel = ({
                                              isOpen,
                                              onClose,
                                              soundEnabled,
                                              desktopNotificationsEnabled,
                                              showMessagePreview,
                                              notificationDuration,
                                              quietHoursEnabled,
                                              quietHoursStart,
                                              quietHoursEnd,
                                              permissionStatus,
                                              onUpdateSettings,
                                              onRequestPermission,
                                              onTestNotification,
                                          }: NotificationSettingsPanelProps) => {
    const [isRequesting, setIsRequesting] = useState(false)

    const handlePermissionRequest = async () => {
        setIsRequesting(true)
        await onRequestPermission()
        setIsRequesting(false)
    }

    const getPermissionStatusColor = () => {
        switch (permissionStatus) {
            case "granted":
                return "text-green-600 bg-green-50"
            case "denied":
                return "text-red-600 bg-red-50"
            default:
                return "text-yellow-600 bg-yellow-50"
        }
    }

    const getPermissionStatusText = () => {
        switch (permissionStatus) {
            case "granted":
                return "Granted"
            case "denied":
                return "Denied"
            default:
                return "Not Requested"
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-white border-b border-gray-200 shadow-sm"
                >
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Settings className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Notification Settings</h3>
                                    <p className="text-sm text-gray-600">Customize your chat notification preferences</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Browser Notifications */}
                            <div className="space-y-4">
                                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                                    <Bell className="w-4 h-4" />
                                    Browser Notifications
                                </h4>

                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <p className="font-medium text-gray-900">Permission Status</p>
                                            <p className="text-sm text-gray-600">Allow browser notifications for new messages</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPermissionStatusColor()}`}>
                      {getPermissionStatusText()}
                    </span>
                                    </div>

                                    {permissionStatus !== "granted" && (
                                        <button
                                            onClick={handlePermissionRequest}
                                            disabled={isRequesting || permissionStatus === "denied"}
                                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                        >
                                            {isRequesting ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Requesting...
                                                </>
                                            ) : permissionStatus === "denied" ? (
                                                <>
                                                    <AlertCircle className="w-4 h-4" />
                                                    Permission Denied
                                                </>
                                            ) : (
                                                <>
                                                    <Bell className="w-4 h-4" />
                                                    Enable Notifications
                                                </>
                                            )}
                                        </button>
                                    )}

                                    {permissionStatus === "granted" && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={onTestNotification}
                                                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                            >
                                                <TestTube className="w-4 h-4" />
                                                Test Notification
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Sound Settings */}
                            <div className="space-y-4">
                                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                                    <Volume2 className="w-4 h-4" />
                                    Sound Settings
                                </h4>

                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        {soundEnabled ? (
                                            <Volume2 className="w-5 h-5 text-gray-600" />
                                        ) : (
                                            <VolumeX className="w-5 h-5 text-gray-400" />
                                        )}
                                        <div>
                                            <p className="font-medium text-gray-900">Sound Notifications</p>
                                            <p className="text-sm text-gray-600">Play sound when new messages arrive</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => onUpdateSettings({ soundEnabled: !soundEnabled })}
                                        className={`relative w-12 h-6 rounded-full transition-colors ${
                                            soundEnabled ? "bg-blue-600" : "bg-gray-300"
                                        }`}
                                    >
                                        <div
                                            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                                                soundEnabled ? "translate-x-7" : "translate-x-1"
                                            }`}
                                        />
                                    </button>
                                </div>
                            </div>

                            {/* Message Preview */}
                            <div className="space-y-4">
                                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                                    <Eye className="w-4 h-4" />
                                    Message Preview
                                </h4>

                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        {showMessagePreview ? (
                                            <Eye className="w-5 h-5 text-gray-600" />
                                        ) : (
                                            <EyeOff className="w-5 h-5 text-gray-400" />
                                        )}
                                        <div>
                                            <p className="font-medium text-gray-900">Show Message Content</p>
                                            <p className="text-sm text-gray-600">Display message text in notifications</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => onUpdateSettings({ showMessagePreview: !showMessagePreview })}
                                        className={`relative w-12 h-6 rounded-full transition-colors ${
                                            showMessagePreview ? "bg-blue-600" : "bg-gray-300"
                                        }`}
                                    >
                                        <div
                                            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                                                showMessagePreview ? "translate-x-7" : "translate-x-1"
                                            }`}
                                        />
                                    </button>
                                </div>
                            </div>

                            {/* Notification Duration */}
                            <div className="space-y-4">
                                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    Notification Duration
                                </h4>

                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="font-medium text-gray-900">Auto-close after</p>
                                        <span className="text-sm font-medium text-blue-600">{notificationDuration / 1000}s</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="2000"
                                        max="10000"
                                        step="1000"
                                        value={notificationDuration}
                                        onChange={(e) => onUpdateSettings({ notificationDuration: Number.parseInt(e.target.value) })}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span>2s</span>
                                        <span>10s</span>
                                    </div>
                                </div>
                            </div>

                            {/* Quiet Hours */}
                            <div className="space-y-4">
                                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    Quiet Hours
                                </h4>

                                <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-gray-900">Enable Quiet Hours</p>
                                            <p className="text-sm text-gray-600">Disable notifications during specified hours</p>
                                        </div>
                                        <button
                                            onClick={() => onUpdateSettings({ quietHoursEnabled: !quietHoursEnabled })}
                                            className={`relative w-12 h-6 rounded-full transition-colors ${
                                                quietHoursEnabled ? "bg-blue-600" : "bg-gray-300"
                                            }`}
                                        >
                                            <div
                                                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                                                    quietHoursEnabled ? "translate-x-7" : "translate-x-1"
                                                }`}
                                            />
                                        </button>
                                    </div>

                                    {quietHoursEnabled && (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                                                <input
                                                    type="time"
                                                    value={quietHoursStart}
                                                    onChange={(e) => onUpdateSettings({ quietHoursStart: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                                                <input
                                                    type="time"
                                                    value={quietHoursEnd}
                                                    onChange={(e) => onUpdateSettings({ quietHoursEnd: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
