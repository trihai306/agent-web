'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Tooltip from '@/components/ui/Tooltip'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { useDeviceListStore } from '../_store/deviceListStore'
import ColumnSelector from './ColumnSelector'
import DeviceListSearch from './DeviceListSearch'
import DeviceTableFilter from './DeviceTableFilter'
import deleteDevices from '@/server/actions/device/deleteDevices'
import updateDeviceStatus from '@/server/actions/device/updateDeviceStatus'
import useAppendQueryParams from '@/utils/hooks/useAppendQueryParams'
import {
    HiOutlineTrash as Trash,
    HiOutlinePause as Pause,
    HiOutlineX as X
} from 'react-icons/hi'
import { useTranslations } from 'next-intl'

// Bulk Action Tools Component
const DeviceListBulkActionTools = () => {
    const router = useRouter()
    const t = useTranslations('deviceManagement')
    const { selectedDevice, clearSelectedDevice, setDeleting, setUpdating } = useDeviceListStore()
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [showSuspendConfirm, setShowSuspendConfirm] = useState(false)

    const selectedCount = selectedDevice.length

    const onBulkDelete = () => {
        setShowDeleteConfirm(true)
    }

    const onBulkSuspend = () => {
        setShowSuspendConfirm(true)
    }

    const onClearSelection = () => {
        clearSelectedDevice()
    }

    const handleDeleteConfirm = async () => {
        setDeleting(true)
        try {
            const deviceIds = selectedDevice.map(device => device.id)
            const result = await deleteDevices(deviceIds)
            
            if (result.success) {
                console.log('Devices deleted successfully')
                clearSelectedDevice()
                router.refresh()
            } else {
                console.error('Failed to delete devices:', result.message)
            }
        } catch (error) {
            console.error('Error deleting devices:', error)
        } finally {
            setDeleting(false)
            setShowDeleteConfirm(false)
        }
    }

    const handleSuspendConfirm = async () => {
        setUpdating(true)
        try {
            const deviceIds = selectedDevice.map(device => device.id)
            const result = await updateDeviceStatus(deviceIds, 'inactive')
            
            if (result.success) {
                console.log('Devices suspended successfully')
                clearSelectedDevice()
                router.refresh()
            } else {
                console.error('Failed to suspend devices:', result.message)
            }
        } catch (error) {
            console.error('Error suspending devices:', error)
        } finally {
            setUpdating(false)
            setShowSuspendConfirm(false)
        }
    }

    if (selectedCount === 0) {
        return null
    }

    return (
        <>
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    {selectedCount} {t('devicesSelected')}
                </span>
                
                <div className="flex items-center gap-1 ml-auto">
                    <Tooltip title={t('pause')}>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onBulkSuspend}
                            className="text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/20"
                        >
                            <Pause className="w-4 h-4" />
                        </Button>
                    </Tooltip>
                    
                    <Tooltip title={t('delete')}>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onBulkDelete}
                            className="text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20"
                        >
                            <Trash className="w-4 h-4" />
                        </Button>
                    </Tooltip>
                    
                    <Tooltip title={t('clearSelection')}>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClearSelection}
                            className="text-gray-600 dark:text-gray-400"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </Tooltip>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={handleDeleteConfirm}
                title={t('confirmDelete')}
                children={
                    <p>
                        {t('confirmDeleteMessage', { count: selectedCount })}
                    </p>
                }
                confirmButtonColor="red-600"
            />

            {/* Suspend Confirmation Dialog */}
            <ConfirmDialog
                isOpen={showSuspendConfirm}
                onClose={() => setShowSuspendConfirm(false)}
                onConfirm={handleSuspendConfirm}
                title={t('confirmSuspend')}
                children={
                    <p>
                        {t('confirmSuspendMessage', { count: selectedCount })}
                    </p>
                }
                confirmButtonColor="orange-600"
            />
        </>
    )
}

// Main Table Tools Component
const DeviceListTableTools = ({ columns, selectableColumns, onColumnToggle }) => {
    const searchInputRef = useRef()
    const { onAppendQueryParams } = useAppendQueryParams()

    const handleInputChange = (query) => {
        onAppendQueryParams({ search: query })
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Bulk Actions */}
            <DeviceListBulkActionTools />
            
            {/* Search and Filter Tools */}
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                {/* Search */}
                <div className="flex-1 max-w-md">
                    <DeviceListSearch
                        ref={searchInputRef}
                        onInputChange={handleInputChange}
                    />
                </div>
                
                {/* Filter and Column Selector */}
                <div className="flex items-center gap-2">
                    <DeviceTableFilter />
                    <ColumnSelector
                        columns={columns}
                        selectableColumns={selectableColumns}
                        onColumnToggle={onColumnToggle}
                    />
                </div>
            </div>
        </div>
    )
}

export default DeviceListTableTools