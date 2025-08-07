'use client'
import { useState } from 'react'
import Dialog from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Switcher from '@/components/ui/Switcher'
import Checkbox from '@/components/ui/Checkbox'

const SpecificLiveInteractionModal = ({ isOpen, onClose, action, onSave }) => {
    const [config, setConfig] = useState({
        // Cấu hình cơ bản
        liveUrl: '',
        
        // Thời gian xem
        watchDuration: { min: 3, max: 5 },
        
        // Hành động tùy chọn
        continuousInteraction: {
            enabled: true,
            emotionCycle: true,
            cycleDuration: { min: 5, max: 10 },
            percentage: 100,
            waitTime: { min: 1, max: 3 }
        },
        emotion: {
            enabled: true,
            showEmotion: false
        },
        follow: {
            enabled: false,
            autoFollow: false
        },
        addToCart: {
            enabled: false,
            addProduct: false
        },
        comment: {
            enabled: false,
            autoComment: false
        }
    })

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

    const handleSwitchChange = (section, field, checked) => {
        setConfig(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: checked
            }
        }))
    }

    const handleCheckboxChange = (section, field, checked) => {
        setConfig(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: checked
            }
        }))
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
            width={600}
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
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    Tên hành động
                                </label>
                                <Input
                                    value={action?.name || ''}
                                    disabled
                                    className="bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    Đường dẫn Live
                                </label>
                                <Input
                                    value={config.liveUrl}
                                    onChange={(e) => handleInputChange('liveUrl', null, null, e.target.value)}
                                    placeholder="https://www.tiktok.com/@username/live"
                                    className="border-gray-300 dark:border-gray-600"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Thời gian xem */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-5 mb-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <h6 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            Thời gian xem
                        </h6>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                Thời gian xem live (giây)
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
                            {/* Tương tác liên tục */}
                            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <h6 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                                            Tương tác liên tục
                                        </h6>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Lặp lại các hành động theo chu kỳ.
                                        </p>
                                    </div>
                                    <Switcher
                                        checked={config.continuousInteraction.enabled}
                                        onChange={(checked) => handleSwitchChange('continuousInteraction', 'enabled', checked)}
                                    />
                                </div>
                                
                                {config.continuousInteraction.enabled && (
                                    <div className="border-t border-gray-200 dark:border-gray-600 pt-3 space-y-3">
                                        <div>
                                            <Checkbox
                                                checked={config.continuousInteraction.emotionCycle}
                                                onChange={(checked) => handleCheckboxChange('continuousInteraction', 'emotionCycle', checked)}
                                            >
                                                Bật lô cảm xúc theo chu kỳ
                                            </Checkbox>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                Giãn cách giữa các chu kỳ (giây)
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={config.continuousInteraction.cycleDuration.min}
                                                    onChange={(e) => handleInputChange('continuousInteraction', 'cycleDuration', 'min', e.target.value)}
                                                    className="w-12 text-center text-sm"
                                                />
                                                <span className="text-xs text-gray-500">-</span>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={config.continuousInteraction.cycleDuration.max}
                                                    onChange={(e) => handleInputChange('continuousInteraction', 'cycleDuration', 'max', e.target.value)}
                                                    className="w-12 text-center text-sm"
                                                />
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                Tỷ lệ thực hiện (%)
                                            </label>
                                            <Input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={config.continuousInteraction.percentage}
                                                onChange={(e) => handlePercentageChange('continuousInteraction', e.target.value)}
                                                className="w-16 text-center text-sm"
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
                                                    value={config.continuousInteraction.waitTime.min}
                                                    onChange={(e) => handleInputChange('continuousInteraction', 'waitTime', 'min', e.target.value)}
                                                    className="w-12 text-center text-sm"
                                                />
                                                <span className="text-xs text-gray-500">-</span>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={config.continuousInteraction.waitTime.max}
                                                    onChange={(e) => handleInputChange('continuousInteraction', 'waitTime', 'max', e.target.value)}
                                                    className="w-12 text-center text-sm"
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
                                        <h6 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                                            Thả cảm xúc
                                        </h6>
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
                                            <Checkbox
                                                checked={config.emotion.showEmotion}
                                                onChange={(checked) => handleCheckboxChange('emotion', 'showEmotion', checked)}
                                            >
                                                Bày tỏ cảm xúc trong live stream
                                            </Checkbox>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                Tỷ lệ thực hiện (%)
                                            </label>
                                            <Input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={100}
                                                className="w-16 text-center text-sm"
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
                                                    value={1}
                                                    className="w-12 text-center text-sm"
                                                />
                                                <span className="text-xs text-gray-500">-</span>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={3}
                                                    className="w-12 text-center text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Hàng thứ hai */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            {/* Theo dõi */}
                            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <h6 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                                            Theo dõi
                                        </h6>
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
                                            <Checkbox
                                                checked={config.follow.autoFollow}
                                                onChange={(checked) => handleCheckboxChange('follow', 'autoFollow', checked)}
                                            >
                                                Tự động follow người phát sóng live
                                            </Checkbox>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                Tỷ lệ thực hiện (%)
                                            </label>
                                            <Input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={100}
                                                className="w-16 text-center text-sm"
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
                                                    value={1}
                                                    className="w-12 text-center text-sm"
                                                />
                                                <span className="text-xs text-gray-500">-</span>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={3}
                                                    className="w-12 text-center text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Thêm vào giỏ hàng */}
                            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <h6 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                                            Thêm vào giỏ hàng
                                        </h6>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Thêm sản phẩm từ live vào giỏ hàng.
                                        </p>
                                    </div>
                                    <Switcher
                                        checked={config.addToCart.enabled}
                                        onChange={(checked) => handleSwitchChange('addToCart', 'enabled', checked)}
                                    />
                                </div>
                                
                                {config.addToCart.enabled && (
                                    <div className="border-t border-gray-200 dark:border-gray-600 pt-3 space-y-3">
                                        <div>
                                            <Checkbox
                                                checked={config.addToCart.addProduct}
                                                onChange={(checked) => handleCheckboxChange('addToCart', 'addProduct', checked)}
                                            >
                                                Thêm sản phẩm từ live vào giỏ hàng
                                            </Checkbox>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                Tỷ lệ thực hiện (%)
                                            </label>
                                            <Input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={100}
                                                className="w-16 text-center text-sm"
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
                                                    value={1}
                                                    className="w-12 text-center text-sm"
                                                />
                                                <span className="text-xs text-gray-500">-</span>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={3}
                                                    className="w-12 text-center text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Hàng thứ ba - Bình luận live (full width) */}
                        <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <h6 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                                        Bình luận live
                                    </h6>
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
                                                value={100}
                                                className="w-16 text-center text-sm"
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
                                                    value={1}
                                                    className="w-12 text-center text-sm"
                                                />
                                                <span className="text-xs text-gray-500">-</span>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={3}
                                                    className="w-12 text-center text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                Ngôn ngữ đánh
                                            </label>
                                            <select className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                                                <option value="">Chọn nhóm nội dung</option>
                                                <option value="entertainment">Giải trí</option>
                                                <option value="education">Giáo dục</option>
                                                <option value="lifestyle">Lối sống</option>
                                            </select>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                Chủ đề nội dung (9 hình tròn)
                                            </label>
                                            <select className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                                                <option value="">Chọn chủ đề</option>
                                                <option value="music">Âm nhạc</option>
                                                <option value="dance">Nhảy múa</option>
                                                <option value="comedy">Hài hước</option>
                                                <option value="food">Ẩm thực</option>
                                                <option value="travel">Du lịch</option>
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

export default SpecificLiveInteractionModal
