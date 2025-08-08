'use client'
import { useState } from 'react'
import Dialog from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Checkbox from '@/components/ui/Checkbox'

const FollowUserModal = ({ isOpen, onClose, action, onSave }) => {
    // Initialize config based on JSON schema for Follow User Form
    const [config, setConfig] = useState({
        name: "Theo dõi User",
        follow_type: "list",
        user_list: "",
        keyword_list: "",
        count_from: 1,
        count_to: 2,
        gap_from: 3,
        gap_to: 5,
        exit_on_fail: false,
        exit_fail_count: 5,
        open_link_search: false
    })

    const handleInputChange = (field, value) => {
        setConfig(prev => ({
            ...prev,
            [field]: field.includes('_from') || field.includes('_to') || field.includes('_count')
                ? parseInt(value) || 0 
                : value
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
            const saveData = {
                action_type: action?.type || 'follow_user',
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
            width={500}
            className="z-[80]"
        >
            <div className="flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-600 flex-shrink-0">
                    <h5 className="font-bold text-lg">Theo dõi User</h5>
                </div>
                
                {/* Content */}
                <div className="p-4 flex-1 overflow-y-auto space-y-4">
                    {/* Tên hành động */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Tên hành động
                        </label>
                        <Input
                            value={config.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className="border-gray-300 dark:border-gray-600"
                        />
                    </div>
                    
                    {/* Loại theo dõi */}
                    <div>
                        <div className="flex items-center gap-6 mb-3">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="followType"
                                    value="list"
                                    checked={config.follow_type === 'list'}
                                    onChange={(e) => handleRadioChange('follow_type', e.target.value)}
                                    className="mr-2 text-blue-500"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">Theo dõi theo danh sách</span>
                            </label>
                            
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="followType"
                                    value="keyword"
                                    checked={config.follow_type === 'keyword'}
                                    onChange={(e) => handleRadioChange('follow_type', e.target.value)}
                                    className="mr-2 text-blue-500"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">Theo dõi theo từ khóa</span>
                            </label>
                        </div>
                    </div>
                    
                    {/* Danh sách người dùng */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Danh sách người dùng
                        </label>
                        <textarea
                            value={config.user_list}
                            onChange={(e) => handleInputChange('user_list', e.target.value)}
                            placeholder="uid1&#10;uid2"
                            rows={6}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
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
                                value={config.count_from}
                                onChange={(e) => handleInputChange('count_from', e.target.value)}
                                className="w-20 text-center border-gray-300 dark:border-gray-600"
                            />
                            <span className="text-gray-500 font-medium">-</span>
                            <Input
                                type="number"
                                min="1"
                                value={config.count_to}
                                onChange={(e) => handleInputChange('count_to', e.target.value)}
                                className="w-20 text-center border-gray-300 dark:border-gray-600"
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
                                value={config.gap_from}
                                onChange={(e) => handleInputChange('gap_from', e.target.value)}
                                className="w-20 text-center border-gray-300 dark:border-gray-600"
                            />
                            <span className="text-gray-500 font-medium">-</span>
                            <Input
                                type="number"
                                min="1"
                                value={config.gap_to}
                                onChange={(e) => handleInputChange('gap_to', e.target.value)}
                                className="w-20 text-center border-gray-300 dark:border-gray-600"
                            />
                            <span className="text-sm text-gray-500">giây</span>
                        </div>
                    </div>
                    
                    {/* Thoát khi follow fail */}
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Checkbox
                                checked={config.exit_on_fail}
                                onChange={(checked) => handleCheckboxChange('exit_on_fail', checked)}
                            >
                                Thoát khi follow fail
                            </Checkbox>
                            {config.exit_on_fail && (
                                <>
                                    <Input
                                        type="number"
                                        min="1"
                                        value={config.exit_fail_count}
                                        onChange={(e) => handleInputChange('exit_fail_count', e.target.value)}
                                        className="w-20 text-center border-gray-300 dark:border-gray-600"
                                    />
                                    <span className="text-sm text-gray-500">lượt</span>
                                </>
                            )}
                        </div>
                    </div>
                    
                    {/* Mở link bằng tìm kiếm */}
                    <div>
                        <Checkbox
                            checked={config.open_link_search}
                            onChange={(checked) => handleCheckboxChange('open_link_search', checked)}
                        >
                            Mở link bằng tìm kiếm
                        </Checkbox>
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

export default FollowUserModal