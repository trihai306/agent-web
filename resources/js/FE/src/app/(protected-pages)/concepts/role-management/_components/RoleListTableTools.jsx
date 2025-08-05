'use client'
import RoleListSearch from './RoleListSearch'
import ColumnSelector from './ColumnSelector'
import useAppendQueryParams from '@/utils/hooks/useAppendQueryParams'
import { useRoleListStore } from '../_store/roleListStore'
import Button from '@/components/ui/Button'
import { TbTrash, TbX } from 'react-icons/tb'
import Dialog from '@/components/ui/Dialog'
import { useState } from 'react'
import deleteRoles from '@/server/actions/deleteRoles'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { useRouter } from 'next/navigation'

const RoleListBulkActionTools = () => {
    const router = useRouter()
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
    const selectedRole = useRoleListStore((state) => state.selectedRole)
    const setSelectAllRole = useRoleListStore((state) => state.setSelectAllRole)

    const onBulkDelete = () => setShowDeleteConfirmation(true)
    const onClearSelection = () => setSelectAllRole([])
    const handleDeleteConfirm = async () => {
        const roleIds = selectedRole.map((p) => p.id)
        const result = await deleteRoles(roleIds)

        if (result.success) {
            toast.push(
                <Notification title="Success" type="success" closable>
                    {result.message}
                </Notification>
            )
            setSelectAllRole([])
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
                    {selectedRole.length} role(s) selected
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
                    Are you sure you want to delete {selectedRole.length}{' '}
                    selected role(s)? This action cannot be undone.
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

const RoleListTableTools = ({ columns, selectableColumns, onColumnToggle }) => {
    const { onAppendQueryParams } = useAppendQueryParams()
    const selectedRole = useRoleListStore((state) => state.selectedRole)
    const handleInputChange = (query) => onAppendQueryParams({ search: query, page: '1' })

    if (selectedRole.length > 0) {
        return <RoleListBulkActionTools />
    }

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <RoleListSearch onInputChange={handleInputChange} />
            <div className="flex items-center gap-2">
                <ColumnSelector
                    columns={columns}
                    selectableColumns={selectableColumns}
                    onColumnToggle={onColumnToggle}
                />
            </div>
        </div>
    )
}

export default RoleListTableTools
