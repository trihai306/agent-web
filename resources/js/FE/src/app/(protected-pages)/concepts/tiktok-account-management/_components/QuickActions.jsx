'use client'
import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import getTiktokAccountRecentActivities from '@/server/actions/tiktok-account/getTiktokAccountRecentActivities'
import { 
    HiOutlinePlay as Play,
    HiOutlinePause as Pause,
    HiOutlineX as Square,
    HiOutlineUsers as Users,
    HiOutlineLightningBolt as Zap
} from 'react-icons/hi'

const QuickActions = ({ selectedAccounts = [], onAction, loading = false }) => {
    const [recentActivities, setRecentActivities] = useState([])
    const [activitiesLoading, setActivitiesLoading] = useState(false)

    const handleAction = async (actionType) => {
        await onAction?.(actionType)
        // Refresh activities after action
        fetchRecentActivities()
    }

    const fetchRecentActivities = async () => {
        setActivitiesLoading(true)
        try {
            // Mock data với design đẹp
            await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
            const mockActivities = [
                {
                    id: 1,
                    username: '@user123',
                    action: 'Bắt đầu kịch bản Follow',
                    status: 'running',
                    time: '2 phút trước',
                    scenario_name: 'Follow Campaign'
                },
                {
                    id: 2,
                    username: '@tiktoker456',
                    action: 'Hoàn thành tạo bài viết',
                    status: 'success',
                    time: '5 phút trước',
                    scenario_name: 'Content Creation'
                },
                {
                    id: 3,
                    username: '@creator789',
                    action: 'Lỗi khi đăng nhập',
                    status: 'error',
                    time: '8 phút trước',
                    scenario_name: 'Auto Login'
                },
                {
                    id: 4,
                    username: '@influencer101',
                    action: 'Tạm dừng kịch bản',
                    status: 'pending',
                    time: '12 phút trước',
                    scenario_name: 'Like Posts'
                }
            ]
            setRecentActivities(mockActivities)
        } catch (error) {
            console.error('Error fetching recent activities:', error)
            setRecentActivities([])
        } finally {
            setActivitiesLoading(false)
        }
    }

    useEffect(() => {
        fetchRecentActivities()
    }, [])

    const quickActions = [
        {
            id: 'start',
            label: 'Bắt đầu',
            icon: Play,
            color: 'bg-green-500 hover:bg-green-600',
            description: 'Khởi động kịch bản cho tài khoản đã chọn'
        },
        {
            id: 'pause',
            label: 'Tạm dừng',
            icon: Pause,
            color: 'bg-yellow-500 hover:bg-yellow-600',
            description: 'Tạm dừng các tác vụ đang chạy'
        },
        {
            id: 'stop',
            label: 'Dừng',
            icon: Square,
            color: 'bg-red-500 hover:bg-red-600',
            description: 'Dừng hoàn toàn tất cả tác vụ'
        }
    ]



    return (
        <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                            Thao tác nhanh
                        </h3>
                        {selectedAccounts.length > 0 && (
                            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                                {selectedAccounts.length} đã chọn
                            </span>
                        )}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
                        {quickActions.map((action) => (
                            <div key={action.id} className="relative group">
                                <Button
                                    onClick={() => handleAction(action.id)}
                                    disabled={loading || selectedAccounts.length === 0}
                                    className={`${action.color} text-white border-0 flex items-center justify-center w-16 h-16 rounded-xl transition-all duration-200 transform hover:scale-105 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <action.icon className="w-7 h-7" />
                                </Button>
                                
                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                                    {action.label}
                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {selectedAccounts.length === 0 && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 text-center">
                            Chọn tài khoản để sử dụng thao tác nhanh
                        </p>
                    )}
                </div>
            </Card>



            {/* Recent Activity */}
            <Card>
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                            <Users className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                                Hoạt động gần đây
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                Theo dõi các tác vụ mới nhất
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="p-6">
                    <div className="space-y-4">
                        {activitiesLoading ? (
                            // Loading skeleton
                            Array.from({ length: 4 }).map((_, index) => (
                                <div key={index} className="flex items-start gap-4 animate-pulse">
                                    <div className="flex flex-col items-center">
                                        <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600" />
                                        {index < 3 && <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 mt-2" />}
                                    </div>
                                    <div className="flex-1 pb-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
                                            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
                                        </div>
                                        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-40 mb-1"></div>
                                        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
                                    </div>
                                </div>
                            ))
                        ) : recentActivities.length > 0 ? (
                            recentActivities.map((activity, index) => (
                                <div key={activity.id} className="flex items-start gap-4 group hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg p-3 -m-3 transition-colors">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-3 h-3 rounded-full shadow-sm ${
                                            activity.status === 'success' ? 'bg-green-500 shadow-green-200' :
                                            activity.status === 'error' ? 'bg-red-500 shadow-red-200' :
                                            activity.status === 'running' ? 'bg-blue-500 shadow-blue-200 animate-pulse' :
                                            activity.status === 'pending' ? 'bg-yellow-500 shadow-yellow-200' :
                                            'bg-gray-400 shadow-gray-200'
                                        }`} />
                                        {index < recentActivities.length - 1 && (
                                            <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 mt-2" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                                                {activity.username}
                                            </span>
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                                activity.status === 'success' ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' :
                                                activity.status === 'error' ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' :
                                                activity.status === 'running' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' :
                                                activity.status === 'pending' ? 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400' :
                                                'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                                            }`}>
                                                {activity.status === 'success' ? 'Thành công' :
                                                 activity.status === 'error' ? 'Lỗi' :
                                                 activity.status === 'running' ? 'Đang chạy' :
                                                 activity.status === 'pending' ? 'Chờ xử lý' : 'Khác'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 leading-relaxed">
                                            {activity.action}
                                        </p>
                                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                                            <span>{activity.time}</span>
                                            {activity.scenario_name && (
                                                <>
                                                    <span>•</span>
                                                    <span className="text-gray-600 dark:text-gray-400 font-medium">
                                                        {activity.scenario_name}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                                    <Users className="w-8 h-8 text-gray-400" />
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                    Chưa có hoạt động nào
                                </div>
                                <div className="text-xs text-gray-400 dark:text-gray-500">
                                    Các tác vụ sẽ hiển thị ở đây khi bắt đầu
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default QuickActions
