'use client'
import { useState } from 'react'
import Dialog from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Switcher from '@/components/ui/Switcher'
import Checkbox from '@/components/ui/Checkbox'

const SpecificLiveInteractionModal = ({ isOpen, onClose, action, onSave }) => {
    // Initialize config based on JSON schema for Specific Live Form
    const [config, setConfig] = useState({
        name: "Tương tác live chỉ định",
        live_url: "",
        view_from: 3,
        view_to: 5,
        enable_continuous: false,
        continuous_gap_from: 5,
        continuous_gap_to: 10,
        continuous_like_enable: false,
        continuous_like_count_from: 10,
        continuous_like_count_to: 20,
        continuous_comment_enable: false,
        continuous_emotion_cycle: false,
        continuous_percentage: 100,
        enable_comment: false,
        enable_add_to_cart: false,
        comment_rate: 100,
        comment_gap_from: 1,
        comment_gap_to: 3,
        comment_contents: [],
        actions: {
            emotion: {
                enable: false,
                rate: 100,
                gap_from: 1,
                gap_to: 3,
                show_emotion: false
            },
            follow: {
                enable: false,
                rate: 100,
                gap_from: 1,
                gap_to: 3,
                auto_follow: false
            },
            addToCart: {
                enable: false,
                rate: 100,
                gap_from: 1,
                gap_to: 3,
                add_product: false
            }
        }
    })

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
                [field]: field.includes('_from') || field.includes('_to') || field.includes('_rate') || field.includes('_count')
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
            const saveData = {
                action_type: action?.type || 'specific_live_interaction',
                name: config.name,
                config: config
            }
            onSave(action, saveData)
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
                                        checked={config.enable_continuous}
                                        onChange={(checked) => handleSwitchChange('enable_continuous', checked)}
                                    />
                                </div>
                                
                                {config.enable_continuous && (
                                    <div className="border-t border-gray-200 dark:border-gray-600 pt-3 space-y-3">
                                        <div>
                                            <Checkbox
                                                checked={config.continuous_emotion_cycle}
                                                onChange={(checked) => handleSwitchChange('continuous_emotion_cycle', checked)}
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
                                                    value={config.continuous_gap_from}
                                                    onChange={(e) => handleInputChange('continuous_gap_from', e.target.value)}
                                                    className="w-12 text-center text-sm"
                                                />
                                                <span className="text-xs text-gray-500">-</span>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={config.continuous_gap_to}
                                                    onChange={(e) => handleInputChange('continuous_gap_to', e.target.value)}
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
                                                value={config.continuous_percentage}
                                                onChange={(e) => handleInputChange('continuous_percentage', e.target.value)}
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
                                                    value={config.continuous_like_count_from}
                                                    onChange={(e) => handleInputChange('continuous_like_count_from', e.target.value)}
                                                    className="w-12 text-center text-sm"
                                                />
                                                <span className="text-xs text-gray-500">-</span>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={config.continuous_like_count_to}
                                                    onChange={(e) => handleInputChange('continuous_like_count_to', e.target.value)}
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
                                        checked={config.actions.emotion.enable}
                                        onChange={(checked) => handleSwitchChange('actions.emotion.enable', checked)}
                                    />
                                </div>
                                
                                {config.actions.emotion.enable && (
                                    <div className="border-t border-gray-200 dark:border-gray-600 pt-3 space-y-3">
                                        <div>
                                            <Checkbox
                                                checked={config.actions.emotion.show_emotion}
                                                onChange={(checked) => handleSwitchChange('actions.emotion.show_emotion', checked)}
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
                                                value={config.actions.emotion.rate}
                                                onChange={(e) => handleInputChange('actions.emotion.rate', e.target.value)}
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
                                                    value={config.actions.emotion.gap_from}
                                                    onChange={(e) => handleInputChange('actions.emotion.gap_from', e.target.value)}
                                                    className="w-12 text-center text-sm"
                                                />
                                                <span className="text-xs text-gray-500">-</span>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={config.actions.emotion.gap_to}
                                                    onChange={(e) => handleInputChange('actions.emotion.gap_to', e.target.value)}
                                                    className="w-12 text-center text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Hàng thứ hai */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                                        checked={config.actions.follow.enable}
                                        onChange={(checked) => handleSwitchChange('actions.follow.enable', checked)}
                                    />
                                </div>
                                
                                {config.actions.follow.enable && (
                                    <div className="border-t border-gray-200 dark:border-gray-600 pt-3 space-y-3">
                                        <div>
                                            <Checkbox
                                                checked={config.actions.follow.auto_follow}
                                                onChange={(checked) => handleSwitchChange('actions.follow.auto_follow', checked)}
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
                                                value={config.actions.follow.rate}
                                                onChange={(e) => handleInputChange('actions.follow.rate', e.target.value)}
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
                                                    value={config.actions.follow.gap_from}
                                                    onChange={(e) => handleInputChange('actions.follow.gap_from', e.target.value)}
                                                    className="w-12 text-center text-sm"
                                                />
                                                <span className="text-xs text-gray-500">-</span>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={config.actions.follow.gap_to}
                                                    onChange={(e) => handleInputChange('actions.follow.gap_to', e.target.value)}
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
                                        checked={config.enable_add_to_cart || false}
                                        onChange={(checked) => handleSwitchChange('enable_add_to_cart', checked)}
                                    />
                                </div>
                                
                                {config.enable_add_to_cart && (
                                    <div className="border-t border-gray-200 dark:border-gray-600 pt-3 space-y-3">
                                        <div>
                                            <Checkbox
                                                checked={config.actions.addToCart.add_product}
                                                onChange={(checked) => handleSwitchChange('actions.addToCart.add_product', checked)}
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
                                                value={config.actions.addToCart.rate}
                                                onChange={(e) => handleInputChange('actions.addToCart.rate', e.target.value)}
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
                                                    value={config.actions.addToCart.gap_from}
                                                    onChange={(e) => handleInputChange('actions.addToCart.gap_from', e.target.value)}
                                                    className="w-12 text-center text-sm"
                                                />
                                                <span className="text-xs text-gray-500">-</span>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={config.actions.addToCart.gap_to}
                                                    onChange={(e) => handleInputChange('actions.addToCart.gap_to', e.target.value)}
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
                                                    value={config.comment_gap_from}
                                                    onChange={(e) => handleInputChange('comment_gap_from', e.target.value)}
                                                    className="w-12 text-center text-sm"
                                                />
                                                <span className="text-xs text-gray-500">-</span>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={config.comment_gap_to}
                                                    onChange={(e) => handleInputChange('comment_gap_to', e.target.value)}
                                                    className="w-12 text-center text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
