'use client'
import { useState } from 'react'
import Dialog from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Switcher from '@/components/ui/Switcher'

const KeywordVideoInteractionModal = ({ isOpen, onClose, action, onSave }) => {
    // Initialize config based on JSON schema for Keyword Video Form
    const [config, setConfig] = useState({
        name: "Tương tác video theo từ khóa",
        keyword_list: "",
        limit_mode: "video",
        limit_video_from: 1,
        limit_video_to: 2,
        limit_time_from: 30,
        limit_time_to: 30,
        view_from: 3,
        view_to: 5,
        enable_follow: false,
        follow_rate: 100,
        follow_gap_from: 1,
        follow_gap_to: 3,
        enable_favorite: false,
        favorite_rate: 100,
        favorite_gap_from: 1,
        favorite_gap_to: 3,
        enable_repost: false,
        repost_rate: 100,
        repost_gap_from: 1,
        repost_gap_to: 3,
        enable_emotion: false,
        emotion_rate: 100,
        emotion_gap_from: 1,
        emotion_gap_to: 3,
        enable_comment: false,
        comment_rate: 100,
        comment_gap_from: 1,
        comment_gap_to: 3,
        comment_contents: []
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

    const handleInputChange = (field, value) => {
        setConfig(prev => ({
            ...prev,
            [field]: field.includes('_from') || field.includes('_to') || field.includes('_rate') 
                ? parseInt(value) || 0 
                : value
        }))
    }

    const handleSwitchChange = (field, checked) => {
        setConfig(prev => ({
            ...prev,
            [field]: checked
        }))
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
                                    value={config.keyword_list}
                                    onChange={(e) => handleInputChange('keyword_list', e.target.value)}
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
                                            name="limit_mode"
                                            value="video"
                                            checked={config.limit_mode === 'video'}
                                            onChange={(e) => handleInputChange('limit_mode', e.target.value)}
                                            className="w-4 h-4 text-blue-600"
                                        />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Số lượng video
                                        </span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="limit_mode"
                                            value="time"
                                            checked={config.limit_mode === 'time'}
                                            onChange={(e) => handleInputChange('limit_mode', e.target.value)}
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
                                            value={config.limit_video_from}
                                            onChange={(e) => handleInputChange('limit_video_from', e.target.value)}
                                            className="w-20 text-center border-gray-300 dark:border-gray-600"
                                            disabled={config.limit_mode !== 'video'}
                                        />
                                        <span className="text-gray-500 font-medium">-</span>
                                        <Input
                                            type="number"
                                            min="1"
                                            value={config.limit_video_to}
                                            onChange={(e) => handleInputChange('limit_video_to', e.target.value)}
                                            className="w-20 text-center border-gray-300 dark:border-gray-600"
                                            disabled={config.limit_mode !== 'video'}
                                        />
                                    </div>
                                    
                                    <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                                        <Input
                                            type="number"
                                            min="1"
                                            value={config.limit_time_from}
                                            onChange={(e) => handleInputChange('limit_time_from', e.target.value)}
                                            className="w-20 text-center border-gray-300 dark:border-gray-600"
                                            disabled={config.limit_mode !== 'time'}
                                        />
                                        <span className="text-gray-500 font-medium">-</span>
                                        <Input
                                            type="number"
                                            min="1"
                                            value={config.limit_time_to}
                                            onChange={(e) => handleInputChange('limit_time_to', e.target.value)}
                                            className="w-20 text-center border-gray-300 dark:border-gray-600"
                                            disabled={config.limit_mode !== 'time'}
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
                                    value={config.view_from}
                                    onChange={(e) => handleInputChange('view_from', e.target.value)}
                                    className="w-20 text-center border-gray-300 dark:border-gray-600"
                                />
                                <span className="text-gray-500 font-medium">-</span>
                                <Input
                                    type="number"
                                    min="1"
                                    value={config.view_to}
                                    onChange={(e) => handleInputChange('view_to', e.target.value)}
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
                                        checked={config.enable_emotion}
                                        onChange={(checked) => handleSwitchChange('enable_emotion', checked)}
                                    />
                                </div>
                                
                                {config.enable_emotion && (
                                    <div className="border-t border-gray-200 dark:border-gray-600 pt-3 space-y-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                Tỷ lệ thực hiện (%)
                                            </label>
                                            <Input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={config.emotion_rate}
                                                onChange={(e) => handleInputChange('emotion_rate', e.target.value)}
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
                                                    value={config.emotion_gap_from}
                                                    onChange={(e) => handleInputChange('emotion_gap_from', e.target.value)}
                                                    className="w-16 text-center text-sm"
                                                />
                                                <span className="text-xs text-gray-500">-</span>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={config.emotion_gap_to}
                                                    onChange={(e) => handleInputChange('emotion_gap_to', e.target.value)}
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
                                        checked={config.enable_follow}
                                        onChange={(checked) => handleSwitchChange('enable_follow', checked)}
                                    />
                                </div>
                                
                                {config.enable_follow && (
                                    <div className="border-t border-gray-200 dark:border-gray-600 pt-3 space-y-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                Tỷ lệ thực hiện (%)
                                            </label>
                                            <Input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={config.follow_rate}
                                                onChange={(e) => handleInputChange('follow_rate', e.target.value)}
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
                                                    value={config.follow_gap_from}
                                                    onChange={(e) => handleInputChange('follow_gap_from', e.target.value)}
                                                    className="w-16 text-center text-sm"
                                                />
                                                <span className="text-xs text-gray-500">-</span>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={config.follow_gap_to}
                                                    onChange={(e) => handleInputChange('follow_gap_to', e.target.value)}
                                                    className="w-16 text-center text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Hàng thứ hai */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                                        checked={config.enable_favorite}
                                        onChange={(checked) => handleSwitchChange('enable_favorite', checked)}
                                    />
                                </div>
                                
                                {config.enable_favorite && (
                                    <div className="border-t border-gray-200 dark:border-gray-600 pt-3 space-y-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                Tỷ lệ thực hiện (%)
                                            </label>
                                            <Input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={config.favorite_rate}
                                                onChange={(e) => handleInputChange('favorite_rate', e.target.value)}
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
                                                    value={config.favorite_gap_from}
                                                    onChange={(e) => handleInputChange('favorite_gap_from', e.target.value)}
                                                    className="w-16 text-center text-sm"
                                                />
                                                <span className="text-xs text-gray-500">-</span>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={config.favorite_gap_to}
                                                    onChange={(e) => handleInputChange('favorite_gap_to', e.target.value)}
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
                                        checked={config.enable_repost}
                                        onChange={(checked) => handleSwitchChange('enable_repost', checked)}
                                    />
                                </div>
                                
                                {config.enable_repost && (
                                    <div className="border-t border-gray-200 dark:border-gray-600 pt-3 space-y-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                Tỷ lệ thực hiện (%)
                                            </label>
                                            <Input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={config.repost_rate}
                                                onChange={(e) => handleInputChange('repost_rate', e.target.value)}
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
                                                    value={config.repost_gap_from}
                                                    onChange={(e) => handleInputChange('repost_gap_from', e.target.value)}
                                                    className="w-16 text-center text-sm"
                                                />
                                                <span className="text-xs text-gray-500">-</span>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={config.repost_gap_to}
                                                    onChange={(e) => handleInputChange('repost_gap_to', e.target.value)}
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
                                    checked={config.enable_comment}
                                    onChange={(checked) => handleSwitchChange('enable_comment', checked)}
                                />
                            </div>
                            
                            {config.enable_comment && (
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
                                                value={config.comment_rate}
                                                onChange={(e) => handleInputChange('comment_rate', e.target.value)}
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
                                                    value={config.comment_gap_from}
                                                    onChange={(e) => handleInputChange('comment_gap_from', e.target.value)}
                                                    className="w-16 text-center text-sm"
                                                />
                                                <span className="text-xs text-gray-500">-</span>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={config.comment_gap_to}
                                                    onChange={(e) => handleInputChange('comment_gap_to', e.target.value)}
                                                    className="w-16 text-center text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                            Nội dung bình luận
                                        </label>
                                        <textarea
                                            value={config.comment_contents.join('\n')}
                                            onChange={(e) => handleCommentContentChange(e.target.value.split('\n').filter(line => line.trim()))}
                                            placeholder="Bình luận 1&#10;Bình luận 2&#10;Bình luận 3..."
                                            className="w-full h-20 p-3 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
                                        />
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            Mỗi dòng một nội dung bình luận. Hệ thống sẽ chọn ngẫu nhiên.
                                        </p>
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
