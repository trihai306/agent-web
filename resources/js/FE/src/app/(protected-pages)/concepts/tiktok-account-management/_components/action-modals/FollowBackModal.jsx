'use client'
import { useState } from 'react'
import Dialog from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const FollowBackModal = ({ isOpen, onClose, action, onSave }) => {
    const [config, setConfig] = useState({
        // Cấu hình cơ bản
        actionName: action?.name || 'Theo dõi lại',
        
        // Số lượng user
        userCount: { min: 1, max: 1 },
        
        // Giãn cách thời gian
        interval: { min: 3, max: 5 }
    })

    const handleInputChange = (section, type, value) => {
        setConfig(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [type]: parseInt(value) || 0
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
            width={400}
            className="z-[80]"
        >
            <div className="flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-600 flex-shrink-0">
                    <h5 className="font-bold">Thêm Theo dõi lại</h5>
                </div>
                
                {/* Content */}
                <div className="p-4 space-y-4">
                    {/* Tên hành động */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Tên hành động
                        </label>
                        <Input
                            value={config.actionName}
                            disabled
                            className="bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                        />
                    </div>
                    
                    {/* Số lượng user */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Số lượng user
                        </label>
                        <div className="flex items-center gap-3">
                            <Input
                                type="number"
                                min="1"
                                value={config.userCount.min}
                                onChange={(e) => handleInputChange('userCount', 'min', e.target.value)}
                                className="w-16 text-center border-gray-300 dark:border-gray-600"
                            />
                            <span className="text-gray-500 font-medium">-</span>
                            <Input
                                type="number"
                                min="1"
                                value={config.userCount.max}
                                onChange={(e) => handleInputChange('userCount', 'max', e.target.value)}
                                className="w-16 text-center border-gray-300 dark:border-gray-600"
                            />
                            <span className="text-sm text-gray-500">user</span>
                        </div>
                    </div>
                    
                    {/* Giãn cách */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Giãn cách
                        </label>
                        <div className="flex items-center gap-3">
                            <Input
                                type="number"
                                min="1"
                                value={config.interval.min}
                                onChange={(e) => handleInputChange('interval', 'min', e.target.value)}
                                className="w-16 text-center border-gray-300 dark:border-gray-600"
                            />
                            <span className="text-gray-500 font-medium">-</span>
                            <Input
                                type="number"
                                min="1"
                                value={config.interval.max}
                                onChange={(e) => handleInputChange('interval', 'max', e.target.value)}
                                className="w-16 text-center border-gray-300 dark:border-gray-600"
                            />
                            <span className="text-sm text-gray-500">giây</span>
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
                            Lưu
                        </Button>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}

export default FollowBackModal
