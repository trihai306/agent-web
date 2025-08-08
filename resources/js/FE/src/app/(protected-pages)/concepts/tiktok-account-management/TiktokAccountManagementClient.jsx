'use client'
import { useState } from 'react'
import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import TiktokAccountListProvider from './_components/TiktokAccountListProvider'
import TiktokAccountListTable from './_components/TiktokAccountListTable'
import TiktokAccountListActionTools from './_components/TiktokAccountListActionTools'
import DashboardHeader from './_components/DashboardHeader'
import QuickActions from './_components/QuickActions'
import InteractionConfigModal from './_components/InteractionConfigModal'
import { DashboardStats } from './_components/stats'
import { useTiktokAccountListStore } from './_store/tiktokAccountListStore'
import updateTiktokAccountStatus from '@/server/actions/tiktok-account/updateTiktokAccountStatus'
import deleteTiktokAccounts from '@/server/actions/tiktok-account/deleteTiktokAccounts'
import { useTranslations } from 'next-intl'

const TiktokAccountManagementClient = ({ data, params }) => {
    const t = useTranslations('tiktokAccountManagement')
    const [isLoading, setIsLoading] = useState(false)
    const [showInteractionConfigModal, setShowInteractionConfigModal] = useState(false)
    
    // Get selected accounts from store
    const selectedAccounts = useTiktokAccountListStore((state) => state.selectedTiktokAccount)

    const handleRefresh = async () => {
        setIsLoading(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        setIsLoading(false)
    }

    const handleSettings = () => {
        // Open interaction config modal
        setShowInteractionConfigModal(true)
    }

    const handleQuickAction = async (actionType) => {
        if (selectedAccounts.length === 0) {
            console.warn('No accounts selected')
            return
        }

        console.log(`Performing ${actionType} on accounts:`, selectedAccounts)
        setIsLoading(true)
        
        try {
            const accountIds = selectedAccounts.map(account => account.id)
            
            switch (actionType) {
                case 'start':
                    // Bắt đầu - set status to active
                    const startResult = await updateTiktokAccountStatus(accountIds, 'active')
                    if (startResult.success) {
                        console.log('Started accounts successfully')
                        // Refresh data or update store
                        handleRefresh()
                    } else {
                        console.error('Failed to start accounts:', startResult.message)
                    }
                    break
                    
                case 'pause':
                    // Tạm dừng - set status to inactive
                    const pauseResult = await updateTiktokAccountStatus(accountIds, 'inactive')
                    if (pauseResult.success) {
                        console.log('Paused accounts successfully')
                        handleRefresh()
                    } else {
                        console.error('Failed to pause accounts:', pauseResult.message)
                    }
                    break
                    
                case 'stop':
                    // Dừng - set status to suspended
                    const stopResult = await updateTiktokAccountStatus(accountIds, 'suspended')
                    if (stopResult.success) {
                        console.log('Stopped accounts successfully')
                        handleRefresh()
                    } else {
                        console.error('Failed to stop accounts:', stopResult.message)
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
        <TiktokAccountListProvider tiktokAccountList={data?.list || []}>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                {/* Dashboard Header */}
                <DashboardHeader
                    title={t('title')}
                    subtitle="Theo dõi và quản lý tất cả tài khoản TikTok của bạn một cách hiệu quả"
                    onRefresh={handleRefresh}
                    onSettings={handleSettings}
                />

                <Container className="py-6">
                    <div className="space-y-6">
                        {/* Statistics Dashboard */}
                        <DashboardStats loading={isLoading} />

                        {/* Main Content Grid */}
                        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                            {/* Account Management Table - Takes 3 columns */}
                            <div className="xl:col-span-3">
                                <AdaptiveCard className="overflow-hidden">
                                    <div className="p-6">
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                                            <div>
                                                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                                    Danh sách tài khoản
                                                </h2>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                    Quản lý và theo dõi trạng thái của {data?.total || 0} tài khoản
                                                </p>
                                            </div>
                                            <TiktokAccountListActionTools />
                                        </div>
                                        
                                                                <TiktokAccountListTable
                            tiktokAccountListTotal={data?.total || 0}
                            page={parseInt(params.page) || 1}
                            per_page={parseInt(params.per_page) || 10}
                        />
                                    </div>
                                </AdaptiveCard>
                            </div>

                            {/* Quick Actions Sidebar - Takes 1 column */}
                            <div className="xl:col-span-1">
                                <QuickActions 
                                    selectedAccounts={selectedAccounts}
                                    onAction={handleQuickAction}
                                    loading={isLoading}
                                />
                            </div>
                        </div>
                    </div>
                </Container>
            </div>

            {/* Interaction Config Modal */}
            <InteractionConfigModal
                isOpen={showInteractionConfigModal}
                onClose={() => setShowInteractionConfigModal(false)}
            />
        </TiktokAccountListProvider>
    )
}

export default TiktokAccountManagementClient 