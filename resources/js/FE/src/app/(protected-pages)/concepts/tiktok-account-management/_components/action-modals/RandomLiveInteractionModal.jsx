'use client'
import { useState } from 'react'
import Dialog from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Switcher from '@/components/ui/Switcher'
import Select from '@/components/ui/Select'

const RandomLiveInteractionModal = ({ isOpen, onClose, action, onSave }) => {
    // Initialize config based on JSON schema for Random Live Form
    const [config, setConfig] = useState({
        name: "Tương tác live ngẫu nhiên",
        limit_mode: "video",
        limit_video_from: 1,
        limit_video_to: 2,
        limit_time_from: 30,
        limit_time_to: 60,
        view_from: 3,
        view_to: 5,
        actions: {
            follow: {
                enable: false,
                rate: 100,
                gap_from: 1,
                gap_to: 3
            },
            emotion: {
                enable: false,
                rate: 100,
                gap_from: 1,
                gap_to: 3
            }
        },
        enable_comment: false,
        comment_rate: 100,
        comment_gap_from: 1,
        comment_gap_to: 3,
        comment_contents: []
    })

    // Dropdown options
    const contentGroupOptions = [
        { value: '', label: 'Chọn nhóm nội dung' },
        { value: 'entertainment', label: 'Giải trí' },
        { value: 'education', label: 'Giáo dục' },
        { value: 'lifestyle', label: 'Lối sống' },
        { value: 'business', label: 'Kinh doanh' },
        { value: 'technology', label: 'Công nghệ' }
    ]

    const contentTopicOptions = [
        { value: '', label: 'Chọn chủ đề' },
        { value: 'music', label: 'Âm nhạc' },
        { value: 'dance', label: 'Nhảy múa' },
        { value: 'comedy', label: 'Hài hước' },
        { value: 'food', label: 'Ẩm thực' },
        { value: 'travel', label: 'Du lịch' },
        { value: 'fashion', label: 'Thời trang' },
        { value: 'beauty', label: 'Làm đẹp' },
        { value: 'sports', label: 'Thể thao' },
        { value: 'pets', label: 'Thú cưng' }
    ]

    const handleSelectChange = (field, value) => {
        setConfig(prev => ({ ...prev, [field]: value }))
    }

    const handleInputChange = (field, value) => {
        if (field.startsWith('actions.')) {
            const [, actionType, actionField] = field.split('.')
            setConfig(prev => ({
                ...prev,
                actions: {
                    ...prev.actions,
                    [actionType]: {
                        ...prev.actions[actionType],
                        [actionField]: actionField.includes('_from') || actionField.includes('_to') || actionField === 'rate'
                            ? parseInt(value) || 0
                            : value
                    }
                }
            }))
        } else {
            setConfig(prev => ({
                ...prev,
                [field]: field.includes('_from') || field.includes('_to') || field.includes('_rate') 
                    ? parseInt(value) || 0 
                    : value
            }))
        }
    }

    const handleSwitchChange = (field, checked) => {
        if (field.startsWith('actions.')) {
            const [, actionType, actionField] = field.split('.')
            setConfig(prev => ({
                ...prev,
                actions: {
                    ...prev.actions,
                    [actionType]: {
                        ...prev.actions[actionType],
                        [actionField]: checked
                    }
                }
            }))
        } else {
            setConfig(prev => ({
                ...prev,
                [field]: checked
            }))
        }
    }

    const handleCommentContentChange = (contents) => {
        setConfig(prev => ({
            ...prev,
            comment_contents: contents
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
                                Sẽ tìm phòng live ngẫu nhiên sau đó tương tác trong đó.
                            </p>
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
                                            value="live_count"
                                            checked={config.stopCondition === 'live_count'}
                                            onChange={(e) => handleSelectChange('stopCondition', e.target.value)}
                                            className="w-4 h-4 text-blue-600"
                                        />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Số lượng live
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
                                
                                <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 rounded-lg p-3 w-fit">
                                    <Input
                                        type="number"
                                        min="1"
                                        value={config.stopCondition === 'live_count' ? config.liveCount.min : config.timeLimit.min}
                                        onChange={(e) => {
                                            if (config.stopCondition === 'live_count') {
                                                handleInputChange('liveCount', 'liveCount', 'min', e.target.value)
                                            } else {
                                                handleInputChange('timeLimit', 'timeLimit', 'min', e.target.value)
                                            }
                                        }}
                                        className="w-20 text-center border-gray-300 dark:border-gray-600"
                                    />
                                    <span className="text-gray-500 font-medium">-</span>
                                    <Input
                                        type="number"
                                        min="1"
                                        value={config.stopCondition === 'live_count' ? config.liveCount.max : config.timeLimit.max}
                                        onChange={(e) => {
                                            if (config.stopCondition === 'live_count') {
                                                handleInputChange('liveCount', 'liveCount', 'max', e.target.value)
                                            } else {
                                                handleInputChange('timeLimit', 'timeLimit', 'max', e.target.value)
                                            }
                                        }}
                                        className="w-20 text-center border-gray-300 dark:border-gray-600"
                                    />
                                </div>
                            </div>
                        </div>
                        
                        {/* Thời gian xem mỗi live */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                Thời gian xem mỗi live (giây)
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            {/* Theo dõi */}
                            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                            <h6 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                                                Theo dõi
                                            </h6>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Tự động follow người phát sóng live.
                                        </p>
                                    </div>
                                    <Switcher
                                        checked={config.follow.enabled}
                                        onChange={(checked) => handleSwitchChange('follow', 'enabled', checked)}
                                    />
                                </div>
                                
                                {config.follow.enabled && (
                                    <div className="border-t border-gray-200 dark:border-gray-600 pt-3 space-y-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                Tỷ lệ thực hiện (%)
                                            </label>
                                            <Input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={config.follow.percentage}
                                                onChange={(e) => handlePercentageChange('follow', e.target.value)}
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
                                                    value={config.follow.waitTime.min}
                                                    onChange={(e) => handleInputChange('follow', 'waitTime', 'min', e.target.value)}
                                                    className="w-16 text-center text-sm"
                                                />
                                                <span className="text-xs text-gray-500">-</span>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={config.follow.waitTime.max}
                                                    onChange={(e) => handleInputChange('follow', 'waitTime', 'max', e.target.value)}
                                                    className="w-16 text-center text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Thả cảm xúc */}
                            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                                            <h6 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                                                Thả cảm xúc
                                            </h6>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Bày tỏ cảm xúc trong live stream.
                                        </p>
                                    </div>
                                    <Switcher
                                        checked={config.emotion.enabled}
                                        onChange={(checked) => handleSwitchChange('emotion', 'enabled', checked)}
                                    />
                                </div>
                                
                                {config.emotion.enabled && (
                                    <div className="border-t border-gray-200 dark:border-gray-600 pt-3 space-y-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                Tỷ lệ thực hiện (%)
                                            </label>
                                            <Input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={config.emotion.percentage}
                                                onChange={(e) => handlePercentageChange('emotion', e.target.value)}
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
                                                    value={config.emotion.waitTime.min}
                                                    onChange={(e) => handleInputChange('emotion', 'waitTime', 'min', e.target.value)}
                                                    className="w-16 text-center text-sm"
                                                />
                                                <span className="text-xs text-gray-500">-</span>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={config.emotion.waitTime.max}
                                                    onChange={(e) => handleInputChange('emotion', 'waitTime', 'max', e.target.value)}
                                                    className="w-16 text-center text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Hàng thứ hai - Bình luận live (full width) */}
                        <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                                        <h6 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                                            Bình luận live
                                        </h6>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Tự động bình luận live với nội dung soạn sẵn.
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
                                                value={config.comment.percentage}
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
                                                    value={config.comment.waitTime.min}
                                                    onChange={(e) => handleInputChange('comment', 'waitTime', 'min', e.target.value)}
                                                    className="w-16 text-center text-sm"
                                                />
                                                <span className="text-xs text-gray-500">-</span>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={config.comment.waitTime.max}
                                                    onChange={(e) => handleInputChange('comment', 'waitTime', 'max', e.target.value)}
                                                    className="w-16 text-center text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                Ngôn ngữ đánh
                                            </label>
                                            <select
                                                value={config.comment.contentGroup}
                                                onChange={(e) => handleDropdownChange('comment', 'contentGroup', e.target.value)}
                                                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                            >
                                                {contentGroupOptions.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                Chủ đề nội dung (9 hình tròn)
                                            </label>
                                            <select
                                                value={config.comment.contentTopic}
                                                onChange={(e) => handleDropdownChange('comment', 'contentTopic', e.target.value)}
                                                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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

export default RandomLiveInteractionModal
