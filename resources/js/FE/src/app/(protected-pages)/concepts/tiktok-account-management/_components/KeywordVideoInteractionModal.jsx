'use client'
import { useState } from 'react'
import Dialog from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Switcher from '@/components/ui/Switcher'

const KeywordVideoInteractionModal = ({ isOpen, onClose, action, onSave }) => {
    const [config, setConfig] = useState({
        // Cấu hình cơ bản
        keywords: '',
        
        // Giới hạn & Thời gian
        stopCondition: 'video_count', // 'video_count' hoặc 'time_limit'
        videoCount: { min: 1, max: 2 },
        timeLimit: { min: 1, max: 3 },
        watchDuration: { min: 3, max: 5 },
        
        // Hành động tùy chọn
        like: {
            enabled: false,
            percentage: 100,
            waitTime: { min: 1, max: 3 }
        },
        followUser: {
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
                    <h5 className="font-bold">Thêm {action?.name}</h5>
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
                                    Tên để nhận biết hành động này trong kịch bản.
                                </p>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    Danh sách từ khóa
                                </label>
                                <textarea
                                    value={config.keywords}
                                    onChange={(e) => handleInputChange('keywords', null, null, e.target.value)}
                                    placeholder="từ khóa 1&#10;từ khóa 2&#10;từ khóa 3..."
                                    className="w-full h-24 p-3 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Mỗi dòng một từ khóa để tìm kiếm video.
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
                                            Thời gian (giây)
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
                        
                        {/* Hàng đầu tiên */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            {/* Thả tim */}
                            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <h6 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                                            Thả tim
                                        </h6>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Bày tỏ cảm xúc bằng cách thả tim video.
                                        </p>
                                    </div>
                                    <Switcher
                                        checked={config.like.enabled}
                                        onChange={(checked) => handleSwitchChange('like', 'enabled', checked)}
                                    />
                                </div>
                                
                                {config.like.enabled && (
                                    <div className="border-t border-gray-200 dark:border-gray-600 pt-3 space-y-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                Tỷ lệ thực hiện (%)
                                            </label>
                                            <Input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={config.like.percentage || 100}
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
                                                    value={config.like.waitTime?.min || 1}
                                                    onChange={(e) => handleInputChange('like', 'waitTime', 'min', e.target.value)}
                                                    className="w-16 text-center text-sm"
                                                />
                                                <span className="text-xs text-gray-500">-</span>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={config.like.waitTime?.max || 3}
                                                    onChange={(e) => handleInputChange('like', 'waitTime', 'max', e.target.value)}
                                                    className="w-16 text-center text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Theo dõi user */}
                            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <h6 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                                            Theo dõi user
                                        </h6>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Tự động follow các user có video được xem.
                                        </p>
                                    </div>
                                    <Switcher
                                        checked={config.followUser.enabled}
                                        onChange={(checked) => handleSwitchChange('followUser', 'enabled', checked)}
                                    />
                                </div>
                                
                                {config.followUser.enabled && (
                                    <div className="border-t border-gray-200 dark:border-gray-600 pt-3 space-y-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                Tỷ lệ thực hiện (%)
                                            </label>
                                            <Input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={config.followUser.percentage || 100}
                                                onChange={(e) => handlePercentageChange('followUser', e.target.value)}
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
                                                    value={config.followUser.waitTime?.min || 1}
                                                    onChange={(e) => handleInputChange('followUser', 'waitTime', 'min', e.target.value)}
                                                    className="w-16 text-center text-sm"
                                                />
                                                <span className="text-xs text-gray-500">-</span>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={config.followUser.waitTime?.max || 3}
                                                    onChange={(e) => handleInputChange('followUser', 'waitTime', 'max', e.target.value)}
                                                    className="w-16 text-center text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Hàng thứ hai */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            {/* Thêm vào Yêu thích */}
                            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <h6 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                                            Thêm vào Yêu thích
                                        </h6>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Lưu video vào danh sách yêu thích.
                                        </p>
                                    </div>
                                    <Switcher
                                        checked={config.addToFavorite.enabled}
                                        onChange={(checked) => handleSwitchChange('addToFavorite', 'enabled', checked)}
                                    />
                                </div>
                                
                                {config.addToFavorite.enabled && (
                                    <div className="border-t border-gray-200 dark:border-gray-600 pt-3 space-y-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                Tỷ lệ thực hiện (%)
                                            </label>
                                            <Input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={config.addToFavorite.percentage || 100}
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
                                                    value={config.addToFavorite.waitTime?.min || 1}
                                                    onChange={(e) => handleInputChange('addToFavorite', 'waitTime', 'min', e.target.value)}
                                                    className="w-16 text-center text-sm"
                                                />
                                                <span className="text-xs text-gray-500">-</span>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={config.addToFavorite.waitTime?.max || 3}
                                                    onChange={(e) => handleInputChange('addToFavorite', 'waitTime', 'max', e.target.value)}
                                                    className="w-16 text-center text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Đăng lại (Repost) */}
                            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <h6 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                                            Đăng lại (Repost)
                                        </h6>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Chia sẻ lại video lên trang cá nhân của bạn.
                                        </p>
                                    </div>
                                    <Switcher
                                        checked={config.repost.enabled}
                                        onChange={(checked) => handleSwitchChange('repost', 'enabled', checked)}
                                    />
                                </div>
                                
                                {config.repost.enabled && (
                                    <div className="border-t border-gray-200 dark:border-gray-600 pt-3 space-y-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                Tỷ lệ thực hiện (%)
                                            </label>
                                            <Input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={config.repost.percentage || 100}
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
                                                    value={config.repost.waitTime?.min || 1}
                                                    onChange={(e) => handleInputChange('repost', 'waitTime', 'min', e.target.value)}
                                                    className="w-16 text-center text-sm"
                                                />
                                                <span className="text-xs text-gray-500">-</span>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={config.repost.waitTime?.max || 3}
                                                    onChange={(e) => handleInputChange('repost', 'waitTime', 'max', e.target.value)}
                                                    className="w-16 text-center text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Bình luận video - Full width */}
                        <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <h6 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                                        Bình luận video
                                    </h6>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Tự động bình luận video với nội dung soạn sẵn.
                                    </p>
                                </div>
                                <Switcher
                                    checked={config.comment.enabled}
                                    onChange={(checked) => handleSwitchChange('comment', 'enabled', checked)}
                                />
                            </div>
                            
                            {config.comment.enabled && (
                                <div className="border-t border-gray-200 dark:border-gray-600 pt-3 space-y-3">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                Tỷ lệ (%)
                                            </label>
                                            <Input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={config.comment.percentage || 100}
                                                onChange={(e) => handlePercentageChange('comment', e.target.value)}
                                                className="w-20 text-center text-sm"
                                            />
                                        </div>
                                        
                                        <div className="col-span-2">
                                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                Chờ (giây)
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={config.comment.waitTime?.min || 1}
                                                    onChange={(e) => handleInputChange('comment', 'waitTime', 'min', e.target.value)}
                                                    className="w-16 text-center text-sm"
                                                />
                                                <span className="text-xs text-gray-500">-</span>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={config.comment.waitTime?.max || 3}
                                                    onChange={(e) => handleInputChange('comment', 'waitTime', 'max', e.target.value)}
                                                    className="w-16 text-center text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                Nhóm nội dung
                                            </label>
                                            <select
                                                value={config.comment.contentGroup}
                                                onChange={(e) => handleSwitchChange('comment', 'contentGroup', e.target.value)}
                                                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                            >
                                                <option value="">-- Chọn nhóm nội dung --</option>
                                                <option value="entertainment">Giải trí</option>
                                                <option value="education">Giáo dục</option>
                                                <option value="lifestyle">Lối sống</option>
                                            </select>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                Chủ đề nội dung
                                            </label>
                                            <select
                                                value={config.comment.contentTopic}
                                                onChange={(e) => handleSwitchChange('comment', 'contentTopic', e.target.value)}
                                                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                            >
                                                <option value="">-- Chọn chủ đề --</option>
                                                <option value="music">Âm nhạc</option>
                                                <option value="dance">Nhảy múa</option>
                                                <option value="comedy">Hài hước</option>
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

export default KeywordVideoInteractionModal
