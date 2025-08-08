'use client'
import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import getDeviceStats from '@/server/actions/device/getDeviceStats'
import {
    HiOutlineRefresh as Refresh,
    HiOutlineCog as Settings,
    HiOutlineDesktopComputer as Desktop,
    HiOutlineStatusOnline as Online,
    HiOutlineStatusOffline as Offline,
    HiOutlineShieldCheck as Shield
} from 'react-icons/hi'

const DashboardHeader = ({ 
    title = "Quản lý thiết bị",
    subtitle = "Theo dõi và quản lý tất cả thiết bị của bạn",
    onRefresh,
    onSettings,
    showActions = true
}) => {
    const [quickStats, setQuickStats] = useState({
        total: 0,
        online: 0,
        offline: 0,
        active: 0
    })
    const [isRefreshing, setIsRefreshing] = useState(false)

    const fetchQuickStats = async () => {
        try {
            const result = await getDeviceStats()
            if (result.success && result.data) {
                setQuickStats({
                    total: result.data.total || 0,
                    online: result.data.online || 0,
                    offline: result.data.offline || 0,
                    active: result.data.active || 0
                })
            }
        } catch (error) {
            console.error('Error fetching quick stats:', error)
        }
    }

    useEffect(() => {
        fetchQuickStats()
    }, [])

    const handleRefresh = async () => {
        setIsRefreshing(true)
        try {
            await fetchQuickStats()
            if (onRefresh) {
                await onRefresh()
            }
        } catch (error) {
            console.error('Error refreshing:', error)
        } finally {
            setIsRefreshing(false)
        }
    }

    return (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="py-6">
                    {/* Header Section */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                {title}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                {subtitle}
                            </p>
                        </div>
                        
                        {showActions && (
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="outline"
                                    onClick={handleRefresh}
                                    disabled={isRefreshing}
                                    className="text-gray-600 dark:text-gray-400"
                                >
                                    <Refresh className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                                    Làm mới
                                </Button>
                                
                                {onSettings && (
                                    <Button
                                        variant="outline"
                                        onClick={onSettings}
                                        className="text-gray-600 dark:text-gray-400"
                                    >
                                        <Settings className="w-4 h-4 mr-2" />
                                        Cài đặt
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                    <Desktop className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                        {quickStats.total}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Tổng thiết bị
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                    <Online className="w-5 h-5 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                        {quickStats.online}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Đang online
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                                    <Offline className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                        {quickStats.offline}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Offline
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                                    <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                        {quickStats.active}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Hoạt động
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardHeader
