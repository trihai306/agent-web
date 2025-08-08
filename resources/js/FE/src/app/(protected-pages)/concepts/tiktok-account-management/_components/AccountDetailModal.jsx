'use client'
import { useState } from 'react'
import Dialog from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
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
    HiOutlineCog as Settings
} from 'react-icons/hi'

const AccountDetailModal = ({ isOpen, onClose, account }) => {
    const [activeTab, setActiveTab] = useState('overview')

    if (!account) return null

    const tabs = [
        { id: 'overview', label: 'Tổng quan', icon: User },
        { id: 'stats', label: 'Thống kê', icon: TrendingUp },
        { id: 'activity', label: 'Hoạt động', icon: Activity },
        { id: 'settings', label: 'Cài đặt', icon: Settings }
    ]

    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
            case 'inactive':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
            case 'running':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
            case 'error':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
        }
    }

    const renderOverview = () => (
        <div className="space-y-6">
            {/* Profile Info */}
            <div className="flex items-start gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {account.username?.charAt(0)?.toUpperCase() || 'T'}
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                            @{account.username}
                        </h3>
                        <Badge className={getStatusColor(account.status)}>
                            {account.status === 'active' ? 'Hoạt động' : 
                             account.status === 'running' ? 'Đang chạy' :
                             account.status === 'error' ? 'Lỗi' : 'Tạm dừng'}
                        </Badge>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {account.displayName || 'Chưa có tên hiển thị'}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>Tham gia: {account.joinDate || '01/01/2024'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{account.location || 'Việt Nam'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Link className="w-4 h-4" />
                            <span>{account.website || 'Chưa có website'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
                    <Users className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {account.followers || '12.5K'}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Followers</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
                    <Heart className="w-6 h-6 text-red-600 dark:text-red-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {account.likes || '45.2K'}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Likes</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
                    <Video className="w-6 h-6 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {account.videos || '127'}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Videos</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
                    <Eye className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {account.views || '1.2M'}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Views</div>
                </div>
            </div>

            {/* Current Tasks */}
            <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    Tác vụ hiện tại
                </h4>
                <div className="space-y-2">
                    {[
                        { name: 'Theo dõi người dùng', status: 'running', progress: 75 },
                        { name: 'Tạo bài viết', status: 'completed', progress: 100 },
                        { name: 'Đọc thông báo', status: 'pending', progress: 0 }
                    ].map((task, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className={`w-2 h-2 rounded-full ${
                                task.status === 'running' ? 'bg-blue-500 animate-pulse' :
                                task.status === 'completed' ? 'bg-green-500' :
                                'bg-gray-400'
                            }`} />
                            <div className="flex-1">
                                <div className="font-medium text-gray-900 dark:text-gray-100">
                                    {task.name}
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                                    <div 
                                        className={`h-2 rounded-full ${
                                            task.status === 'running' ? 'bg-blue-500' :
                                            task.status === 'completed' ? 'bg-green-500' :
                                            'bg-gray-400'
                                        }`}
                                        style={{ width: `${task.progress}%` }}
                                    />
                                </div>
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {task.progress}%
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )

    const renderStats = () => (
        <div className="space-y-6">
            <div className="text-center text-gray-500 dark:text-gray-400">
                Thống kê chi tiết sẽ được hiển thị ở đây
            </div>
        </div>
    )

    const renderActivity = () => (
        <div className="space-y-6">
            <div className="text-center text-gray-500 dark:text-gray-400">
                Lịch sử hoạt động sẽ được hiển thị ở đây
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
        >
            <div className="flex flex-col h-[80vh]">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        Chi tiết tài khoản
                    </h2>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-2" />
                            Chỉnh sửa
                        </Button>
                        <Button variant="outline" size="sm">
                            <Play className="w-4 h-4 mr-2" />
                            Bắt đầu
                        </Button>
                        <Button variant="outline" size="sm" onClick={onClose}>
                            <X className="w-4 h-4" />
                        </Button>
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
                    {activeTab === 'settings' && renderSettings()}
                </div>
            </div>
        </Dialog>
    )
}

export default AccountDetailModal
