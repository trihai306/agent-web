'use client'
import { useState } from 'react'
import Dialog from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Switcher from '@/components/ui/Switcher'

const SpecificVideoInteractionModal = ({ isOpen, onClose, action, onSave }) => {
    const [config, setConfig] = useState({
        // Cấu hình cơ bản
        videoLinks: '',
        
        // Giới hạn & Thời gian
        videoCount: { min: 1, max: 5 },
        watchDuration: { min: 3, max: 10 },
        
        // Hành động tùy chọn
        followChannel: {
            enabled: false,
            percentage: 100,
            waitTime: { min: 1, max: 3 }
        },
        addToFavorite: {
            enabled: false,
            percentage: 100,
            waitTime: { min: 1, max: 3 }
        },
        repost: {
            enabled: false,
            percentage: 100,
            waitTime: { min: 1, max: 3 }
        },
        like: {
            enabled: false,
            percentage: 100,
            waitTime: { min: 1, max: 3 }
        },
        comment: {
            enabled: false,
            percentage: 100,
            waitTime: { min: 1, max: 3 },
            contentGroup: '',
            contentTopic: ''
        }
    })

    const contentGroupOptions = [
        { value: '', label: '-- Chọn nhóm nội dung --' },
        { value: 'entertainment', label: 'Giải trí' },
        { value: 'education', label: 'Giáo dục' },
        { value: 'lifestyle', label: 'Lối sống' }
    ]

    const contentTopicOptions = [
        { value: '', label: '-- Chọn chủ đề --' },
        { value: 'music', label: 'Âm nhạc' },
        { value: 'dance', label: 'Nhảy múa' },
        { value: 'comedy', label: 'Hài hước' }
    ]

    const handleInputChange = (section, field, type, value) => {
        if (typeof section === 'string' && field && type) {
            setConfig(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: {
                        ...prev[section][field],
                        [type]: parseInt(value) || 0
                    }
                }
            }))
        } else {
            // Simple field
            setConfig(prev => ({
                ...prev,
                [section]: value
            }))
        }
    }

    const handlePercentageChange = (section, value) => {
        setConfig(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                percentage: parseInt(value) || 0
            }
        }))
    }

    const handleSwitchChange = (section, field, checked) => {
        setConfig(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: checked
            }
        }))
    }

    const handleSave = () => {
        if (onSave) {
            onSave(action, config)
        }
    }

    const handleClose = () => {
        onClose()
    }

    if (!action) return null

    return (
        <Dialog
            isOpen={isOpen}
            onClose={handleClose}
            onRequestClose={handleClose}
            width={800}
            className="z-[80]"
        >
            <div className="flex flex-col max-h-[85vh]">
                {/* Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-600 flex-shrink-0">
                    <h5 className="font-bold">Cài đặt: {action?.name}</h5>
                </div>
                
                {/* Content */}
                <div className="p-4 flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 min-h-0 max-h-[calc(85vh-120px)]">
                    {/* Cấu hình cơ bản */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-5 mb-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <h6 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                            Cấu hình cơ bản
                        </h6>
                        
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    Tên hành động
                                </label>
                                <Input
                                    value={action?.name || ''}
                                    disabled
                                    className="bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Đặt tên để dễ dáng nhận biết hành động này trong kịch bản.
                                </p>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    Danh sách link video
                                </label>
                                <textarea
                                    value={config.videoLinks}
                                    onChange={(e) => handleInputChange('videoLinks', null, null, e.target.value)}
                                    placeholder="https://www.tiktok.com/user/video/123&#10;https://www.tiktok.com/user/video/456&#10;https://www.tiktok.com/user/video/789"
                                    className="w-full h-24 p-3 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Mỗi dòng một link video TikTok để tương tác.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Giới hạn & Thời gian */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-5 mb-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <h6 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            Giới hạn & Thời gian
                        </h6>
                        
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    Số lượng video tương tác
                                </label>
                                <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                                    <Input
                                        type="number"
                                        min="1"
                                        value={config.videoCount.min}
                                        onChange={(e) => handleInputChange('videoCount', 'videoCount', 'min', e.target.value)}
                                        className="w-20 text-center border-gray-300 dark:border-gray-600"
                                    />
                                    <span className="text-gray-500 font-medium">-</span>
                                    <Input
                                        type="number"
                                        min="1"
                                        value={config.videoCount.max}
                                        onChange={(e) => handleInputChange('videoCount', 'videoCount', 'max', e.target.value)}
                                        className="w-20 text-center border-gray-300 dark:border-gray-600"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    Thời gian xem mỗi video (giây)
                                </label>
                                <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                                    <Input
                                        type="number"
                                        min="1"
                                        value={config.watchDuration.min}
                                        onChange={(e) => handleInputChange('watchDuration', 'watchDuration', 'min', e.target.value)}
                                        className="w-20 text-center border-gray-300 dark:border-gray-600"
                                    />
                                    <span className="text-gray-500 font-medium">-</span>
                                    <Input
                                        type="number"
                                        min="1"
                                        value={config.watchDuration.max}
                                        onChange={(e) => handleInputChange('watchDuration', 'watchDuration', 'max', e.target.value)}
                                        className="w-20 text-center border-gray-300 dark:border-gray-600"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hành động tùy chọn */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm border border-gray-200 dark:border-gray-700">
                        <h6 className="font-semibold text-gray-900 dark:text-gray-100 mb-5 flex items-center">
                            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                            Hành động tùy chọn
                        </h6>
                        
                        {/* Grid layout cho các hành động */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            {/* Theo dõi chủ video */}
                            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                        <h6 className="font-medium text-gray-900 dark:text-gray-100">
                                            Theo dõi chủ video
                                        </h6>
                                    </div>
                                    <Switcher
                                        checked={config.followChannel.enabled}
                                        onChange={(checked) => handleSwitchChange('followChannel', 'enabled', checked)}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                                    Tự động follow kênh đăng video.
                                </p>
                                
                                {config.followChannel.enabled && (
                                    <div className="border-t border-gray-100 dark:border-gray-700 pt-3 space-y-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                Tỷ lệ thực hiện (%)
                                            </label>
                                            <Input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={config.followChannel.percentage}
                                                onChange={(e) => handlePercentageChange('followChannel', e.target.value)}
                                                className="w-20 text-center text-sm"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                Chờ trước khi thực hiện (giây)
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={config.followChannel.waitTime.min}
                                                    onChange={(e) => handleInputChange('followChannel', 'waitTime', 'min', e.target.value)}
                                                    className="w-16 text-center text-sm"
                                                />
                                                <span className="text-xs text-gray-500">-</span>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={config.followChannel.waitTime.max}
                                                    onChange={(e) => handleInputChange('followChannel', 'waitTime', 'max', e.target.value)}
                                                    className="w-16 text-center text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Thêm vào Yêu thích */}
                            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:border-green-300 dark:hover:border-green-600 transition-colors">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                        <h6 className="font-medium text-gray-900 dark:text-gray-100">
                                            Thêm vào Yêu thích
                                        </h6>
                                    </div>
                                    <Switcher
                                        checked={config.addToFavorite.enabled}
                                        onChange={(checked) => handleSwitchChange('addToFavorite', 'enabled', checked)}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                                    Lưu video vào danh sách yêu thích.
                                </p>
                                
                                {config.addToFavorite.enabled && (
                                    <div className="border-t border-gray-100 dark:border-gray-700 pt-3 space-y-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                Tỷ lệ thực hiện (%)
                                            </label>
                                            <Input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={config.addToFavorite.percentage}
                                                onChange={(e) => handlePercentageChange('addToFavorite', e.target.value)}
                                                className="w-20 text-center text-sm"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                Chờ trước khi thực hiện (giây)
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={config.addToFavorite.waitTime.min}
                                                    onChange={(e) => handleInputChange('addToFavorite', 'waitTime', 'min', e.target.value)}
                                                    className="w-16 text-center text-sm"
                                                />
                                                <span className="text-xs text-gray-500">-</span>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={config.addToFavorite.waitTime.max}
                                                    onChange={(e) => handleInputChange('addToFavorite', 'waitTime', 'max', e.target.value)}
                                                    className="w-16 text-center text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Đăng lại (Repost) */}
                            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:border-orange-300 dark:hover:border-orange-600 transition-colors">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                                        <h6 className="font-medium text-gray-900 dark:text-gray-100">
                                            Đăng lại (Repost)
                                        </h6>
                                    </div>
                                    <Switcher
                                        checked={config.repost.enabled}
                                        onChange={(checked) => handleSwitchChange('repost', 'enabled', checked)}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                                    Chia sẻ lại video lên trang cá nhân của bạn.
                                </p>
                                
                                {config.repost.enabled && (
                                    <div className="border-t border-gray-100 dark:border-gray-700 pt-3 space-y-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                Tỷ lệ thực hiện (%)
                                            </label>
                                            <Input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={config.repost.percentage}
                                                onChange={(e) => handlePercentageChange('repost', e.target.value)}
                                                className="w-20 text-center text-sm"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                Chờ trước khi thực hiện (giây)
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={config.repost.waitTime.min}
                                                    onChange={(e) => handleInputChange('repost', 'waitTime', 'min', e.target.value)}
                                                    className="w-16 text-center text-sm"
                                                />
                                                <span className="text-xs text-gray-500">-</span>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={config.repost.waitTime.max}
                                                    onChange={(e) => handleInputChange('repost', 'waitTime', 'max', e.target.value)}
                                                    className="w-16 text-center text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Thả tim */}
                            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:border-red-300 dark:hover:border-red-600 transition-colors">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                                        <h6 className="font-medium text-gray-900 dark:text-gray-100">
                                            Thả tim
                                        </h6>
                                    </div>
                                    <Switcher
                                        checked={config.like.enabled}
                                        onChange={(checked) => handleSwitchChange('like', 'enabled', checked)}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                                    Bấy tỏ cảm xúc bằng cách thả tim video.
                                </p>
                                
                                {config.like.enabled && (
                                    <div className="border-t border-gray-100 dark:border-gray-700 pt-3 space-y-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                Tỷ lệ thực hiện (%)
                                            </label>
                                            <Input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={config.like.percentage}
                                                onChange={(e) => handlePercentageChange('like', e.target.value)}
                                                className="w-20 text-center text-sm"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                Chờ trước khi thực hiện (giây)
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={config.like.waitTime.min}
                                                    onChange={(e) => handleInputChange('like', 'waitTime', 'min', e.target.value)}
                                                    className="w-16 text-center text-sm"
                                                />
                                                <span className="text-xs text-gray-500">-</span>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={config.like.waitTime.max}
                                                    onChange={(e) => handleInputChange('like', 'waitTime', 'max', e.target.value)}
                                                    className="w-16 text-center text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Bình luận video - Full width */}
                        <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                                    <h6 className="font-medium text-gray-900 dark:text-gray-100">
                                        Bình luận video
                                    </h6>
                                </div>
                                <Switcher
                                    checked={config.comment.enabled}
                                    onChange={(checked) => handleSwitchChange('comment', 'enabled', checked)}
                                />
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                Tự động bình luận video với nội dung soạn sẵn.
                            </p>
                            
                            {config.comment.enabled && (
                                <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                                    <div className="grid grid-cols-3 gap-4 mb-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                Tỷ lệ (%)
                                            </label>
                                            <Input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={config.comment.percentage}
                                                onChange={(e) => handlePercentageChange('comment', e.target.value)}
                                                className="text-center text-sm"
                                            />
                                        </div>
                                        
                                        <div className="col-span-2">
                                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                Chờ trước khi thực hiện (giây)
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={config.comment.waitTime.min}
                                                    onChange={(e) => handleInputChange('comment', 'waitTime', 'min', e.target.value)}
                                                    className="w-full text-center text-sm"
                                                />
                                                <span className="text-xs text-gray-500">-</span>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={config.comment.waitTime.max}
                                                    onChange={(e) => handleInputChange('comment', 'waitTime', 'max', e.target.value)}
                                                    className="w-full text-center text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Nhóm nội dung
                                            </label>
                                            <select
                                                value={config.comment.contentGroup}
                                                onChange={(e) => handleSwitchChange('comment', 'contentGroup', e.target.value)}
                                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                            >
                                                {contentGroupOptions.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Chủ đề nội dung (0 bình luận)
                                            </label>
                                            <select
                                                value={config.comment.contentTopic}
                                                onChange={(e) => handleSwitchChange('comment', 'contentTopic', e.target.value)}
                                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                            >
                                                {contentTopicOptions.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-600 flex-shrink-0 bg-white dark:bg-gray-800">
                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="default"
                            onClick={handleClose}
                        >
                            Thoát
                        </Button>
                        <Button
                            type="button"
                            variant="solid"
                            color="blue-500"
                            onClick={handleSave}
                        >
                            Lưu thay đổi
                        </Button>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}

export default SpecificVideoInteractionModal
