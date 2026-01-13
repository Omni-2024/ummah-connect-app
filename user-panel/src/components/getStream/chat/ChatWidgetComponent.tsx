"use client";

import { useEffect, useMemo, useState } from "react";
import { Chat, Channel, MessageList, MessageInput, Thread, Window } from "stream-chat-react";
import type { Channel as StreamChannelType } from "stream-chat";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, MessageCircle, Settings, User, CloseCircle } from "iconsax-react";
import { Minimize2 } from "lucide-react";

import { useChatClient } from "@/components/getStream/chat/useChatClient";
import { NotificationSettingsPanel } from "@/components/getStream/notification-settings-panel";
import { useChatNotifications } from "@/components/getStream/useChatNotifications";

type Props = {
    userId: string;
    otherUserId: string;
};

const FloatingChatWidget = ({ userId, otherUserId }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [showChannelList, setShowChannelList] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const { client, channel, isAdmin, selectChannel, allChannels } = useChatClient(userId, otherUserId);

    // ✅ "connected" is stronger than "client != null" (singleton client can exist while disconnected)
    const isConnected = !!client?.userID;

    // ✅ stream-chat-react <Channel /> expects `channel?: Channel` (undefined ok, null NOT ok)
    const activeChannel: StreamChannelType | undefined = channel ?? undefined;

    // ✅ stable key for notifications
    const activeChannelKey = useMemo(() => activeChannel?.cid ?? activeChannel?.id ?? "", [activeChannel]);

    const {
        totalUnreadCount,
        channelUnreadCounts,
        hasNewMessages,
        soundEnabled,
        desktopNotificationsEnabled,
        showMessagePreview,
        notificationDuration,
        quietHoursEnabled,
        quietHoursStart,
        quietHoursEnd,
        permissionStatus,
        markNotificationsAsSeen,
        updateSettings,
        requestNotificationPermission,
        testNotification,
    } = useChatNotifications(client, allChannels, activeChannelKey);

    // Check if mobile
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024); // lg breakpoint
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Mark notifications as seen when chat is opened
    useEffect(() => {
        if (isOpen) markNotificationsAsSeen();
    }, [isOpen, markNotificationsAsSeen]);

    const toggleChannelList = () => setShowChannelList((v) => !v);

    const handleChannelSelect = (ch: StreamChannelType) => {
        selectChannel(ch);
        setShowChannelList(false);
    };

    const handleChatOpen = () => {
        setIsOpen(true);
        setShowChannelList(false);
        markNotificationsAsSeen();
    };

    // If not connected, show nothing (or you can still show a disabled button if you want)
    if (!isConnected) return null;

    // If open but channel not ready -> show loading UI
    if (isOpen && !activeChannel) {
        return (
            <div className={`fixed z-[48] ${isMobile ? "bottom-20 right-4" : "bottom-4 right-4"}`}>
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`bg-white rounded-lg shadow-2xl flex flex-col border border-gray-200 ${
                        isMobile ? "fixed inset-x-4 z-[48]" : "w-96 h-[550px]"
                    }`}
                >
                    <div className="bg-primary-500 text-white p-4 flex items-center justify-between rounded-t-lg">
                        <h3 className="font-semibold">Loading Chat...</h3>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-primary-400 p-2 rounded">
                            <CloseCircle color="white" size={18} />
                        </button>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <>
            {isOpen && isMobile && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 z-[45] lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Chat Widget Container */}
            <div className={`fixed z-[48] ${isMobile ? "bottom-20 right-4" : "bottom-4 right-4"}`}>
                <AnimatePresence>
                    {!isOpen && (
                        <motion.div className="relative">
                            <motion.button
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0, rotate: 180 }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handleChatOpen}
                                className="bg-primary-500 hover:bg-primary-400 text-white rounded-full p-4 shadow-lg flex items-center justify-center transition-colors duration-200 relative"
                            >
                                <MessageCircle color="white" width={25} size={24} />

                                {/* Notification Badge */}
                                <AnimatePresence>
                                    {totalUnreadCount > 0 && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                            className="absolute -top-2 -right-2 min-w-[24px] h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-2 shadow-lg"
                                        >
                                            {totalUnreadCount > 99 ? "99+" : totalUnreadCount}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Pulsing ring */}
                                <AnimatePresence>
                                    {hasNewMessages && (
                                        <motion.div
                                            initial={{ scale: 1, opacity: 1 }}
                                            animate={{ scale: 1.5, opacity: 0 }}
                                            exit={{ scale: 1, opacity: 0 }}
                                            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                                            className="absolute inset-0 border-4 border-red-400 rounded-full"
                                        />
                                    )}
                                </AnimatePresence>
                            </motion.button>

                            {/* Floating Unread Indicator */}
                            {totalUnreadCount > 0 && !isMobile && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap shadow-lg"
                                >
                                    {totalUnreadCount} new message{totalUnreadCount !== 1 ? "s" : ""}
                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className={`bg-white rounded-lg shadow-2xl flex flex-col border border-gray-200 ${
                                isMobile
                                    ? "fixed inset-x-4 z-[48] lg:relative lg:inset-auto"
                                    : isMinimized
                                        ? "w-80 h-14"
                                        : isAdmin
                                            ? "w-[900px] h-[650px] max-w-[95vw] max-h-[90vh]"
                                            : "w-96 h-[550px] max-w-[95vw] max-h-[90vh]"
                            }`}
                            style={
                                isMobile
                                    ? {
                                        top: "5rem",
                                        bottom: "6rem",
                                        height: "auto",
                                        maxHeight: "80vh",
                                    }
                                    : undefined
                            }
                        >
                            {/* Header */}
                            <div className="bg-primary-500 text-white p-4 flex items-center justify-between rounded-t-lg min-h-[64px] flex-shrink-0">
                                <div className="flex items-center gap-3 flex-1 min-w-0 pr-3">
                                    {isAdmin && (
                                        <button
                                            onClick={toggleChannelList}
                                            className="hover:bg-primary-400 p-1 rounded transition-colors flex-shrink-0"
                                        >
                                            <Menu color="white" width={20} size={20} />
                                        </button>
                                    )}
                                    <div className="flex items-center gap-2 min-w-0 flex-1">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse flex-shrink-0" />
                                        <h3 className="font-semibold truncate text-sm sm:text-base">
                                            {activeChannel?.data?.name || "Support Chat"}
                                        </h3>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                                    <button
                                        onClick={() => setShowSettings((v) => !v)}
                                        className="hover:bg-primary-400 p-2 rounded transition-colors relative"
                                        title="Notification Settings"
                                    >
                                        <Settings color="white" width={20} size={18} />
                                        {permissionStatus !== "granted" && (
                                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full" />
                                        )}
                                    </button>

                                    {!isMobile && (
                                        <button
                                            onClick={() => setIsMinimized((v) => !v)}
                                            className="hover:bg-primary-400 p-2 rounded transition-colors"
                                        >
                                            <Minimize2 color="white" width={20} size={18} />
                                        </button>
                                    )}

                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="hover:bg-primary-500 p-2 rounded transition-colors"
                                    >
                                        <CloseCircle color="white" width={20} size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Settings Panel */}
                            <NotificationSettingsPanel
                                isOpen={showSettings}
                                onClose={() => setShowSettings(false)}
                                soundEnabled={soundEnabled}
                                desktopNotificationsEnabled={desktopNotificationsEnabled}
                                showMessagePreview={showMessagePreview}
                                notificationDuration={notificationDuration}
                                quietHoursEnabled={quietHoursEnabled}
                                quietHoursStart={quietHoursStart}
                                quietHoursEnd={quietHoursEnd}
                                permissionStatus={permissionStatus}
                                onUpdateSettings={updateSettings}
                                onRequestPermission={requestNotificationPermission}
                                onTestNotification={testNotification}
                            />

                            {/* Content */}
                            <AnimatePresence>
                                {!isMinimized && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="flex flex-1 bg-gray-50 rounded-b-lg overflow-hidden min-h-0"
                                    >
                                        {/* Admin Channel List */}
                                        {isAdmin && (
                                            <AnimatePresence>
                                                {showChannelList && (
                                                    <motion.div
                                                        initial={{ x: -300 }}
                                                        animate={{ x: 0 }}
                                                        exit={{ x: -300 }}
                                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                                        className="absolute inset-y-0 left-0 w-80 z-10 bg-white border-r border-gray-200 shadow-lg"
                                                    >
                                                        <div className="flex flex-col h-full">
                                                            <div className="p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center gap-2">
                                                                        <User color="black" size={18} className="text-gray-600" />
                                                                        <h2 className="font-semibold text-gray-900">Channels</h2>
                                                                        {totalUnreadCount > 0 && (
                                                                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                        {totalUnreadCount}
                                      </span>
                                                                        )}
                                                                    </div>
                                                                    <button
                                                                        onClick={() => setShowChannelList(false)}
                                                                        className="p-1 hover:bg-gray-200 rounded"
                                                                    >
                                                                        <Menu color="black" size={18} />
                                                                    </button>
                                                                </div>
                                                                <p className="text-xs text-gray-500 mt-1">
                                                                    {allChannels.length} active conversations
                                                                </p>
                                                            </div>

                                                            <div className="flex-1 overflow-y-auto p-2 min-h-0">
                                                                <div className="space-y-1">
                                                                    {allChannels.length > 0 ? (
                                                                        allChannels.map((ch) => {
                                                                            const channelKey = ch.cid ?? ch.id ?? "";
                                                                            const unreadCount = channelUnreadCounts[channelKey] || 0;
                                                                            const isActive = activeChannel?.cid
                                                                                ? activeChannel.cid === ch.cid
                                                                                : activeChannel?.id === ch.id;

                                                                            return (
                                                                                <motion.button
                                                                                    key={channelKey}
                                                                                    onClick={() => handleChannelSelect(ch)}
                                                                                    whileHover={{ scale: 1.02 }}
                                                                                    whileTap={{ scale: 0.98 }}
                                                                                    className={`w-full text-left p-3 rounded-lg text-sm transition-all duration-200 relative ${
                                                                                        isActive
                                                                                            ? "bg-blue-100 border-l-4 border-blue-500 text-blue-900"
                                                                                            : "hover:bg-gray-100 text-gray-700"
                                                                                    }`}
                                                                                >
                                                                                    <div className="flex items-center justify-between">
                                                                                        <div className="flex-1 min-w-0">
                                                                                            <div className="font-medium truncate">
                                                                                                {ch.data?.name || `Chat ${String(channelKey).slice(-4)}`}
                                                                                            </div>
                                                                                            <div className="text-xs text-gray-500 truncate">
                                                                                                {(ch.data as any)?.created_by?.name || "User"}
                                                                                            </div>
                                                                                        </div>

                                                                                        <div className="flex flex-col items-end gap-1">
                                                                                            {unreadCount > 0 && (
                                                                                                <motion.div
                                                                                                    initial={{ scale: 0 }}
                                                                                                    animate={{ scale: 1 }}
                                                                                                    className="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center font-medium"
                                                                                                >
                                                                                                    {unreadCount > 99 ? "99+" : unreadCount}
                                                                                                </motion.div>
                                                                                            )}
                                                                                            <div className="w-2 h-2 bg-green-400 rounded-full" />
                                                                                        </div>
                                                                                    </div>
                                                                                </motion.button>
                                                                            );
                                                                        })
                                                                    ) : (
                                                                        <div className="text-center py-8">
                                                                            <User size={48} className="text-gray-300 mx-auto mb-3" />
                                                                            <p className="text-gray-500 text-sm">No active conversations</p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        )}

                                        {/* Main Chat */}
                                        <div className="flex-1 flex flex-col min-w-0 relative">
                                            {activeChannel && (
                                                <Chat client={client}>
                                                    <Channel channel={activeChannel}>
                                                        <Window>
                                                            <div className="flex flex-col h-full">
                                                                <div className="flex-shrink-0 border-b border-gray-200 bg-white p-3">
                                                                    <div className="flex items-center justify-between">
                                                                        <div className="flex items-center gap-3">
                                                                            <div>
                                                                                <h4 className="font-medium text-gray-900">
                                                                                    {activeChannel?.data?.name || "Support Chat"}
                                                                                </h4>
                                                                                <p className="text-xs text-gray-500">
                                                                                    {isAdmin ? "Admin Support" : "Customer Support"}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex items-center gap-2">
                                                                            <div className="w-2 h-2 bg-green-400 rounded-full" />
                                                                            <span className="text-xs text-gray-500">Online</span>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="flex-1 overflow-hidden bg-gray-50 min-h-0">
                                                                    <MessageList />
                                                                </div>

                                                                <div className="flex-shrink-0 border-t border-gray-200 bg-white">
                                                                    <MessageInput maxRows={8} />
                                                                </div>
                                                            </div>
                                                        </Window>
                                                        <Thread />
                                                    </Channel>
                                                </Chat>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
};

export default FloatingChatWidget;
