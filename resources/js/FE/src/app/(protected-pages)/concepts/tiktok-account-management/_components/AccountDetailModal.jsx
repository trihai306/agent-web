'use client'
import { useState, useEffect } from 'react'
import Dialog from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import getTiktokAccount from '@/server/actions/tiktok-account/getTiktokAccount'
import { 
    HiOutlineUser as User,
    HiOutlineCalendar as Calendar,
    HiOutlineLocationMarker as MapPin,
    HiOutlineLink as Link,
    HiOutlineHeart as Heart,
    HiOutlineUsers as Users,
    HiOutlineVideoCamera as Video,
    HiOutlineEye as Eye,
    HiOutlineTrendingUp as TrendingUp,
    HiOutlineLightningBolt as Activity,
    HiOutlineClock as Clock,
    HiOutlineCheckCircle as CheckCircle,
    HiOutlineExclamationCircle as AlertCircle,
    HiOutlineX as X,
    HiOutlinePencilAlt as Edit,
    HiOutlinePlay as Play,
    HiOutlinePause as Pause,
    HiOutlineCog as Settings,
    HiOutlineRefresh as Refresh,
    HiOutlineShieldCheck as Shield,
    HiOutlineKey as Key
} from 'react-icons/hi'

const AccountDetailModal = ({ isOpen, onClose, account }) => {
    const [activeTab, setActiveTab] = useState('overview')
    const [accountData, setAccountData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // Fetch account details when modal opens and account ID is provided
    useEffect(() => {
        if (isOpen && account?.id) {
            fetchAccountDetails()
        }
    }, [isOpen, account?.id])

    const fetchAccountDetails = async () => {
        if (!account?.id) return
        
        setLoading(true)
        setError(null)
        
        try {
            const result = await getTiktokAccount(account.id)
            
            if (result.success) {
                setAccountData(result.data)
            } else {
                setError(result.message || 'Không thể tải thông tin tài khoản')
            }
        } catch (err) {
            console.error('Error fetching account details:', err)
            setError('Không thể tải thông tin tài khoản')
        } finally {
            setLoading(false)
        }
    }

    // Use fetched data if available, fallback to passed account prop
    const displayAccount = accountData || account

    if (!account) return null

    const tabs = [
        { id: 'overview', label: 'Tổng quan', icon: User },
        { id: 'stats', label: 'Thống kê', icon: TrendingUp },
        { id: 'activity', label: 'Hoạt động', icon: Activity },
        { id: 'security', label: 'Bảo mật', icon: Shield },
        { id: 'settings', label: 'Cài đặt', icon: Settings }
    ]

    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
            case 'inactive':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
            case 'suspended':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            case 'running':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
            case 'error':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
        }
    }

    const getStatusText = (status) => {
        switch (status) {
            case 'active':
                return 'Hoạt động'
            case 'inactive':
                return 'Tạm dừng'
            case 'suspended':
                return 'Bị khóa'
            case 'running':
                return 'Đang chạy'
            case 'error':
                return 'Lỗi'
            default:
                return 'Không xác định'
        }
    }

    const renderOverview = () => {
        if (loading) {
            return (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600 dark:text-gray-400">Đang tải...</span>
                </div>
            )
        }

        if (error) {
            return (
                <div className="text-center py-12">
                    <div className="text-red-600 dark:text-red-400 mb-4">{error}</div>
                    <Button variant="outline" size="sm" onClick={fetchAccountDetails}>
                        Thử lại
                    </Button>
                </div>
            )
        }

        return (
            <div className="space-y-6">
                {/* Profile Info */}
                <div className="flex items-start gap-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {displayAccount.username?.charAt(0)?.toUpperCase() || 'T'}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                @{displayAccount.username}
                            </h3>
                            <Badge className={getStatusColor(displayAccount.status)}>
                                {getStatusText(displayAccount.status)}
                            </Badge>
                            {displayAccount.two_factor_enabled && (
                                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                    <Shield className="w-3 h-3 mr-1" />
                                    2FA
                                </Badge>
                            )}
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-3">
                            {displayAccount.display_name || displayAccount.nickname || 'Chưa có tên hiển thị'}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>Tham gia: {displayAccount.join_date || 'Chưa xác định'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span>Hoạt động: {displayAccount.last_activity || 'Chưa có hoạt động'}</span>
                            </div>
                            {displayAccount.email && (
                                <div className="flex items-center gap-1">
                                    <Link className="w-4 h-4" />
                                    <span>{displayAccount.email}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
                        <Users className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {displayAccount.follower_count?.toLocaleString() || '0'}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Followers</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
                        <Heart className="w-6 h-6 text-red-600 dark:text-red-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {displayAccount.heart_count?.toLocaleString() || '0'}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Likes</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
                        <Video className="w-6 h-6 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {displayAccount.video_count?.toLocaleString() || '0'}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Videos</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
                        <Eye className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {displayAccount.estimated_views?.toLocaleString() || '0'}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Views (ước tính)</div>
                    </div>
                </div>

                {/* Current Tasks */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                            Tác vụ hiện tại
                        </h4>
                        {displayAccount.task_statistics && (
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                {displayAccount.task_statistics.running_tasks_count} đang chạy, {displayAccount.task_statistics.pending_tasks_count} chờ xử lý
                            </div>
                        )}
                    </div>
                    <div className="space-y-2">
                        {/* Running Tasks */}
                        {displayAccount.running_tasks?.map((task) => {
                            // Calculate progress based on task status and timing
                            const getTaskProgress = (task) => {
                                if (task.status === 'completed') return 100
                                if (task.status === 'failed') return 0
                                if (task.status === 'running') {
                                    // Estimate progress based on how long it's been running
                                    if (task.started_at) {
                                        const startTime = new Date(task.started_at)
                                        const now = new Date()
                                        const elapsed = (now - startTime) / 1000 / 60 // minutes
                                        return Math.min(Math.floor(elapsed * 10), 90) // Max 90% for running tasks
                                    }
                                    return 50 // Default for running tasks
                                }
                                return 0
                            }
                            
                            const progress = getTaskProgress(task)
                            
                            return (
                                <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-900 dark:text-gray-100">
                                            {task.task_type?.replace(/_/g, ' ') || 'Tác vụ không xác định'}
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                            Ưu tiên: {task.priority || 'medium'} • Bắt đầu: {task.started_at ? new Date(task.started_at).toLocaleString('vi-VN') : 'Chưa xác định'}
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                            <div 
                                                className="h-2 rounded-full bg-blue-500"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    </div>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        {progress}%
                                    </span>
                                </div>
                            )
                        })}
                        
                        {/* Pending Tasks */}
                        {displayAccount.pending_tasks?.slice(0, 3).map((task) => (
                            <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <div className="w-2 h-2 rounded-full bg-gray-400" />
                                <div className="flex-1">
                                    <div className="font-medium text-gray-900 dark:text-gray-100">
                                        {task.task_type?.replace(/_/g, ' ') || 'Tác vụ không xác định'}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                        Ưu tiên: {task.priority || 'medium'} • Lên lịch: {task.scheduled_at ? new Date(task.scheduled_at).toLocaleString('vi-VN') : 'Ngay lập tức'}
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div className="h-2 rounded-full bg-gray-400" style={{ width: '0%' }} />
                                    </div>
                                </div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    Chờ xử lý
                                </span>
                            </div>
                        ))}
                        
                        {/* No tasks message */}
                        {(!displayAccount.running_tasks?.length && !displayAccount.pending_tasks?.length) && (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                Không có tác vụ nào đang thực hiện
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    const renderStats = () => (
        <div className="space-y-6">
            <div className="text-center text-gray-500 dark:text-gray-400">
                Thống kê chi tiết sẽ được hiển thị ở đây
            </div>
        </div>
    )

    const renderActivity = () => {
        // Get all tasks (completed, failed, running, pending) for activity history
        const allTasks = [
            ...(displayAccount.running_tasks || []),
            ...(displayAccount.pending_tasks || [])
        ]

        // Mock completed/failed tasks for demonstration (in real app, these would come from API)
        const completedTasks = [
            {
                id: 'completed_1',
                task_type: 'follow_user',
                status: 'completed',
                completed_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
                priority: 'high'
            },
            {
                id: 'completed_2', 
                task_type: 'like_video',
                status: 'completed',
                completed_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
                priority: 'medium'
            },
            {
                id: 'failed_1',
                task_type: 'comment_video',
                status: 'failed',
                completed_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
                priority: 'low'
            }
        ]

        const allActivities = [...allTasks, ...completedTasks].sort((a, b) => {
            const timeA = new Date(a.completed_at || a.started_at || a.scheduled_at || a.created_at)
            const timeB = new Date(b.completed_at || b.started_at || b.scheduled_at || b.created_at)
            return timeB - timeA
        })

        const getTaskStatusIcon = (status) => {
            switch (status) {
                case 'completed':
                    return <CheckCircle className="w-4 h-4 text-green-500" />
                case 'failed':
                    return <AlertCircle className="w-4 h-4 text-red-500" />
                case 'running':
                    return <Activity className="w-4 h-4 text-blue-500 animate-pulse" />
                case 'pending':
                    return <Clock className="w-4 h-4 text-gray-400" />
                default:
                    return <Clock className="w-4 h-4 text-gray-400" />
            }
        }

        const getTaskStatusText = (status) => {
            switch (status) {
                case 'completed':
                    return 'Hoàn thành'
                case 'failed':
                    return 'Thất bại'
                case 'running':
                    return 'Đang chạy'
                case 'pending':
                    return 'Chờ xử lý'
                default:
                    return 'Không xác định'
            }
        }

        const getTaskTypeText = (taskType) => {
            const taskTypes = {
                'follow_user': 'Theo dõi người dùng',
                'unfollow_user': 'Bỏ theo dõi người dùng',
                'like_video': 'Thích video',
                'unlike_video': 'Bỏ thích video',
                'comment_video': 'Bình luận video',
                'share_video': 'Chia sẻ video',
                'view_video': 'Xem video',
                'create_post': 'Tạo bài viết',
                'live_interaction': 'Tương tác livestream',
                'message_user': 'Nhắn tin người dùng'
            }
            return taskTypes[taskType] || taskType?.replace(/_/g, ' ') || 'Tác vụ không xác định'
        }

        const getPriorityColor = (priority) => {
            switch (priority) {
                case 'high':
                    return 'text-red-600 dark:text-red-400'
                case 'medium':
                    return 'text-yellow-600 dark:text-yellow-400'
                case 'low':
                    return 'text-green-600 dark:text-green-400'
                default:
                    return 'text-gray-600 dark:text-gray-400'
            }
        }

        const getPriorityText = (priority) => {
            switch (priority) {
                case 'high':
                    return 'Cao'
                case 'medium':
                    return 'Trung bình'
                case 'low':
                    return 'Thấp'
                default:
                    return 'Không xác định'
            }
        }

        const getRelativeTime = (dateString) => {
            const date = new Date(dateString)
            const now = new Date()
            const diffInMinutes = Math.floor((now - date) / (1000 * 60))
            
            if (diffInMinutes < 1) return 'Vừa xong'
            if (diffInMinutes < 60) return `${diffInMinutes} phút trước`
            
            const diffInHours = Math.floor(diffInMinutes / 60)
            if (diffInHours < 24) return `${diffInHours} giờ trước`
            
            const diffInDays = Math.floor(diffInHours / 24)
            if (diffInDays < 7) return `${diffInDays} ngày trước`
            
            return date.toLocaleDateString('vi-VN')
        }

        if (loading) {
            return (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600 dark:text-gray-400">Đang tải lịch sử...</span>
                </div>
            )
        }

        return (
            <div className="space-y-6">
                {/* Activity Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
                        <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                            {displayAccount.task_statistics?.completed_tasks_count || 0}
                        </div>
                        <div className="text-sm text-green-600 dark:text-green-400">Hoàn thành</div>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
                        <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                            {displayAccount.task_statistics?.running_tasks_count || 0}
                        </div>
                        <div className="text-sm text-blue-600 dark:text-blue-400">Đang chạy</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
                        <Clock className="w-6 h-6 text-gray-600 dark:text-gray-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {displayAccount.task_statistics?.pending_tasks_count || 0}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Chờ xử lý</div>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 text-center">
                        <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-red-900 dark:text-red-100">
                            {displayAccount.task_statistics?.failed_tasks_count || 0}
                        </div>
                        <div className="text-sm text-red-600 dark:text-red-400">Thất bại</div>
                    </div>
                </div>

                {/* Activity Timeline */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                            Lịch sử hoạt động gần đây
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Theo dõi tất cả các tác vụ tương tác của tài khoản
                        </p>
                    </div>
                    
                    <div className="p-6">
                        {allActivities.length > 0 ? (
                            <div className="space-y-4">
                                {allActivities.slice(0, 10).map((activity, index) => (
                                    <div key={activity.id || index} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <div className="flex-shrink-0 mt-1">
                                            {getTaskStatusIcon(activity.status)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                                    {getTaskTypeText(activity.task_type)}
                                                </h4>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    {getRelativeTime(activity.completed_at || activity.started_at || activity.scheduled_at || activity.created_at)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm">
                                                <span className={`font-medium ${
                                                    activity.status === 'completed' ? 'text-green-600 dark:text-green-400' :
                                                    activity.status === 'failed' ? 'text-red-600 dark:text-red-400' :
                                                    activity.status === 'running' ? 'text-blue-600 dark:text-blue-400' :
                                                    'text-gray-600 dark:text-gray-400'
                                                }`}>
                                                    {getTaskStatusText(activity.status)}
                                                </span>
                                                <span className="text-gray-500 dark:text-gray-400">•</span>
                                                <span className={`text-xs ${getPriorityColor(activity.priority)}`}>
                                                    Ưu tiên: {getPriorityText(activity.priority)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                
                                {allActivities.length > 10 && (
                                    <div className="text-center pt-4">
                                        <Button variant="outline" size="sm">
                                            Xem thêm {allActivities.length - 10} hoạt động
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                    Chưa có hoạt động nào
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400">
                                    Tài khoản này chưa thực hiện tác vụ tương tác nào.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    const renderSecurity = () => (
        <div className="space-y-6">
            {/* 2FA Status */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            displayAccount.two_factor_enabled 
                                ? 'bg-green-100 dark:bg-green-900/30' 
                                : 'bg-gray-100 dark:bg-gray-800'
                        }`}>
                            <Shield className={`w-5 h-5 ${
                                displayAccount.two_factor_enabled 
                                    ? 'text-green-600 dark:text-green-400' 
                                    : 'text-gray-400'
                            }`} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                                Xác thực hai yếu tố (2FA)
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Bảo vệ tài khoản với lớp bảo mật bổ sung
                            </p>
                        </div>
                    </div>
                    <Badge className={displayAccount.two_factor_enabled 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                    }>
                        {displayAccount.two_factor_enabled ? 'Đã bật' : 'Chưa bật'}
                    </Badge>
                </div>
                
                {displayAccount.two_factor_enabled && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                            <CheckCircle className="w-4 h-4" />
                            <span>2FA đã được kích hoạt cho tài khoản này</span>
                        </div>
                        
                        {displayAccount.two_factor_backup_codes && displayAccount.two_factor_backup_codes.length > 0 && (
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Key className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                        Mã dự phòng
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                    {displayAccount.two_factor_backup_codes.length} mã dự phòng có sẵn
                                </p>
                                <div className="grid grid-cols-2 gap-2">
                                    {displayAccount.two_factor_backup_codes.slice(0, 4).map((code, index) => (
                                        <div key={index} className="bg-white dark:bg-gray-800 rounded px-2 py-1 text-xs font-mono text-gray-600 dark:text-gray-400">
                                            {code.replace(/(.{4})/g, '$1-').slice(0, -1)}
                                        </div>
                                    ))}
                                </div>
                                {displayAccount.two_factor_backup_codes.length > 4 && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                        +{displayAccount.two_factor_backup_codes.length - 4} mã khác
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                )}
                
                {!displayAccount.two_factor_enabled && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                            <AlertCircle className="w-4 h-4" />
                            <span>Tài khoản chưa được bảo vệ bởi 2FA</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Khuyến nghị bật 2FA để tăng cường bảo mật cho tài khoản TikTok này.
                        </p>
                    </div>
                )}
            </div>

            {/* Security Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Thông tin bảo mật
                </h3>
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Số điện thoại</span>
                        <span className="text-sm text-gray-900 dark:text-gray-100">
                            {displayAccount.phone_number ? 
                                displayAccount.phone_number.replace(/(\d{3})(\d{3})(\d{4})/, '$1***$3') : 
                                'Chưa cập nhật'
                            }
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Email</span>
                        <span className="text-sm text-gray-900 dark:text-gray-100">
                            {displayAccount.email ? 
                                displayAccount.email.replace(/(.{2})(.*)(@.*)/, '$1***$3') : 
                                'Chưa cập nhật'
                            }
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Đăng nhập lần cuối</span>
                        <span className="text-sm text-gray-900 dark:text-gray-100">
                            {displayAccount.last_login_at ? 
                                new Date(displayAccount.last_login_at).toLocaleString('vi-VN') : 
                                'Chưa đăng nhập'
                            }
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )

    const renderSettings = () => (
        <div className="space-y-6">
            <div className="text-center text-gray-500 dark:text-gray-400">
                Cài đặt tài khoản sẽ được hiển thị ở đây
            </div>
        </div>
    )

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            onRequestClose={onClose}
            width={900}
            className="z-[60]"
            closable={false}
        >
            <div className="flex flex-col h-[80vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        Chi tiết tài khoản
                    </h2>
                    <div className="flex items-center gap-2">
                        <div className="relative group">
                            <Button 
                                variant="outline" 
                                size="sm"
                                onClick={fetchAccountDetails}
                                disabled={loading}
                                className="p-2"
                            >
                                <Refresh className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            </Button>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                Làm mới
                            </div>
                        </div>
                        <div className="relative group">
                            <Button 
                                variant="outline" 
                                size="sm"
                                className="p-2"
                            >
                                <Edit className="w-4 h-4" />
                            </Button>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                Chỉnh sửa
                            </div>
                        </div>
                        <div className="relative group">
                            <Button 
                                variant="outline" 
                                size="sm"
                                className="p-2"
                            >
                                <Play className="w-4 h-4" />
                            </Button>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                Bắt đầu
                            </div>
                        </div>
                        <div className="relative group">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={onClose}
                                className="p-2"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                Đóng
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 dark:border-gray-700">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                                activeTab === tab.id
                                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 p-6 overflow-y-auto">
                    {activeTab === 'overview' && renderOverview()}
                    {activeTab === 'stats' && renderStats()}
                    {activeTab === 'activity' && renderActivity()}
                    {activeTab === 'security' && renderSecurity()}
                    {activeTab === 'settings' && renderSettings()}
                </div>
            </div>
        </Dialog>
    )
}

export default AccountDetailModal
