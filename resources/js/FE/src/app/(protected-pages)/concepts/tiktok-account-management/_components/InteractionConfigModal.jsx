'use client'
import { useState, useEffect } from 'react'
import Dialog from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { TbSearch, TbPlus, TbEdit, TbTrash } from 'react-icons/tb'
import { useTranslations } from 'next-intl'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import ActionListModal from './ActionListModal'
import ActionConfigModal from './ActionConfigModal'
import VideoInteractionModal from './VideoInteractionModal'
import SpecificVideoInteractionModal from './SpecificVideoInteractionModal'
import KeywordVideoInteractionModal from './KeywordVideoInteractionModal'
import UserVideoInteractionModal from './UserVideoInteractionModal'
import RandomLiveInteractionModal from './RandomLiveInteractionModal'
import SpecificLiveInteractionModal from './SpecificLiveInteractionModal'

const InteractionConfigModal = ({ isOpen, onClose }) => {
    const t = useTranslations('tiktokAccountManagement.interactionConfigModal')
    
    // Mock data - có thể thay thế bằng API calls
    const [scenarios, setScenarios] = useState([
        { id: 1, name: 'change avt', status: 'active' },
        { id: 2, name: 'Đừng xóa', status: 'active' },
        { id: 3, name: '1', status: 'active' }
    ])
    
    const [selectedScenario, setSelectedScenario] = useState(scenarios[0])
    const [searchTerm, setSearchTerm] = useState('')
    
    // Mock actions data
    const [actions, setActions] = useState([
        { 
            id: 1, 
            name: 'Cập nhật Ảnh đại diện',
            scenarioId: 1
        }
    ])

    const [filteredScenarios, setFilteredScenarios] = useState(scenarios)
    
    // Modal states
    const [showScenarioModal, setShowScenarioModal] = useState(false)
    const [showActionModal, setShowActionModal] = useState(false)
    const [showActionListModal, setShowActionListModal] = useState(false)
    const [showActionConfigModal, setShowActionConfigModal] = useState(false)
    const [showVideoInteractionModal, setShowVideoInteractionModal] = useState(false)
    const [showSpecificVideoInteractionModal, setShowSpecificVideoInteractionModal] = useState(false)
    const [showKeywordVideoInteractionModal, setShowKeywordVideoInteractionModal] = useState(false)
    const [showUserVideoInteractionModal, setShowUserVideoInteractionModal] = useState(false)
    const [showRandomLiveInteractionModal, setShowRandomLiveInteractionModal] = useState(false)
    const [showSpecificLiveInteractionModal, setShowSpecificLiveInteractionModal] = useState(false)
    const [showDeleteScenarioDialog, setShowDeleteScenarioDialog] = useState(false)
    const [showDeleteActionDialog, setShowDeleteActionDialog] = useState(false)
    const [editingScenario, setEditingScenario] = useState(null)
    const [editingAction, setEditingAction] = useState(null)
    const [configuringAction, setConfiguringAction] = useState(null)
    const [deletingScenario, setDeletingScenario] = useState(null)
    const [deletingAction, setDeletingAction] = useState(null)
    
    // Form states
    const [scenarioForm, setScenarioForm] = useState({ name: '', status: 'active' })
    const [actionForm, setActionForm] = useState({ name: '', scenarioId: null })

    useEffect(() => {
        const filtered = scenarios.filter(scenario => 
            scenario.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        setFilteredScenarios(filtered)
    }, [scenarios, searchTerm])

    const handleScenarioSelect = (scenario) => {
        setSelectedScenario(scenario)
    }

    const getScenarioActions = (scenarioId) => {
        return actions.filter(action => action.scenarioId === scenarioId)
    }

    const currentActions = selectedScenario ? getScenarioActions(selectedScenario.id) : []
    
    // Scenario CRUD functions
    const handleAddScenario = () => {
        setEditingScenario(null)
        setScenarioForm({ name: '', status: 'active' })
        setShowScenarioModal(true)
    }
    
    const handleEditScenario = (scenario) => {
        setEditingScenario(scenario)
        setScenarioForm({ name: scenario.name, status: scenario.status })
        setShowScenarioModal(true)
    }
    
    const handleDeleteScenario = (scenario) => {
        setDeletingScenario(scenario)
        setShowDeleteScenarioDialog(true)
    }
    
    const confirmDeleteScenario = () => {
        if (deletingScenario) {
            setScenarios(prev => prev.filter(s => s.id !== deletingScenario.id))
            setActions(prev => prev.filter(a => a.scenarioId !== deletingScenario.id))
            
            if (selectedScenario?.id === deletingScenario.id) {
                const remainingScenarios = scenarios.filter(s => s.id !== deletingScenario.id)
                setSelectedScenario(remainingScenarios[0] || null)
            }
            
            toast.push(
                <Notification title="Thành công" type="success" closable>
                    {t('toast.scenarioDeleted')}
                </Notification>
            )
        }
        
        setShowDeleteScenarioDialog(false)
        setDeletingScenario(null)
    }
    
    const handleSaveScenario = () => {
        if (!scenarioForm.name.trim()) {
            toast.push(
                <Notification title="Lỗi" type="danger" closable>
                    {t('toast.nameRequired')}
                </Notification>
            )
            return
        }
        
        if (editingScenario) {
            // Update existing scenario
            setScenarios(prev => prev.map(s => 
                s.id === editingScenario.id 
                    ? { ...s, name: scenarioForm.name, status: scenarioForm.status }
                    : s
            ))
            
            if (selectedScenario?.id === editingScenario.id) {
                setSelectedScenario(prev => ({ ...prev, name: scenarioForm.name, status: scenarioForm.status }))
            }
        } else {
            // Add new scenario
            const newScenario = {
                id: Math.max(...scenarios.map(s => s.id), 0) + 1,
                name: scenarioForm.name,
                status: scenarioForm.status
            }
            setScenarios(prev => [...prev, newScenario])
        }
        
        setShowScenarioModal(false)
        setEditingScenario(null)
        
        toast.push(
            <Notification title="Thành công" type="success" closable>
                {editingScenario ? t('toast.scenarioUpdated') : t('toast.scenarioAdded')}
            </Notification>
        )
    }
    
    // Action CRUD functions
    const handleAddAction = () => {
        if (!selectedScenario) {
            toast.push(
                <Notification title="Lỗi" type="danger" closable>
                    {t('toast.selectScenarioFirst')}
                </Notification>
            )
            return
        }
        
        setShowActionListModal(true)
    }
    
    const handleSelectActionFromList = (actionData, scenario) => {
        // Tạo action mới nhưng chưa thêm vào danh sách
        const newAction = {
            id: Math.max(...actions.map(a => a.id), 0) + 1,
            name: actionData.name,
            scenarioId: scenario.id,
            actionId: actionData.id,
            isNew: true // Đánh dấu là action mới
        }
        
        // Không đóng ActionListModal, chỉ mở modal cấu hình phù hợp
        // setShowActionListModal(false) // Đã comment để không đóng modal danh sách
        setConfiguringAction(newAction)
        
        // Kiểm tra loại hành động để mở modal phù hợp
        const randomVideoActions = ['random_video_interaction']
        const specificVideoActions = ['specific_video_interaction']
        const keywordVideoActions = ['keyword_video_interaction']
        const userVideoActions = ['user_video_interaction']
        const randomLiveActions = ['random_live_interaction']
        const specificLiveActions = ['specific_live_interaction']
        
        if (randomVideoActions.includes(actionData.id)) {
            setShowVideoInteractionModal(true)
        } else if (specificVideoActions.includes(actionData.id)) {
            setShowSpecificVideoInteractionModal(true)
        } else if (keywordVideoActions.includes(actionData.id)) {
            setShowKeywordVideoInteractionModal(true)
        } else if (userVideoActions.includes(actionData.id)) {
            setShowUserVideoInteractionModal(true)
        } else if (randomLiveActions.includes(actionData.id)) {
            setShowRandomLiveInteractionModal(true)
        } else if (specificLiveActions.includes(actionData.id)) {
            setShowSpecificLiveInteractionModal(true)
        } else {
            setShowActionConfigModal(true)
        }
    }
    
    const handleEditAction = (action) => {
        setConfiguringAction(action)
        
        // Kiểm tra loại hành động để mở modal phù hợp
        const randomVideoActions = ['random_video_interaction']
        const specificVideoActions = ['specific_video_interaction']
        const keywordVideoActions = ['keyword_video_interaction']
        const userVideoActions = ['user_video_interaction']
        const randomLiveActions = ['random_live_interaction']
        const specificLiveActions = ['specific_live_interaction']
        
        if (randomVideoActions.includes(action.actionId)) {
            setShowVideoInteractionModal(true)
        } else if (specificVideoActions.includes(action.actionId)) {
            setShowSpecificVideoInteractionModal(true)
        } else if (keywordVideoActions.includes(action.actionId)) {
            setShowKeywordVideoInteractionModal(true)
        } else if (userVideoActions.includes(action.actionId)) {
            setShowUserVideoInteractionModal(true)
        } else if (randomLiveActions.includes(action.actionId)) {
            setShowRandomLiveInteractionModal(true)
        } else if (specificLiveActions.includes(action.actionId)) {
            setShowSpecificLiveInteractionModal(true)
        } else {
            setShowActionConfigModal(true)
        }
    }
    
    const handleActionConfigSave = (action, config) => {
        if (action.isNew) {
            // Thêm action mới vào danh sách với cấu hình
            const newAction = { ...action, config: config }
            delete newAction.isNew // Xóa flag isNew
            setActions(prev => [...prev, newAction])
            
            toast.push(
                <Notification title="Thành công" type="success" closable>
                    {t('toast.actionAdded')}
                </Notification>
            )
        } else {
            // Cập nhật cấu hình action hiện có
            setActions(prev => prev.map(a => 
                a.id === action.id 
                    ? { ...a, config: config }
                    : a
            ))
            
            toast.push(
                <Notification title="Thành công" type="success" closable>
                    Đã lưu cấu hình hành động
                </Notification>
            )
        }
        
        setShowActionConfigModal(false)
        setShowActionListModal(false)
        setConfiguringAction(null)
    }

    const handleVideoInteractionSave = (action, config) => {
        if (action.isNew) {
            // Thêm action mới vào danh sách với cấu hình
            const newAction = { ...action, config: config }
            delete newAction.isNew // Xóa flag isNew
            setActions(prev => [...prev, newAction])
            
            toast.push(
                <Notification title="Thành công" type="success" closable>
                    {t('toast.actionAdded')}
                </Notification>
            )
        } else {
            // Cập nhật cấu hình action hiện có
            setActions(prev => prev.map(a => 
                a.id === action.id 
                    ? { ...a, config: config }
                    : a
            ))
            
            toast.push(
                <Notification title="Thành công" type="success" closable>
                    Đã lưu cấu hình hành động
                </Notification>
            )
        }
        
        setShowVideoInteractionModal(false)
        setShowActionListModal(false)
        setConfiguringAction(null)
    }

    const handleSpecificVideoInteractionSave = (action, config) => {
        if (action.isNew) {
            // Thêm action mới vào danh sách với cấu hình
            const newAction = { ...action, config: config }
            delete newAction.isNew // Xóa flag isNew
            setActions(prev => [...prev, newAction])
            
            toast.push(
                <Notification title="Thành công" type="success" closable>
                    {t('toast.actionAdded')}
                </Notification>
            )
        } else {
            // Cập nhật cấu hình action hiện có
            setActions(prev => prev.map(a => 
                a.id === action.id 
                    ? { ...a, config: config }
                    : a
            ))
            
            toast.push(
                <Notification title="Thành công" type="success" closable>
                    Đã lưu cấu hình hành động
                </Notification>
            )
        }
        
        setShowSpecificVideoInteractionModal(false)
        setShowActionListModal(false)
        setConfiguringAction(null)
    }

    const handleKeywordVideoInteractionSave = (action, config) => {
        if (action.isNew) {
            const newAction = { ...action, config: config }
            delete newAction.isNew
            setActions(prev => [...prev, newAction])
            
            toast.push(
                <Notification title="Thành công" type="success" closable>
                    {t('toast.actionAdded')}
                </Notification>
            )
        } else {
            setActions(prev => prev.map(a => 
                a.id === action.id ? { ...a, config: config } : a
            ))
            
            toast.push(
                <Notification title="Thành công" type="success" closable>
                    Đã lưu cấu hình hành động
                </Notification>
            )
        }
        
        setShowKeywordVideoInteractionModal(false)
        setShowActionListModal(false)
        setConfiguringAction(null)
    }

    const handleUserVideoInteractionSave = (action, config) => {
        if (action.isNew) {
            const newAction = { ...action, config: config }
            delete newAction.isNew
            setActions(prev => [...prev, newAction])
            
            toast.push(
                <Notification title="Thành công" type="success" closable>
                    {t('toast.actionAdded')}
                </Notification>
            )
        } else {
            setActions(prev => prev.map(a => 
                a.id === action.id ? { ...a, config: config } : a
            ))
            
            toast.push(
                <Notification title="Thành công" type="success" closable>
                    Đã lưu cấu hình hành động
                </Notification>
            )
        }
        
        setShowUserVideoInteractionModal(false)
        setShowActionListModal(false)
        setConfiguringAction(null)
    }

    const handleRandomLiveInteractionSave = (action, config) => {
        if (action.isNew) {
            const newAction = { ...action, config: config }
            delete newAction.isNew
            setActions(prev => [...prev, newAction])
            
            toast.push(
                <Notification title="Thành công" type="success" closable>
                    {t('toast.actionAdded')}
                </Notification>
            )
        } else {
            setActions(prev => prev.map(a => 
                a.id === action.id ? { ...a, config: config } : a
            ))
            
            toast.push(
                <Notification title="Thành công" type="success" closable>
                    Đã lưu cấu hình hành động
                </Notification>
            )
        }
        
        setShowRandomLiveInteractionModal(false)
        setShowActionListModal(false)
        setConfiguringAction(null)
    }

    const handleSpecificLiveInteractionSave = (action, config) => {
        if (action.isNew) {
            const newAction = { ...action, config: config }
            delete newAction.isNew
            setActions(prev => [...prev, newAction])
            
            toast.push(
                <Notification title="Thành công" type="success" closable>
                    {t('toast.actionAdded')}
                </Notification>
            )
        } else {
            setActions(prev => prev.map(a => 
                a.id === action.id ? { ...a, config: config } : a
            ))
            
            toast.push(
                <Notification title="Thành công" type="success" closable>
                    Đã lưu cấu hình hành động
                </Notification>
            )
        }
        
        setShowSpecificLiveInteractionModal(false)
        setShowActionListModal(false)
        setConfiguringAction(null)
    }
    
    const handleDeleteAction = (action) => {
        setDeletingAction(action)
        setShowDeleteActionDialog(true)
    }
    
    const confirmDeleteAction = () => {
        if (deletingAction) {
            setActions(prev => prev.filter(a => a.id !== deletingAction.id))
            
            toast.push(
                <Notification title="Thành công" type="success" closable>
                    {t('toast.actionDeleted')}
                </Notification>
            )
        }
        
        setShowDeleteActionDialog(false)
        setDeletingAction(null)
    }
    
    const handleSaveAction = () => {
        if (!actionForm.name.trim()) {
            toast.push(
                <Notification title="Lỗi" type="danger" closable>
                    {t('toast.nameRequired')}
                </Notification>
            )
            return
        }
        
        if (editingAction) {
            // Update existing action
            setActions(prev => prev.map(a => 
                a.id === editingAction.id 
                    ? { ...a, name: actionForm.name }
                    : a
            ))
        } else {
            // Add new action
            const newAction = {
                id: Math.max(...actions.map(a => a.id), 0) + 1,
                name: actionForm.name,
                scenarioId: actionForm.scenarioId
            }
            setActions(prev => [...prev, newAction])
        }
        
        setShowActionModal(false)
        setEditingAction(null)
        
        toast.push(
            <Notification title="Thành công" type="success" closable>
                {editingAction ? t('toast.actionUpdated') : t('toast.actionAdded')}
            </Notification>
        )
    }

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            onRequestClose={onClose}
            width={1200}
            className="z-50"
        >
            <div className="flex flex-col h-full">
                {/* Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-600">
                    <h5 className="font-bold">{t('title')}</h5>
                </div>
                
                {/* Content */}
                <div className="p-4 flex-1 overflow-y-auto">
                    <div className="grid grid-cols-12 gap-6 h-full">
                        {/* Left Panel - Scenarios */}
                        <div className="col-span-5">
                            <div className="flex items-center justify-between mb-4">
                                <h6 className="font-semibold">{t('scenarios')}</h6>
                                <Button
                                    size="sm"
                                    variant="solid"
                                    color="blue-500"
                                    icon={<TbPlus />}
                                    onClick={handleAddScenario}
                                >
                                    {t('addScenario')}
                                </Button>
                            </div>
                            
                            {/* Search */}
                            <div className="mb-4">
                                <Input
                                    placeholder={t('searchPlaceholder')}
                                    suffix={<TbSearch className="text-lg" />}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* Scenarios List */}
                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                {filteredScenarios.map((scenario) => (
                                    <div
                                        key={scenario.id}
                                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                            selectedScenario?.id === scenario.id
                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                                        }`}
                                        onClick={() => handleScenarioSelect(scenario)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">{scenario.name}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs px-2 py-1 rounded bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                                                    Hoạt động
                                                </span>
                                                <div className="flex gap-1">
                                                    <button 
                                                        className="text-blue-500 hover:text-blue-600"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleEditScenario(scenario)
                                                        }}
                                                    >
                                                        <TbEdit size={16} />
                                                    </button>
                                                    <button 
                                                        className="text-red-500 hover:text-red-600"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleDeleteScenario(scenario)
                                                        }}
                                                    >
                                                        <TbTrash size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Panel - Scenario Details */}
                        <div className="col-span-7">
                            {selectedScenario ? (
                                                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <h6 className="font-semibold">Kịch bản: {selectedScenario.name}</h6>
                                                <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                    <span>Tổng số hành động: {currentActions.length}</span>
                                                    <span>Đã chạy: 0 lần</span>
                                                </div>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="solid"
                                                color="green-500"
                                                icon={<TbPlus />}
                                                onClick={handleAddAction}
                                            >
                                                {t('addAction')}
                                            </Button>
                                        </div>

                                    {/* Actions Table */}
                                    <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                                        <table className="w-full">
                                            <thead className="bg-gray-50 dark:bg-gray-800">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                        {t('actionTable.id')}
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                        {t('actionTable.name')}
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                        {t('actionTable.options')}
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-600">
                                                {currentActions.length > 0 ? currentActions.map((action) => (
                                                    <tr key={action.id}>
                                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                            {action.id}
                                                        </td>
                                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                            {action.name}
                                                        </td>
                                                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                                            <div className="flex gap-2">
                                                                <button 
                                                                    className="text-blue-500 hover:text-blue-600"
                                                                    onClick={() => handleEditAction(action)}
                                                                >
                                                                    <TbEdit size={18} />
                                                                </button>
                                                                <button 
                                                                    className="text-red-500 hover:text-red-600"
                                                                    onClick={() => handleDeleteAction(action)}
                                                                >
                                                                    <TbTrash size={18} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )) : (
                                                    <tr>
                                                        <td colSpan={3} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                                            {t('noActions')}
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    {currentActions.length > 0 && (
                                        <div className="flex justify-center mt-4">
                                            <div className="flex items-center space-x-2">
                                                <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">
                                                    &lt;
                                                </button>
                                                <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded">
                                                    1
                                                </button>
                                                <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">
                                                    &gt;
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                                    {t('selectScenario')}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex justify-end">
                        <Button
                            type="button"
                            variant="default"
                            onClick={onClose}
                        >
                            {t('close')}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Scenario Modal */}
            <Dialog
                isOpen={showScenarioModal}
                onClose={() => setShowScenarioModal(false)}
                onRequestClose={() => setShowScenarioModal(false)}
                width={500}
                className="z-[60]"
            >
                <div className="p-4 border-b border-gray-200 dark:border-gray-600">
                    <h5 className="font-bold">
                        {editingScenario ? t('scenarioForm.edit') : t('scenarioForm.add')}
                    </h5>
                </div>
                
                <div className="p-4">
                    <div className="space-y-4">
                        <div>
                            <label className="form-label">{t('scenarioForm.nameLabel')}</label>
                            <Input
                                placeholder={t('scenarioForm.namePlaceholder')}
                                value={scenarioForm.name}
                                onChange={(e) => setScenarioForm(prev => ({ ...prev, name: e.target.value }))}
                            />
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="default"
                            onClick={() => setShowScenarioModal(false)}
                        >
                            {t('scenarioForm.cancel')}
                        </Button>
                        <Button
                            type="button"
                            variant="solid"
                            onClick={handleSaveScenario}
                        >
                            {editingScenario ? t('scenarioForm.update') : t('scenarioForm.save')}
                        </Button>
                    </div>
                </div>
            </Dialog>

            {/* Action Modal */}
            <Dialog
                isOpen={showActionModal}
                onClose={() => setShowActionModal(false)}
                onRequestClose={() => setShowActionModal(false)}
                width={500}
                className="z-[60]"
            >
                <div className="p-4 border-b border-gray-200 dark:border-gray-600">
                    <h5 className="font-bold">
                        {editingAction ? t('actionForm.edit') : t('actionForm.add')}
                    </h5>
                </div>
                
                <div className="p-4">
                    <div className="space-y-4">
                        <div>
                            <label className="form-label">{t('actionForm.nameLabel')}</label>
                            <Input
                                placeholder={t('actionForm.namePlaceholder')}
                                value={actionForm.name}
                                onChange={(e) => setActionForm(prev => ({ ...prev, name: e.target.value }))}
                            />
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="default"
                            onClick={() => setShowActionModal(false)}
                        >
                            {t('actionForm.cancel')}
                        </Button>
                        <Button
                            type="button"
                            variant="solid"
                            onClick={handleSaveAction}
                        >
                            {editingAction ? t('actionForm.update') : t('actionForm.save')}
                        </Button>
                    </div>
                </div>
            </Dialog>

            {/* Action List Modal */}
            <ActionListModal
                isOpen={showActionListModal}
                onClose={() => setShowActionListModal(false)}
                onSelectAction={handleSelectActionFromList}
                selectedScenario={selectedScenario}
            />

            {/* Action Config Modal */}
            <ActionConfigModal
                isOpen={showActionConfigModal}
                onClose={() => {
                    setShowActionConfigModal(false)
                    setConfiguringAction(null)
                }}
                action={configuringAction}
                onSave={handleActionConfigSave}
            />

            {/* Video Interaction Modal */}
            <VideoInteractionModal
                isOpen={showVideoInteractionModal}
                onClose={() => {
                    setShowVideoInteractionModal(false)
                    setConfiguringAction(null)
                }}
                action={configuringAction}
                onSave={handleVideoInteractionSave}
            />

            {/* Specific Video Interaction Modal */}
            <SpecificVideoInteractionModal
                isOpen={showSpecificVideoInteractionModal}
                onClose={() => {
                    setShowSpecificVideoInteractionModal(false)
                    setConfiguringAction(null)
                }}
                action={configuringAction}
                onSave={handleSpecificVideoInteractionSave}
            />

            {/* Keyword Video Interaction Modal */}
            <KeywordVideoInteractionModal
                isOpen={showKeywordVideoInteractionModal}
                onClose={() => {
                    setShowKeywordVideoInteractionModal(false)
                    setConfiguringAction(null)
                }}
                action={configuringAction}
                onSave={handleKeywordVideoInteractionSave}
            />

            {/* User Video Interaction Modal */}
            <UserVideoInteractionModal
                isOpen={showUserVideoInteractionModal}
                onClose={() => {
                    setShowUserVideoInteractionModal(false)
                    setConfiguringAction(null)
                }}
                action={configuringAction}
                onSave={handleUserVideoInteractionSave}
            />

            {/* Random Live Interaction Modal */}
            <RandomLiveInteractionModal
                isOpen={showRandomLiveInteractionModal}
                onClose={() => {
                    setShowRandomLiveInteractionModal(false)
                    setConfiguringAction(null)
                }}
                action={configuringAction}
                onSave={handleRandomLiveInteractionSave}
            />

            {/* Specific Live Interaction Modal */}
            <SpecificLiveInteractionModal
                isOpen={showSpecificLiveInteractionModal}
                onClose={() => {
                    setShowSpecificLiveInteractionModal(false)
                    setConfiguringAction(null)
                }}
                action={configuringAction}
                onSave={handleSpecificLiveInteractionSave}
            />

            {/* Delete Scenario Confirmation Dialog */}
            <Dialog
                isOpen={showDeleteScenarioDialog}
                onClose={() => setShowDeleteScenarioDialog(false)}
                onRequestClose={() => setShowDeleteScenarioDialog(false)}
                width={400}
                className="z-[70]"
            >
                <div className="p-4 border-b border-gray-200 dark:border-gray-600">
                    <h5 className="font-bold text-red-600">{t('deleteDialog.scenarioTitle')}</h5>
                </div>
                
                <div className="p-4">
                    <p className="text-gray-700 dark:text-gray-300">
                        {t('deleteDialog.scenarioContent')} <strong>"{deletingScenario?.name}"</strong>?
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        {t('deleteDialog.scenarioWarning')}
                    </p>
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="default"
                            onClick={() => setShowDeleteScenarioDialog(false)}
                        >
                            {t('deleteDialog.cancel')}
                        </Button>
                        <Button
                            type="button"
                            variant="solid"
                            className="bg-red-500 hover:bg-red-600"
                            onClick={confirmDeleteScenario}
                        >
                            {t('deleteDialog.deleteScenario')}
                        </Button>
                    </div>
                </div>
            </Dialog>

            {/* Delete Action Confirmation Dialog */}
            <Dialog
                isOpen={showDeleteActionDialog}
                onClose={() => setShowDeleteActionDialog(false)}
                onRequestClose={() => setShowDeleteActionDialog(false)}
                width={400}
                className="z-[70]"
            >
                <div className="p-4 border-b border-gray-200 dark:border-gray-600">
                    <h5 className="font-bold text-red-600">{t('deleteDialog.actionTitle')}</h5>
                </div>
                
                <div className="p-4">
                    <p className="text-gray-700 dark:text-gray-300">
                        {t('deleteDialog.actionContent')} <strong>"{deletingAction?.name}"</strong>?
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        {t('deleteDialog.actionWarning')}
                    </p>
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="default"
                            onClick={() => setShowDeleteActionDialog(false)}
                        >
                            {t('deleteDialog.cancel')}
                        </Button>
                        <Button
                            type="button"
                            variant="solid"
                            className="bg-red-500 hover:bg-red-600"
                            onClick={confirmDeleteAction}
                        >
                            {t('deleteDialog.deleteAction')}
                        </Button>
                    </div>
                </div>
            </Dialog>
        </Dialog>
    )
}

export default InteractionConfigModal
