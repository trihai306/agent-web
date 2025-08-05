'use client'

import TransactionListSearch from './TransactionListSearch'
import TransactionTableFilter from './TransactionTableFilter'
import useAppendQueryParams from '@/utils/hooks/useAppendQueryParams'
import { useTransactionListStore } from '../_store/transactionListStore'
import Button from '@/components/ui/Button'
import { TbTrash, TbX } from 'react-icons/tb'
import Dialog from '@/components/ui/Dialog'
import { useState } from 'react'
import deleteTransactions from '@/server/actions/deleteTransactions'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { useRouter } from 'next/navigation'

const TransactionListBulkActionTools = () => {
    const router = useRouter()
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)

    const selectedTransaction = useTransactionListStore((state) => state.selectedTransaction)
    const setSelectAllTransaction = useTransactionListStore((state) => state.setSelectAllTransaction)

    const onBulkDelete = () => {
        setShowDeleteConfirmation(true)
    }

    const onClearSelection = () => {
        setSelectAllTransaction([])
    }

    const handleDeleteConfirm = async () => {
        const transactionIds = selectedTransaction.map((transaction) => transaction.id)
        const result = await deleteTransactions(transactionIds)

        if (result.success) {
            toast.push(
                <Notification title="Success" type="success" closable>
                    {result.message}
                </Notification>
            )
            setSelectAllTransaction([])
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

    return (
        <>
            <div className="flex flex-col items-start md:flex-row md:items-center gap-3">
                <span className="font-semibold leading-9">
                    {selectedTransaction.length} transaction(s) selected
                </span>
                <Button
                    size="sm"
                    variant="solid"
                    className="bg-red-500 hover:bg-red-400"
                    icon={<TbTrash />}
                    onClick={onBulkDelete}
                >
                    Delete
                </Button>
                <Button
                    size="sm"
                    variant="default"
                    icon={<TbX />}
                    onClick={onClearSelection}
                >
                    Clear
                </Button>
            </div>
            <Dialog
                isOpen={showDeleteConfirmation}
                onClose={() => setShowDeleteConfirmation(false)}
                onRequestClose={() => setShowDeleteConfirmation(false)}
            >
                <h5 className="mb-4">Delete Confirmation</h5>
                <p>
                    Are you sure you want to delete {selectedTransaction.length}{' '}
                    selected transaction(s)? This action cannot be undone.
                </p>
                <div className="text-right mt-6">
                    <Button
                        className="ltr:mr-2 rtl:ml-2"
                        onClick={() => setShowDeleteConfirmation(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="solid"
                        color="red-600"
                        onClick={handleDeleteConfirm}
                    >
                        Delete
                    </Button>
                </div>
            </Dialog>
        </>
    )
}

const TransactionsListTableTools = () => {
    const { onAppendQueryParams } = useAppendQueryParams()
    const selectedTransaction = useTransactionListStore((state) => state.selectedTransaction)

    const handleInputChange = (query) => {
        onAppendQueryParams({
            search: query,
        })
    }

    if (selectedTransaction.length > 0) {
        return <TransactionListBulkActionTools />
    }

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <TransactionListSearch onInputChange={handleInputChange} />
            <div className="flex items-center gap-2">
                <TransactionTableFilter />
            </div>
        </div>
    )
}

export default TransactionsListTableTools
