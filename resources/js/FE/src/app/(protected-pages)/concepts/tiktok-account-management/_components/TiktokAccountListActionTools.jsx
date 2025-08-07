'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import { TbMessageCircle, TbUpload } from 'react-icons/tb'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import ImportAccountsModal from './ImportAccountsModal'

const TiktokAccountListActionTools = () => {
    const router = useRouter()
    const t = useTranslations('tiktokAccountManagement')
    const [showImportModal, setShowImportModal] = useState(false)
    const handleImportSuccess = () => {
        // Refresh trang sau khi import thành công
        router.refresh()
    }

    return (
        <>
            <div className="flex flex-col md:flex-row gap-3">
                <Button
                    variant="solid"
                    color="green-500"
                    icon={<TbUpload className="text-xl" />}
                    onClick={() => setShowImportModal(true)}
                >
                    {t('importAccounts')}
                </Button>
                <Button
                    variant="solid"
                    color="blue-500"
                    icon={<TbMessageCircle className="text-xl" />}
                    onClick={() =>
                        router.push('/concepts/tiktok-account-management/interaction-config')
                    }
                >
                    {t('configureInteraction')}
                </Button>
            </div>

            <ImportAccountsModal
                isOpen={showImportModal}
                onClose={() => setShowImportModal(false)}
                onSuccess={handleImportSuccess}
            />
        </>
    )
}

export default TiktokAccountListActionTools 