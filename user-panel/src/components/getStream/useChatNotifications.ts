"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import type { StreamChat, Channel as StreamChannel, Event } from "stream-chat"

interface NotificationState {
    totalUnreadCount: number
    channelUnreadCounts: Record<string, number>
    hasNewMessages: boolean
    lastMessageTime: number
}

interface NotificationSettings {
    soundEnabled: boolean
    desktopNotificationsEnabled: boolean
    showMessagePreview: boolean
    notificationDuration: number
    quietHoursEnabled: boolean
    quietHoursStart: string
    quietHoursEnd: string
}

export const useChatNotifications = (
    client: StreamChat | null,
    allChannels: StreamChannel[],
    currentChannelId?: string,
) => {
    const [notifications, setNotifications] = useState<NotificationState>({
        totalUnreadCount: 0,
        channelUnreadCounts: {},
        hasNewMessages: false,
        lastMessageTime: 0,
    })

    const [settings, setSettings] = useState<NotificationSettings>({
        soundEnabled: true,
        desktopNotificationsEnabled: false,
        showMessagePreview: true,
        notificationDuration: 5000,
        quietHoursEnabled: false,
        quietHoursStart: "22:00",
        quietHoursEnd: "08:00",
    })

    const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>("default")
    const activeNotifications = useRef<Notification[]>([])

    // Initialize notification permission status
    useEffect(() => {
        if ("Notification" in window) {
            setPermissionStatus(Notification.permission)
            setSettings((prev) => ({
                ...prev,
                desktopNotificationsEnabled: Notification.permission === "granted",
            }))
        }
    }, [])

    // Request notification permission
    const requestNotificationPermission = useCallback(async () => {
        if (!("Notification" in window)) {
            alert("This browser does not support desktop notifications")
            return false
        }

        try {
            const permission = await Notification.requestPermission()
            setPermissionStatus(permission)

            if (permission === "granted") {
                setSettings((prev) => ({ ...prev, desktopNotificationsEnabled: true }))

                // Show welcome notification
                const welcomeNotification = new Notification("Notifications Enabled! 🎉", {
                    body: "You'll now receive notifications for new chat messages.",
                    icon: "/favicon.ico",
                    badge: "/favicon.ico",
                    tag: "welcome-notification",
                    requireInteraction: false,
                })

                setTimeout(() => welcomeNotification.close(), 3000)
                return true
            } else {
                setSettings((prev) => ({ ...prev, desktopNotificationsEnabled: false }))
                return false
            }
        } catch (error) {
            console.error("Error requesting notification permission:", error)
            return false
        }
    }, [])

    // Check if we're in quiet hours
    const isQuietHours = useCallback(() => {
        if (!settings.quietHoursEnabled) return false

        const now = new Date()
        const currentTime = now.getHours() * 60 + now.getMinutes()

        const [startHour, startMin] = settings.quietHoursStart.split(":").map(Number)
        const [endHour, endMin] = settings.quietHoursEnd.split(":").map(Number)

        const startTime = startHour * 60 + startMin
        const endTime = endHour * 60 + endMin

        if (startTime <= endTime) {
            return currentTime >= startTime && currentTime <= endTime
        } else {
            // Quiet hours span midnight
            return currentTime >= startTime || currentTime <= endTime
        }
    }, [settings.quietHoursEnabled, settings.quietHoursStart, settings.quietHoursEnd])

    // Play notification sound
    const playNotificationSound = useCallback(() => {
        if (!settings.soundEnabled || isQuietHours()) return

        try {
            const audio = new Audio("/notification-sound.mp3")
            audio.volume = 0.3
            audio.play().catch(() => {
                // Fallback to system beep if audio file not available
                if (window.navigator && (window.navigator as any).vibrate) {
                    ;(window.navigator as any).vibrate([200, 100, 200])
                }
            })
        } catch (error) {
            console.log("Could not play notification sound")
        }
    }, [settings.soundEnabled, isQuietHours])

    // Clear all active notifications
    const clearAllNotifications = useCallback(() => {
        activeNotifications.current.forEach((notification) => {
            try {
                notification.close()
            } catch (error) {
                console.log("Error closing notification:", error)
            }
        })
        activeNotifications.current = []
    }, [])

    // Show desktop notification
    const showDesktopNotification = useCallback(
        (title: string, body: string, channelId: string, messageId?: string) => {
            if (!settings.desktopNotificationsEnabled || permissionStatus !== "granted" || isQuietHours()) {
                return
            }

            try {
                // Clear previous notifications to avoid spam
                clearAllNotifications()

                const notification = new Notification(title, {
                    body: settings.showMessagePreview ? body : "New message received",
                    icon: "/favicon.ico",
                    badge: "/favicon.ico",
                    tag: `chat-${channelId}-${messageId || Date.now()}`,
                    requireInteraction: false,
                    silent: false,
                    data: {
                        channelId,
                        messageId,
                        timestamp: Date.now(),
                    },
                })

                // Add to active notifications
                activeNotifications.current.push(notification)

                // Handle notification click
                notification.onclick = () => {
                    window.focus()
                    // You can add logic here to open specific channel
                    notification.close()
                }

                // Handle notification close
                notification.onclose = () => {
                    activeNotifications.current = activeNotifications.current.filter((n) => n !== notification)
                }

                // Handle notification error
                notification.onerror = (error) => {
                    console.error("Notification error:", error)
                    activeNotifications.current = activeNotifications.current.filter((n) => n !== notification)
                }

                // Auto-close after specified duration
                setTimeout(() => {
                    try {
                        notification.close()
                    } catch (error) {
                        console.log("Error auto-closing notification:", error)
                    }
                }, settings.notificationDuration)
            } catch (error) {
                console.error("Error showing desktop notification:", error)
            }
        },
        [
            settings.desktopNotificationsEnabled,
            settings.showMessagePreview,
            settings.notificationDuration,
            permissionStatus,
            isQuietHours,
            clearAllNotifications,
        ],
    )

    // Calculate unread counts
    const calculateUnreadCounts = useCallback(() => {
        if (!client || !allChannels.length) {
            setNotifications((prev) => ({ ...prev, totalUnreadCount: 0, channelUnreadCounts: {} }))
            return
        }

        let totalUnread = 0
        const channelCounts: Record<string, number> = {}

        allChannels.forEach((channel) => {
            const unreadCount = channel.countUnread()
            channelCounts[channel.id || channel.cid] = unreadCount

            // Don't count unread messages from the currently open channel
            if (channel.id !== currentChannelId && channel.cid !== currentChannelId) {
                totalUnread += unreadCount
            }
        })

        setNotifications((prev) => ({
            ...prev,
            totalUnreadCount: totalUnread,
            channelUnreadCounts: channelCounts,
            hasNewMessages: totalUnread > prev.totalUnreadCount,
        }))
    }, [client, allChannels, currentChannelId])

    // Handle new message events
    useEffect(() => {
        if (!client) return

        const handleNewMessage = (event: Event) => {
            if (event.type === "message.new" && event.message && event.channel_id) {
                const isFromCurrentChannel = event.channel_id === currentChannelId
                const isFromCurrentUser = event.message.user?.id === client.userID

                // Don't notify for own messages or messages from current channel
                if (!isFromCurrentUser && !isFromCurrentChannel) {
                    setNotifications((prev) => ({
                        ...prev,
                        hasNewMessages: true,
                        lastMessageTime: Date.now(),
                    }))

                    // Play sound notification
                    playNotificationSound()

                    // Show desktop notification
                    const senderName = event.message.user?.name || "Someone"
                    const channelName = (event.channel?.name as { name?: string })?.name || "Chat"
                    const messageText = event.message.text || "Sent a message"

                    showDesktopNotification(
                        `💬 New message in ${channelName}`,
                        `${senderName}: ${messageText}`,
                        event.channel_id,
                        event.message.id,
                    )
                }
            }
        }

        client.on("message.new", handleNewMessage)
        return () => client.off("message.new", handleNewMessage)
    }, [client, currentChannelId, playNotificationSound, showDesktopNotification])

    // Update unread counts when channels change
    useEffect(() => {
        calculateUnreadCounts()
    }, [calculateUnreadCounts])

    // Set up interval to periodically update counts
    useEffect(() => {
        const interval = setInterval(calculateUnreadCounts, 2000)
        return () => clearInterval(interval)
    }, [calculateUnreadCounts])

    // Clean up notifications on unmount
    useEffect(() => {
        return () => {
            clearAllNotifications()
        }
    }, [clearAllNotifications])

    // Mark notifications as seen
    const markNotificationsAsSeen = useCallback(() => {
        setNotifications((prev) => ({
            ...prev,
            hasNewMessages: false,
        }))
        clearAllNotifications()
    }, [clearAllNotifications])

    // Update settings
    const updateSettings = useCallback((newSettings: Partial<NotificationSettings>) => {
        setSettings((prev) => ({ ...prev, ...newSettings }))
    }, [])

    // Test notification
    const testNotification = useCallback(() => {
        if (permissionStatus === "granted") {
            showDesktopNotification(
                "🧪 Test Notification",
                "This is a test notification to check if everything is working!",
                "test-channel",
                "test-message",
            )
            playNotificationSound()
        }
    }, [showDesktopNotification, playNotificationSound, permissionStatus])

    return {
        ...notifications,
        ...settings,
        permissionStatus,
        markNotificationsAsSeen,
        updateSettings,
        requestNotificationPermission,
        testNotification,
        clearAllNotifications,
        refreshCounts: calculateUnreadCounts,
    }
}
