'use client'

import UserListSearch from './UserListSearch'
import ColumnSelector from './ColumnSelector'
import UserTableFilter from './UserTableFilter'
import useAppendQueryParams from '@/utils/hooks/useAppendQueryParams'
import { useUserListStore } from '../_store/userListStore'
import Button from '@/components/ui/Button'
import { TbTrash, TbLock, TbX } from 'react-icons/tb'
import Dialog from '@/components/ui/Dialog'
import { useState } from 'react'
import deleteUsers from '@/server/actions/deleteUsers'
import blockUsers from '@/server/actions/blockUsers'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { useRouter } from 'next/navigation'

const UserListBulkActionTools = () => {
    const router = useRouter()
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
    const [showBlockConfirmation, setShowBlockConfirmation] = useState(false)

    const selectedUser = useUserListStore((state) => state.selectedUser)
    const setSelectAllUser = useUserListStore((state) => state.setSelectAllUser)

    const onBulkDelete = () => {
        setShowDeleteConfirmation(true)
    }

    const onBulkBlock = () => {
        setShowBlockConfirmation(true)
    }

    const onClearSelection = () => {
        setSelectAllUser([])
    }

    const handleDeleteConfirm = async () => {
        const userIds = selectedUser.map((user) => user.id)
        const result = await deleteUsers(userIds)

        if (result.success) {
            toast.push(
                <Notification title="Success" type="success" closable>
                    {result.message}
                </Notification>
            )
            setSelectAllUser([])
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

    const handleBlockConfirm = async () => {
        const userIds = selectedUser.map((user) => user.id)
        const result = await blockUsers(userIds)
        if (result.success) {
            toast.push(
                <Notification title="Success" type="success" closable>
                    {result.message}
                </Notification>
            )
            setSelectAllUser([])
            router.refresh()
        } else {
            toast.push(
                <Notification title="Error" type="danger" closable>
                    {result.message}
                </Notification>
            )
        }
        setShowBlockConfirmation(false)
    }

    return (
        <>
            <div className="flex flex-col items-start md:flex-row md:items-center gap-3">
                <span className="font-semibold leading-9">
                    {selectedUser.length} user selected
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
                    variant="solid"
                    className="bg-amber-500 hover:bg-amber-400"
                    icon={<TbLock />}
                    onClick={onBulkBlock}
                >
                    Block
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
                    Are you sure you want to delete {selectedUser.length}{' '}
                    selected user(s)? This action cannot be undone.
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
            <Dialog
                isOpen={showBlockConfirmation}
                onClose={() => setShowBlockConfirmation(false)}
                onRequestClose={() => setShowBlockConfirmation(false)}
            >
                <h5 className="mb-4">Block Confirmation</h5>
                <p>
                    Are you sure you want to block {selectedUser.length} selected
                    user(s)?
                </p>
                <div className="text-right mt-6">
                    <Button
                        className="ltr:mr-2 rtl:ml-2"
                        onClick={() => setShowBlockConfirmation(false)}
                    >
                        Cancel
                    </Button>
                    <Button variant="solid" onClick={handleBlockConfirm}>
                        Block
                    </Button>
                </div>
            </Dialog>
        </>
    )
}

const UsersListTableTools = ({ columns, selectableColumns, onColumnToggle }) => {
    const { onAppendQueryParams } = useAppendQueryParams()
    const selectedUser = useUserListStore((state) => state.selectedUser)

    const handleInputChange = (query) => {
        onAppendQueryParams({
            query,
        })
    }

    if (selectedUser.length > 0) {
        return <UserListBulkActionTools />
    }

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <UserListSearch onInputChange={handleInputChange} />
            <div className="flex items-center gap-2">
                <UserTableFilter />
                <ColumnSelector
                    columns={columns}
                    selectableColumns={selectableColumns}
                    onColumnToggle={onColumnToggle}
                />
            </div>
        </div>
    )
}

export default UsersListTableTools
