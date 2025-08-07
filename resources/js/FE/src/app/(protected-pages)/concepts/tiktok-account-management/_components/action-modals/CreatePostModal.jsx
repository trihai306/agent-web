'use client'
import { useState } from 'react'
import Dialog from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Checkbox from '@/components/ui/Checkbox'

const CreatePostModal = ({ isOpen, onClose, action, onSave }) => {
    const [config, setConfig] = useState({
        // Cấu hình cơ bản
        actionName: action?.name || 'Tạo bài viết',
        
        // Thời gian chờ load video
        loadVideoTime: { min: 3, max: 5 },
        
        // Đăng video theo tên file
        uploadByFileName: false,
        
        // Tiêu đề
        title: '',
        
        // Nội dung
        content: '',
        
        // Ảnh
        imageSource: 'random', // 'random' hoặc 'custom'
        removeWatermark: false,
        autoCut: false,
        
        // Chỉnh sửa Filter
        filterType: 'random', // 'random' hoặc 'custom'
        addTrendingMusic: false
    })

    const handleInputChange = (field, value) => {
        setConfig(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleTimeInputChange = (section, type, value) => {
        setConfig(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [type]: parseInt(value) || 0
            }
        }))
    }

    const handleCheckboxChange = (field, checked) => {
        setConfig(prev => ({
            ...prev,
            [field]: checked
        }))
    }

    const handleRadioChange = (field, value) => {
        setConfig(prev => ({
            ...prev,
            [field]: value
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
            <div className="flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-600 flex-shrink-0">
                    <h5 className="font-bold text-lg">Thêm Tạo bài viết</h5>
                </div>
                
                {/* Content */}
                <div className="p-6 flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 min-h-0">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Cột trái */}
                        <div className="space-y-6">
                            {/* Tên hành động */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    <span className="text-red-500">*</span> Tên hành động
                                </label>
                                <Input
                                    value={config.actionName}
                                    onChange={(e) => handleInputChange('actionName', e.target.value)}
                                    className="border-gray-300 dark:border-gray-600"
                                />
                            </div>
                            
                            {/* Thời gian chờ load video */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Thời gian chờ load video
                                </label>
                                <div className="flex items-center gap-3">
                                    <Input
                                        type="number"
                                        min="1"
                                        value={config.loadVideoTime.min}
                                        onChange={(e) => handleTimeInputChange('loadVideoTime', 'min', e.target.value)}
                                        className="w-20 text-center border-gray-300 dark:border-gray-600"
                                    />
                                    <span className="text-gray-500 font-medium">-</span>
                                    <Input
                                        type="number"
                                        min="1"
                                        value={config.loadVideoTime.max}
                                        onChange={(e) => handleTimeInputChange('loadVideoTime', 'max', e.target.value)}
                                        className="w-20 text-center border-gray-300 dark:border-gray-600"
                                    />
                                    <span className="text-sm text-gray-500">giây</span>
                                </div>
                            </div>
                            
                            {/* Đăng video theo tên file */}
                            <div>
                                <Checkbox
                                    checked={config.uploadByFileName}
                                    onChange={(checked) => handleCheckboxChange('uploadByFileName', checked)}
                                >
                                    Đăng video theo tên file
                                </Checkbox>
                            </div>
                            
                            {/* Tiêu đề */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Tiêu đề
                                </label>
                                <Input
                                    value={config.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                    placeholder="Nhập tiêu đề bài viết"
                                    className="border-gray-300 dark:border-gray-600"
                                />
                            </div>
                            
                            {/* Nội dung */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Nội dung
                                </label>
                                <textarea
                                    value={config.content}
                                    onChange={(e) => handleInputChange('content', e.target.value)}
                                    placeholder="Nhập nội dung bài viết..."
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                />
                            </div>
                        </div>
                        
                        {/* Cột phải */}
                        <div className="space-y-6">
                            {/* Ảnh */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    Ảnh:
                                </label>
                                <div className="space-y-3">
                                    <select 
                                        value={config.imageSource}
                                        onChange={(e) => handleRadioChange('imageSource', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    >
                                        <option value="random">Chọn nguồn ảnh</option>
                                        <option value="gallery">Thư viện ảnh</option>
                                        <option value="camera">Chụp ảnh mới</option>
                                        <option value="url">Từ URL</option>
                                    </select>
                                    
                                    <div className="flex items-center gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="text-gray-600 dark:text-gray-400"
                                        >
                                            📁
                                        </Button>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Checkbox
                                            checked={config.removeWatermark}
                                            onChange={(checked) => handleCheckboxChange('removeWatermark', checked)}
                                        >
                                            Xóa ảnh đã sử dụng
                                        </Checkbox>
                                        
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                checked={config.autoCut}
                                                onChange={(checked) => handleCheckboxChange('autoCut', checked)}
                                            >
                                                AutoCut
                                            </Checkbox>
                                            <span className="text-yellow-500 text-sm">ⓘ</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Chỉnh sửa Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    Chỉnh sửa Filter
                                </label>
                                <div className="space-y-3">
                                    <div className="space-y-2">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="filterType"
                                                value="random"
                                                checked={config.filterType === 'random'}
                                                onChange={(e) => handleRadioChange('filterType', e.target.value)}
                                                className="mr-2 text-blue-500"
                                            />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">Random</span>
                                        </label>
                                        
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="filterType"
                                                value="custom"
                                                checked={config.filterType === 'custom'}
                                                onChange={(e) => handleRadioChange('filterType', e.target.value)}
                                                className="mr-2 text-blue-500"
                                            />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">Custom (List Filter)</span>
                                            <span className="text-yellow-500 text-sm">ⓘ</span>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-3">
                                        <Checkbox
                                            checked={config.addTrendingMusic}
                                            onChange={(checked) => handleCheckboxChange('addTrendingMusic', checked)}
                                        >
                                            Thêm nhạc trend
                                        </Checkbox>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-600 flex-shrink-0 bg-white dark:bg-gray-800">
                    <div className="flex justify-end gap-3">
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
                            color="orange-500"
                            onClick={handleSave}
                        >
                            Lưu
                        </Button>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}

export default CreatePostModal
