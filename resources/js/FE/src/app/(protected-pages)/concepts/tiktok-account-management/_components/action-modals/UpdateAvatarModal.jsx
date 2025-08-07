'use client'
import { useState } from 'react'
import Dialog from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Checkbox from '@/components/ui/Checkbox'

const UpdateAvatarModal = ({ isOpen, onClose, action, onSave }) => {
    const [config, setConfig] = useState({
        // Cấu hình cơ bản
        actionName: action?.name || 'Cập nhật Ảnh đại diện',
        
        // Ảnh
        imageSource: 'random', // 'random', 'gallery', 'camera', 'url'
        
        // Xóa ảnh đã sử dụng
        removeUsedImage: false
    })

    const handleInputChange = (field, value) => {
        setConfig(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleCheckboxChange = (field, checked) => {
        setConfig(prev => ({
            ...prev,
            [field]: checked
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
            width={500}
            className="z-[80]"
        >
            <div className="flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-600 flex-shrink-0">
                    <h5 className="font-bold text-lg">Cập nhật Ảnh đại diện</h5>
                </div>
                
                {/* Content */}
                <div className="p-4 space-y-4">
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
                    
                    {/* Ảnh */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            Ảnh:
                        </label>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <select 
                                    value={config.imageSource}
                                    onChange={(e) => handleInputChange('imageSource', e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                >
                                    <option value="random">Chọn nguồn ảnh</option>
                                    <option value="gallery">Thư viện ảnh</option>
                                    <option value="camera">Chụp ảnh mới</option>
                                    <option value="url">Từ URL</option>
                                    <option value="upload">Tải lên từ máy</option>
                                </select>
                                
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="text-gray-600 dark:text-gray-400 px-3 py-2"
                                >
                                    📁
                                </Button>
                            </div>
                            
                            <div>
                                <Checkbox
                                    checked={config.removeUsedImage}
                                    onChange={(checked) => handleCheckboxChange('removeUsedImage', checked)}
                                >
                                    Xóa ảnh đã sử dụng
                                </Checkbox>
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
                            color="blue-500"
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

export default UpdateAvatarModal
