'use client'
import { useState } from 'react'
import Dialog from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Switcher from '@/components/ui/Switcher'

const VideoInteractionModal = ({ isOpen, onClose, action, onSave }) => {
    const [config, setConfig] = useState({
        // Cấu hình cơ bản
        videoSource: 'for_you',
        
        // Giới hạn & Thời gian
        stopCondition: 'video_count', // 'video_count' hoặc 'time_limit'
        videoCount: { min: 1, max: 5 },
        timeLimit: { min: 3, max: 10 },
        watchDuration: { min: 3, max: 10 },
        
        // Hành động tùy chọn
        followChannel: {
            enabled: true,
            percentage: 100,
            waitTime: { min: 1, max: 3 }
        },
        addToFavorite: {
            enabled: true,
            percentage: 100,
            waitTime: { min: 1, max: 3 }
        },
        repost: {
            enabled: true,
            percentage: 100,
            waitTime: { min: 1, max: 3 }
        },
        like: {
            enabled: true,
            percentage: 100,
            waitTime: { min: 1, max: 3 }
        },
        comment: {
            enabled: true,
            percentage: 100,
            waitTime: { min: 1, max: 3 },
            contentGroup: '',
            contentTopic: ''
        }
    })

    const videoSourceOptions = [
        { value: 'for_you', label: 'Dành cho bạn (Đề xuất)' },
        { value: 'following', label: 'Đang theo dõi' },
        { value: 'trending', label: 'Xu hướng' }
    ]

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

    const handleSelectChange = (field, value) => {
        setConfig(prev => ({ ...prev, [field]: value }))
    }

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
                [section]: parseInt(value) || 0
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
                <div className="p-4 border-b border-gray-200 dark:border-gray-600">
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
                                    Đặt tên để dễ dáng nhận biết hành động này, không thể thay đổi.
                                </p>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    Nguồn video
                                </label>
                                <Select
                                    value={videoSourceOptions.find(opt => opt.value === config.videoSource)}
                                    onChange={(option) => handleSelectChange('videoSource', option?.value)}
                                    options={videoSourceOptions}
                                    placeholder="Chọn nguồn video"
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Chọn nơi hệ thống sẽ tìm video để tương tác.
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
                        
                        {/* Dừng tương tác khi đạt */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                Dừng tương tác khi đạt
                            </label>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="stopCondition"
                                            value="video_count"
                                            checked={config.stopCondition === 'video_count'}
                                            onChange={(e) => handleSelectChange('stopCondition', e.target.value)}
                                            className="w-4 h-4 text-blue-600"
                                        />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Số lượng video
                                        </span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="stopCondition"
                                            value="time_limit"
                                            checked={config.stopCondition === 'time_limit'}
                                            onChange={(e) => handleSelectChange('stopCondition', e.target.value)}
                                            className="w-4 h-4 text-blue-600"
                                        />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Thời gian (phút)
                                        </span>
                                    </label>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                                        <Input
                                            type="number"
                                            min="1"
                                            value={config.videoCount.min}
                                            onChange={(e) => handleInputChange('videoCount', 'videoCount', 'min', e.target.value)}
                                            className="w-20 text-center border-gray-300 dark:border-gray-600"
                                            disabled={config.stopCondition !== 'video_count'}
                                        />
                                        <span className="text-gray-500 font-medium">-</span>
                                        <Input
                                            type="number"
                                            min="1"
                                            value={config.videoCount.max}
                                            onChange={(e) => handleInputChange('videoCount', 'videoCount', 'max', e.target.value)}
                                            className="w-20 text-center border-gray-300 dark:border-gray-600"
                                            disabled={config.stopCondition !== 'video_count'}
                                        />
                                    </div>
                                    
                                    <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                                        <Input
                                            type="number"
                                            min="1"
                                            value={config.timeLimit.min}
                                            onChange={(e) => handleInputChange('timeLimit', 'timeLimit', 'min', e.target.value)}
                                            className="w-20 text-center border-gray-300 dark:border-gray-600"
                                            disabled={config.stopCondition !== 'time_limit'}
                                        />
                                        <span className="text-gray-500 font-medium">-</span>
                                        <Input
                                            type="number"
                                            min="1"
                                            value={config.timeLimit.max}
                                            onChange={(e) => handleInputChange('timeLimit', 'timeLimit', 'max', e.target.value)}
                                            className="w-20 text-center border-gray-300 dark:border-gray-600"
                                            disabled={config.stopCondition !== 'time_limit'}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Thời gian xem mỗi video */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                Thời gian xem mỗi video (giây)
                            </label>
                            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 rounded-lg p-3 w-fit">
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
                                    Bấy từ cảm xúc bằng cách thả tim video.
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
                                        
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                Chờ (giây)
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
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Nhóm nội dung
                                            </label>
                                            <Select
                                                value={contentGroupOptions.find(opt => opt.value === config.comment.contentGroup)}
                                                onChange={(option) => handleSwitchChange('comment', 'contentGroup', option?.value || '')}
                                                options={contentGroupOptions}
                                                placeholder="-- Chọn nhóm nội dung --"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Chủ đề nội dung (0 bình luận)
                                            </label>
                                            <Select
                                                value={contentTopicOptions.find(opt => opt.value === config.comment.contentTopic)}
                                                onChange={(option) => handleSwitchChange('comment', 'contentTopic', option?.value || '')}
                                                options={contentTopicOptions}
                                                placeholder="-- Chọn chủ đề --"
                                            />
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

export default VideoInteractionModal
