'use client'
import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Dialog from '@/components/ui/Dialog'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import Select from '@/components/ui/Select'
import { useTranslations } from 'next-intl'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import importTiktokAccounts from '@/server/actions/tiktok-account/importTiktokAccounts'
import getDevices from '@/server/actions/device/getDevices'
import getInteractionScenarios from '@/server/actions/interaction-scenario/getInteractionScenarios'

const ImportAccountsModal = ({ isOpen, onClose, onSuccess }) => {
    const t = useTranslations('tiktokAccountManagement.importModal')
    const [accountCount, setAccountCount] = useState(0)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [devices, setDevices] = useState([])
    const [scenarios, setScenarios] = useState([])
    const [isLoadingData, setIsLoadingData] = useState(true)
    const [menuPortalTarget, setMenuPortalTarget] = useState(null)
    const [deviceMenuOpen, setDeviceMenuOpen] = useState(false)
    const [scenarioMenuOpen, setScenarioMenuOpen] = useState(false)

    useEffect(() => {
        setMenuPortalTarget(document.body)
    }, [])

    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoadingData(true)
                const [devicesResponse, scenariosResponse] = await Promise.all([
                    getDevices(),
                    getInteractionScenarios()
                ])

                if (devicesResponse.success) {
                    setDevices(devicesResponse.data.data || [])
                }

                if (scenariosResponse.success) {
                    setScenarios(scenariosResponse.data.data || [])
                }
            } catch (error) {
                console.error('Error loading data:', error)
                toast.push(
                    <Notification title="Lỗi" type="danger">
                        Không thể tải dữ liệu thiết bị và kịch bản
                    </Notification>
                )
            } finally {
                setIsLoadingData(false)
            }
        }

        if (isOpen) {
            loadData()
        }
    }, [isOpen])
    
    // Form state
    const [formData, setFormData] = useState({
        accountList: '',
        enableRunningStatus: true,
        autoAssign: false,
        deviceId: '',
        scenarioId: '',
    })

    // Đếm số tài khoản khi người dùng nhập
    const handleAccountListChange = (value) => {
        const lines = value.split('\n').filter(line => line.trim() !== '')
        setAccountCount(lines.length)
        setFormData(prev => ({ ...prev, accountList: value }))
    }

    const handleInputChange = (field, value) => {
        // Convert deviceId và scenarioId thành string
        if (field === 'deviceId' || field === 'scenarioId') {
            value = value ? String(value) : ''
        }
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleCheckboxChange = (field, checked) => {
        setFormData(prev => ({ ...prev, [field]: checked }))
    }

    const onSubmit = async () => {
        if (!formData.accountList.trim()) {
            toast.push(
                <Notification title="Lỗi" type="danger" closable>
                    Danh sách tài khoản không được để trống
                </Notification>
            )
            return
        }

        setIsSubmitting(true)
        try {
            const result = await importTiktokAccounts(formData)
            
            if (result.success) {
                toast.push(
                    <Notification title="Thành công" type="success" closable>
                        {result.message}
                    </Notification>
                )
                
                handleClose()
                if (onSuccess) {
                    onSuccess()
                }
            } else {
                toast.push(
                    <Notification title="Lỗi" type="danger" closable>
                        {result.message}
                    </Notification>
                )
            }
        } catch (error) {
            console.error('Error submitting import form:', error)
            toast.push(
                <Notification title="Lỗi" type="danger" closable>
                    Có lỗi xảy ra khi nhập tài khoản
                </Notification>
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleClose = () => {
        setFormData({
            accountList: '',
            enableRunningStatus: true,
            autoAssign: false,
            deviceId: '',
            scenarioId: '',
        })
        setAccountCount(0)
        onClose()
    }

    const handleRedo = () => {
        setFormData({
            accountList: '',
            enableRunningStatus: true,
            autoAssign: false,
            deviceId: '',
            scenarioId: '',
        })
        setAccountCount(0)
    }

    return (
        <Dialog
            isOpen={isOpen}
            onClose={handleClose}
            onRequestClose={handleClose}
            width={800}
            className="z-50"
        >
            <div className="flex flex-col h-full relative">
                <div className="p-4 border-b border-gray-200 dark:border-gray-600">
                    <h5 className="font-bold">{t('title')}</h5>
                </div>
                
                <div className="p-4 flex-1 overflow-y-auto relative">
                    <div className="space-y-6">
                        {/* Danh sách tài khoản */}
                        <div>
                            <label className="form-label">
                                {t('accountListLabel', { count: accountCount })}
                            </label>
                            <Input
                                textArea
                                placeholder={t('accountListPlaceholder')}
                                rows={8}
                                value={formData.accountList}
                                onChange={(e) => handleAccountListChange(e.target.value)}
                            />
                        </div>

                        {/* Định dạng nhập */}
                        <div>
                            <label className="form-label">{t('formatLabel')}</label>
                            <Input
                                value={t('formatValue')}
                                readOnly
                                className="bg-gray-50 dark:bg-gray-800"
                            />
                        </div>

                        {/* Checkboxes */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Checkbox
                                    checked={formData.enableRunningStatus}
                                    onChange={(checked) => handleCheckboxChange('enableRunningStatus', checked)}
                                >
                                    {t('enableRunningStatus')}
                                </Checkbox>
                            </div>
                            
                            <div>
                                <Checkbox
                                    checked={formData.autoAssign}
                                    onChange={(checked) => handleCheckboxChange('autoAssign', checked)}
                                >
                                    {t('autoAssign')}
                                </Checkbox>
                            </div>
                        </div>

                        {/* Dropdowns */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
                            <div>
                                <label className="form-label">{t('selectDevice')}</label>
                                <div className="relative">
                                    <Select
                                        placeholder={isLoadingData ? "Đang tải..." : t('selectDevicePlaceholder')}
                                        value={formData.deviceId ? { value: formData.deviceId, label: (Array.isArray(devices) ? devices.find(d => d.id == formData.deviceId)?.device_name : '') || '' } : null}
                                        onChange={(option) => handleInputChange('deviceId', option?.value || '')}
                                        options={(Array.isArray(devices) ? devices : []).map(device => ({
                                            value: device.id,
                                            label: device.device_name
                                        }))}
                                        isDisabled={isLoadingData}
                                        menuIsOpen={deviceMenuOpen}
                                        onMenuOpen={() => setDeviceMenuOpen(true)}
                                        onMenuClose={() => setDeviceMenuOpen(false)}
                                        menuPortalTarget={menuPortalTarget}
                                        menuPosition="fixed"
                                        menuPlacement="auto"
                                        menuShouldBlockScroll={true}
                                        menuShouldScrollIntoView={true}
                                        styles={{
                                            menuPortal: (base) => ({
                                                ...base,
                                                zIndex: 9999
                                            }),
                                            menu: (base) => ({
                                                ...base,
                                                zIndex: 9999
                                            })
                                        }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="form-label">{t('selectScenario')}</label>
                                <div className="relative">
                                    <Select
                                        placeholder={isLoadingData ? "Đang tải..." : t('selectScenarioPlaceholder')}
                                        value={formData.scenarioId ? { value: formData.scenarioId, label: (Array.isArray(scenarios) ? scenarios.find(s => s.id == formData.scenarioId)?.name : '') || '' } : null}
                                        onChange={(option) => handleInputChange('scenarioId', option?.value || '')}
                                        options={(Array.isArray(scenarios) ? scenarios : []).map(scenario => ({
                                            value: scenario.id,
                                            label: scenario.name
                                        }))}
                                        isDisabled={isLoadingData}
                                        menuIsOpen={scenarioMenuOpen}
                                        onMenuOpen={() => setScenarioMenuOpen(true)}
                                        onMenuClose={() => setScenarioMenuOpen(false)}
                                        menuPortalTarget={menuPortalTarget}
                                        menuPosition="fixed"
                                        menuPlacement="auto"
                                        menuShouldBlockScroll={true}
                                        menuShouldScrollIntoView={true}
                                        styles={{
                                            menuPortal: (base) => ({
                                                ...base,
                                                zIndex: 9999
                                            }),
                                            menu: (base) => ({
                                                ...base,
                                                zIndex: 9999
                                            })
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="default"
                            onClick={handleRedo}
                        >
                            {t('redo')}
                        </Button>
                        <Button
                            type="button"
                            variant="default"
                            onClick={handleClose}
                        >
                            {t('exit')}
                        </Button>
                        <Button
                            type="button"
                            variant="solid"
                            loading={isSubmitting}
                            onClick={onSubmit}
                        >
                            {isSubmitting ? t('saving') : t('save')}
                        </Button>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}

export default ImportAccountsModal 