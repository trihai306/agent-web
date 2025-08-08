'use client'
import { useState } from 'react'
import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import DeviceListProvider from './_components/DeviceListProvider'
import DeviceListTable from './_components/DeviceListTable'

import DashboardHeader from './_components/DashboardHeader'
import QuickActions from './_components/QuickActions'

import { useDeviceListStore } from './_store/deviceListStore'
import updateDeviceStatus from '@/server/actions/device/updateDeviceStatus'
import { useTranslations } from 'next-intl'

const DeviceManagementClient = ({ data, params }) => {
    const t = useTranslations('deviceManagement')
    const [isLoading, setIsLoading] = useState(false)
    
    // Get selected devices from store
    const selectedDevices = useDeviceListStore((state) => state.selectedDevice)

    const handleRefresh = async () => {
        setIsLoading(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        setIsLoading(false)
        // In real implementation, you would refresh the data here
        window.location.reload()
    }

    const handleSettings = () => {
        console.log('Open device settings')
        // TODO: Implement device settings functionality
    }

    const handleQuickAction = async (actionType) => {
        if (selectedDevices.length === 0) {
            console.warn('No devices selected')
            return
        }

        console.log(`Performing ${actionType} on devices:`, selectedDevices)
        setIsLoading(true)
        
        try {
            const deviceIds = selectedDevices.map(device => device.id)
            
            switch (actionType) {
                case 'activate':
                    // Kích hoạt - set status to active
                    const activateResult = await updateDeviceStatus(deviceIds, 'active')
                    if (activateResult.success) {
                        console.log('Activated devices successfully')
                        handleRefresh()
                    } else {
                        console.error('Failed to activate devices:', activateResult.message)
                    }
                    break
                    
                case 'pause':
                    // Tạm dừng - set status to inactive
                    const pauseResult = await updateDeviceStatus(deviceIds, 'inactive')
                    if (pauseResult.success) {
                        console.log('Paused devices successfully')
                        handleRefresh()
                    } else {
                        console.error('Failed to pause devices:', pauseResult.message)
                    }
                    break
                    
                case 'block':
                    // Chặn - set status to blocked
                    const blockResult = await updateDeviceStatus(deviceIds, 'blocked')
                    if (blockResult.success) {
                        console.log('Blocked devices successfully')
                        handleRefresh()
                    } else {
                        console.error('Failed to block devices:', blockResult.message)
                    }
                    break
                    
                default:
                    console.warn('Unknown action type:', actionType)
            }
        } catch (error) {
            console.error('Error performing quick action:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <DeviceListProvider deviceList={data?.list || []}>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                {/* Dashboard Header */}
                <DashboardHeader
                    title={t('title')}
                    subtitle={t('subtitle')}
                    onRefresh={handleRefresh}
                    onSettings={handleSettings}
                />

                <Container className="py-6">
                    <div className="space-y-6">
                        {/* Main Content Grid */}
                        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                            {/* Device Management Table - Takes 3 columns */}
                            <div className="xl:col-span-3">
                                <AdaptiveCard className="overflow-hidden">
                                    <div className="p-6">
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                                            <div>
                                                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                                    {t('deviceList')}
                                                </h2>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                    {t('deviceListDesc', { count: data?.total || 0 })}
                                                </p>
                                            </div>

                                        </div>
                                        
                                        <DeviceListTable
                                            deviceListTotal={data?.total || 0}
                                            page={parseInt(params.page) || 1}
                                            per_page={parseInt(params.per_page) || 10}
                                        />
                                    </div>
                                </AdaptiveCard>
                            </div>

                            {/* Quick Actions Sidebar - Takes 1 column */}
                            <div className="xl:col-span-1">
                                <QuickActions 
                                    selectedDevices={selectedDevices}
                                    onAction={handleQuickAction}
                                    loading={isLoading}
                                />
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        </DeviceListProvider>
    )
}

export default DeviceManagementClient
