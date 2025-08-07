'use client'
import { useState } from 'react'
import Dialog from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const ChangeNameModal = ({ isOpen, onClose, action, onSave }) => {
    const [config, setConfig] = useState({
        // Cấu hình cơ bản
        actionName: action?.name || 'Đổi tên',
        
        // Lựa chọn
        nameSource: 'random', // 'random', 'custom', 'list'
        
        // Loại tên
        nameType: 'vietnamese', // 'vietnamese', 'international'
    })

    const handleInputChange = (field, value) => {
        setConfig(prev => ({
            ...prev,
            [field]: value
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
            width={450}
            className="z-[80]"
        >
            <div className="flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-600 flex-shrink-0">
                    <h5 className="font-bold text-lg">Thêm Đổi tên</h5>
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
                    
                    {/* Lựa chọn */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            Lựa chọn
                        </label>
                        <select 
                            value={config.nameSource}
                            onChange={(e) => handleInputChange('nameSource', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        >
                            <option value="random">Ngẫu nhiên</option>
                            <option value="custom">Tùy chỉnh</option>
                            <option value="list">Từ danh sách</option>
                            <option value="generator">Tự động tạo</option>
                        </select>
                    </div>
                    
                    {/* Loại tên */}
                    <div>
                        <div className="space-y-3">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="nameType"
                                    value="vietnamese"
                                    checked={config.nameType === 'vietnamese'}
                                    onChange={(e) => handleRadioChange('nameType', e.target.value)}
                                    className="mr-3 text-blue-500"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">Theo tên Việt</span>
                            </label>
                            
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="nameType"
                                    value="international"
                                    checked={config.nameType === 'international'}
                                    onChange={(e) => handleRadioChange('nameType', e.target.value)}
                                    className="mr-3 text-blue-500"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">Theo tên Quốc Tế</span>
                            </label>
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

export default ChangeNameModal
