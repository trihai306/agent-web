'use client'
import { useState } from 'react'
import Dialog from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import { TbUsers, TbDeviceDesktop, TbSettings, TbBell, TbVideo, TbEye, TbSearch, TbUser, TbUserPlus, TbBulb, TbMessage, TbThumbUp, TbShare, TbEdit, TbPhoto, TbFileText, TbWallet, TbClock, TbPhone } from 'react-icons/tb'

const ActionListModal = ({ isOpen, onClose, onSelectAction, selectedScenario }) => {
    const [selectedCategory, setSelectedCategory] = useState('interaction')

    const actionCategories = [
        {
            id: 'interaction',
            title: 'Tương tác',
            icon: <TbUsers />,
            color: 'bg-purple-500',
            bgColor: 'bg-purple-50',
            actions: [
                { id: 'read_notification', name: 'Đọc thông báo', icon: <TbBell />, available: true },
                { id: 'random_video_interaction', name: 'Tương tác video ngẫu nhiên', icon: <TbVideo />, available: true },
                { id: 'specific_video_interaction', name: 'Tương tác video chỉ định', icon: <TbEye />, available: true },
                { id: 'keyword_video_interaction', name: 'Tương tác video theo từ khóa', icon: <TbSearch />, available: true },
                { id: 'user_video_interaction', name: 'Tương tác video theo User', icon: <TbUser />, available: true },
                { id: 'random_live_interaction', name: 'Tương tác live ngẫu nhiên', icon: <TbEye />, available: true },
                { id: 'specific_live_interaction', name: 'Tương tác live chỉ định', icon: <TbVideo />, available: true }
            ]
        },
        {
            id: 'follow_message',
            title: 'Theo dõi và nhắn tin',
            icon: <TbDeviceDesktop />,
            color: 'bg-blue-500',
            bgColor: 'bg-blue-50',
            actions: [
                { id: 'follow_user', name: 'Theo dõi User', icon: <TbUserPlus />, available: true },
                { id: 'follow_back', name: 'Theo dõi lại', icon: <TbUser />, available: true },
                { id: 'follow_user_suggestion', name: 'Theo dõi User gợi ý', icon: <TbBulb />, comingSoon: true },
                { id: 'follow_user_by_id', name: 'Theo dõi User qua Id chỉ định', icon: <TbUser />, comingSoon: true },
                { id: 'receive_message', name: 'Nhắn tin được chỉ định', icon: <TbMessage />, comingSoon: true },
                { id: 'reply_comment', name: 'Trả lời Comment chỉ định', icon: <TbMessage />, comingSoon: true },
                { id: 'increase_view', name: 'Tăng Lượt Xem Sản Phẩm', icon: <TbEye />, comingSoon: true }
            ]
        },
        {
            id: 'account_features',
            title: 'Chức năng tài khoản',
            icon: <TbSettings />,
            color: 'bg-orange-500',
            bgColor: 'bg-orange-50',
            actions: [
                { id: 'check_balance', name: 'Kiểm tiền', icon: <TbWallet />, comingSoon: true },
                { id: 'create_post', name: 'Tạo bài viết', icon: <TbEdit />, available: true },
                { id: 'update_avatar', name: 'Cập nhật Ảnh đại diện', icon: <TbPhoto />, available: true },
                { id: 'change_name', name: 'Đổi tên', icon: <TbEdit />, available: true },
                { id: 'change_bio', name: 'Đổi tiểu sử', icon: <TbFileText />, available: true },
                { id: 'interact_friends', name: 'Tương tác bạn bè', icon: <TbUsers />, available: true },
                { id: 'auto_tools', name: 'Công khai lượt thích', icon: <TbThumbUp />, comingSoon: true },
                { id: 'rest', name: 'Nghỉ', icon: <TbClock />, comingSoon: true },
                { id: 'check_health', name: 'Kiểm tra sức khỏe', icon: <TbPhone />, comingSoon: true }
            ]
        }
    ]

    const selectedCategoryData = actionCategories.find(cat => cat.id === selectedCategory)

    const handleActionSelect = (action) => {
        if (!action.available && action.comingSoon) {
            return // Không cho phép chọn action "Coming Soon"
        }
        
        if (onSelectAction) {
            onSelectAction(action, selectedScenario)
        }
        onClose()
    }

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            onRequestClose={onClose}
            width={900}
            className="z-[70]"
        >
            <div className="flex flex-col h-full">
                {/* Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-600">
                    <h5 className="font-bold">Danh sách hành động</h5>
                </div>
                
                {/* Content */}
                <div className="p-4 flex-1 overflow-y-auto">
                    <div className="grid grid-cols-3 gap-6 h-full">
                        {actionCategories.map((category) => (
                            <div key={category.id} className={`${category.bgColor} dark:bg-gray-800/50 rounded-lg p-4`}>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`${category.color} text-white p-2 rounded-lg`}>
                                        {category.icon}
                                    </div>
                                    <h6 className="font-semibold">{category.title}</h6>
                                </div>
                                
                                <div className="space-y-2">
                                    {category.actions.map((action) => (
                                        <div
                                            key={action.id}
                                            className={`p-3 rounded-lg border transition-all duration-200 ${
                                                action.comingSoon 
                                                    ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-50 cursor-not-allowed' 
                                                    : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 cursor-pointer hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] active:shadow-sm'
                                            }`}
                                            onClick={() => handleActionSelect(action)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className={`text-lg ${
                                                    action.comingSoon 
                                                        ? 'text-gray-400 dark:text-gray-600' 
                                                        : 'text-blue-600 dark:text-blue-400'
                                                }`}>
                                                    {action.icon}
                                                </span>
                                                <div className="flex-1">
                                                    <span className={`text-sm block ${
                                                        action.comingSoon 
                                                            ? 'font-normal text-gray-400 dark:text-gray-500' 
                                                            : 'font-semibold text-gray-900 dark:text-gray-100'
                                                    }`}>
                                                        {action.name}
                                                    </span>
                                                    {action.comingSoon && (
                                                        <span className="text-xs text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400 px-2 py-0.5 rounded-full mt-1.5 inline-block font-medium">
                                                            Coming Soon
                                                        </span>
                                                    )}
                                                </div>
                                                {!action.comingSoon && (
                                                    <div className="w-2 h-2 bg-green-500 rounded-full opacity-80"></div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex justify-end">
                        <Button
                            type="button"
                            variant="default"
                            onClick={onClose}
                        >
                            Đóng
                        </Button>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}

export default ActionListModal
