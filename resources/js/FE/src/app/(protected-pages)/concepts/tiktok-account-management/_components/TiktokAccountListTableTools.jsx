'use client'

import TiktokAccountListSearch from './TiktokAccountListSearch'
import ColumnSelector from './ColumnSelector'
import TiktokAccountTableFilter from './TiktokAccountTableFilter'
import useAppendQueryParams from '@/utils/hooks/useAppendQueryParams'
import { useTiktokAccountListStore } from '../_store/tiktokAccountListStore'
import Button from '@/components/ui/Button'
import { TbTrash, TbLock, TbX } from 'react-icons/tb'
import Dialog from '@/components/ui/Dialog'
import { useState } from 'react'
import deleteTiktokAccounts from '@/server/actions/tiktok-account/deleteTiktokAccounts'
import updateTiktokAccountStatus from '@/server/actions/tiktok-account/updateTiktokAccountStatus'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

const TiktokAccountListBulkActionTools = () => {
    const router = useRouter()
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
    const [showSuspendConfirmation, setShowSuspendConfirmation] = useState(false)
    const t = useTranslations('tiktokAccountManagement.bulkAction')
    const tDelete = useTranslations('tiktokAccountManagement.bulkDeleteConfirm')
    const tSuspend = useTranslations('tiktokAccountManagement.bulkSuspendConfirm')

    const selectedTiktokAccount = useTiktokAccountListStore((state) => state.selectedTiktokAccount)
    const setSelectAllTiktokAccount = useTiktokAccountListStore((state) => state.setSelectAllTiktokAccount)

    const onBulkDelete = () => {
        setShowDeleteConfirmation(true)
    }

    const onBulkSuspend = () => {
        setShowSuspendConfirmation(true)
    }

    const onClearSelection = () => {
        setSelectAllTiktokAccount([])
    }

    const handleDeleteConfirm = async () => {
        const tiktokAccountIds = selectedTiktokAccount.map((tiktokAccount) => tiktokAccount.id)
        const result = await deleteTiktokAccounts(tiktokAccountIds)

        if (result.success) {
            toast.push(
                <Notification title="Success" type="success" closable>
                    {result.message}
                </Notification>
            )
            setSelectAllTiktokAccount([])
            router.refresh()
        } else {
            toast.push(
                <Notification title="Error" type="danger" closable>
                    {result.message}
                </Notification>
            )
        }
        setShowDeleteConfirmation(false)
    }

    const handleSuspendConfirm = async () => {
        const tiktokAccountIds = selectedTiktokAccount.map((tiktokAccount) => tiktokAccount.id)
        const result = await updateTiktokAccountStatus(tiktokAccountIds, 'suspended')
        if (result.success) {
            toast.push(
                <Notification title="Success" type="success" closable>
                    {result.message}
                </Notification>
            )
            setSelectAllTiktokAccount([])
            router.refresh()
        } else {
            toast.push(
                <Notification title="Error" type="danger" closable>
                    {result.message}
                </Notification>
            )
        }
        setShowSuspendConfirmation(false)
    }

    return (
        <>
            <div className="flex flex-col items-start md:flex-row md:items-center gap-3">
                <span className="font-semibold leading-9">
                    {t('selected', { count: selectedTiktokAccount.length })}
                </span>
                <Button
                    size="sm"
                    variant="solid"
                    className="bg-red-500 hover:bg-red-400"
                    icon={<TbTrash />}
                    onClick={onBulkDelete}
                >
                    {t('delete')}
                </Button>
                <Button
                    size="sm"
                    variant="solid"
                    className="bg-amber-500 hover:bg-amber-400"
                    icon={<TbLock />}
                    onClick={onBulkSuspend}
                >
                    {t('suspend')}
                </Button>
                <Button
                    size="sm"
                    variant="default"
                    icon={<TbX />}
                    onClick={onClearSelection}
                >
                    {t('clear')}
                </Button>
            </div>
            <Dialog
                isOpen={showDeleteConfirmation}
                onClose={() => setShowDeleteConfirmation(false)}
                onRequestClose={() => setShowDeleteConfirmation(false)}
            >
                <h5 className="mb-4">{tDelete('title')}</h5>
                <p>
                    {tDelete('content', { count: selectedTiktokAccount.length })}
                </p>
                <div className="text-right mt-6">
                    <Button
                        className="ltr:mr-2 rtl:ml-2"
                        onClick={() => setShowDeleteConfirmation(false)}
                    >
                        {tDelete('cancel')}
                    </Button>
                    <Button
                        variant="solid"
                        color="red-600"
                        onClick={handleDeleteConfirm}
                    >
                        {tDelete('delete')}
                    </Button>
                </div>
            </Dialog>
            <Dialog
                isOpen={showSuspendConfirmation}
                onClose={() => setShowSuspendConfirmation(false)}
                onRequestClose={() => setShowSuspendConfirmation(false)}
            >
                <h5 className="mb-4">{tSuspend('title')}</h5>
                <p>
                    {tSuspend('content', { count: selectedTiktokAccount.length })}
                </p>
                <div className="text-right mt-6">
                    <Button
                        className="ltr:mr-2 rtl:ml-2"
                        onClick={() => setShowSuspendConfirmation(false)}
                    >
                        {tSuspend('cancel')}
                    </Button>
                    <Button variant="solid" onClick={handleSuspendConfirm}>
                        {tSuspend('suspend')}
                    </Button>
                </div>
            </Dialog>
        </>
    )
}

const TiktokAccountListTableTools = ({ columns, selectableColumns, onColumnToggle }) => {
    const { onAppendQueryParams } = useAppendQueryParams()
    const selectedTiktokAccount = useTiktokAccountListStore((state) => state.selectedTiktokAccount)

    const handleInputChange = (query) => {
        onAppendQueryParams({
            search: query,
        })
    }

    if (selectedTiktokAccount.length > 0) {
        return <TiktokAccountListBulkActionTools />
    }

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <TiktokAccountListSearch onInputChange={handleInputChange} />
            <div className="flex items-center gap-2">
                <TiktokAccountTableFilter />
                <ColumnSelector
                    columns={columns}
                    selectableColumns={selectableColumns}
                    onColumnToggle={onColumnToggle}
                />
            </div>
        </div>
    )
}

export default TiktokAccountListTableTools 