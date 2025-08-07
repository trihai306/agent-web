'use client'
import { useMemo, useState } from 'react'
import Avatar from '@/components/ui/Avatar'
import Tag from '@/components/ui/Tag'
import Tooltip from '@/components/ui/Tooltip'
import DataTable from '@/components/shared/DataTable'
import { useTiktokAccountListStore } from '../_store/tiktokAccountListStore'
import useAppendQueryParams from '@/utils/hooks/useAppendQueryParams'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import { TbEye } from 'react-icons/tb'
import TiktokAccountListTableTools from './TiktokAccountListTableTools'
import dayjs from 'dayjs'
import Dialog from '@/components/ui/Dialog'
import TiktokAccountDetail from './TiktokAccountDetail'
import { useTranslations } from 'next-intl'

const statusColor = {
    active: 'bg-emerald-200 dark:bg-emerald-200 text-gray-900 dark:text-gray-900',
    inactive: 'bg-gray-200 dark:bg-gray-200 text-gray-900 dark:text-gray-900',
    suspended: 'bg-red-200 dark:bg-red-200 text-gray-900 dark:text-gray-900',
}

const UsernameColumn = ({ row, onViewDetail }) => {
    return (
        <div className="flex items-center">
            <Avatar size={40} shape="circle">
                {row.username ? row.username[0].toUpperCase() : 'T'}
            </Avatar>
            <div
                className={`hover:text-primary ml-2 rtl:mr-2 font-semibold text-gray-900 dark:text-gray-100 cursor-pointer`}
                onClick={() => onViewDetail(row)}
            >
                {row.username}
            </div>
        </div>
    )
}

const ActionColumn = ({ onViewDetail }) => {
    const t = useTranslations('tiktokAccountManagement.table')
    return (
        <div className="flex items-center gap-3">
            <Tooltip title={t('view')}>
                <div
                    className={`text-xl cursor-pointer select-none font-semibold`}
                    role="button"
                    onClick={onViewDetail}
                >
                    <TbEye />
                </div>
            </Tooltip>
        </div>
    )
}

const TiktokAccountListTable = ({
    tiktokAccountListTotal,
    page = 1,
    per_page = 10,
}) => {
    const router = useRouter()
    const t = useTranslations('tiktokAccountManagement.table')
    const tDetail = useTranslations('tiktokAccountManagement.detail')
    const allColumns = [
        { header: t('username'), accessorKey: 'username' },
        { header: t('email'), accessorKey: 'email' },
        { header: t('phone'), accessorKey: 'phone_number' },
        { header: t('status'), accessorKey: 'status' },
        { header: t('notes'), accessorKey: 'notes' },
        { header: t('createdDate'), accessorKey: 'created_at' },
    ]

    const [visibleColumns, setVisibleColumns] = useState(allColumns.map(c => c.accessorKey))
    const [isDetailViewOpen, setIsDetailViewOpen] = useState(false)
    const [selectedTiktokAccountForDetail, setSelectedTiktokAccountForDetail] = useState(null)

    const tiktokAccountList = useTiktokAccountListStore((state) => state.tiktokAccountList)
    const selectedTiktokAccount = useTiktokAccountListStore((state) => state.selectedTiktokAccount)
    const isInitialLoading = useTiktokAccountListStore((state) => state.initialLoading)
    const setSelectedTiktokAccount = useTiktokAccountListStore((state) => state.setSelectedTiktokAccount)
    const setSelectAllTiktokAccount = useTiktokAccountListStore((state) => state.setSelectAllTiktokAccount)

    const { onAppendQueryParams } = useAppendQueryParams()

    const handleViewDetails = (tiktokAccount) => {
        setSelectedTiktokAccountForDetail(tiktokAccount)
        setIsDetailViewOpen(true)
    }

    const handleCloseDetailView = () => {
        setIsDetailViewOpen(false)
        setSelectedTiktokAccountForDetail(null)
    }

    const onColumnToggle = (accessorKey) => {
        if (visibleColumns.includes(accessorKey)) {
            setVisibleColumns(visibleColumns.filter(key => key !== accessorKey))
        } else {
            setVisibleColumns([...visibleColumns, accessorKey])
        }
    }
    
    const columns = useMemo(
        () => {
            const baseColumns = [
                {
                    header: t('username'),
                    accessorKey: 'username',
                    cell: (props) => {
                        const row = props.row.original
                        return <UsernameColumn row={row} onViewDetail={() => handleViewDetails(row)} />
                    },
                },
                {
                    header: t('email'),
                    accessorKey: 'email',
                },
                {
                    header: t('phone'),
                    accessorKey: 'phone_number',
                    cell: (props) => {
                        const phone = props.row.original.phone_number
                        return <span>{phone || '-'}</span>
                    }
                },
                {
                    header: t('status'),
                    accessorKey: 'status',
                    cell: (props) => {
                        const row = props.row.original
                        return (
                            <div className="flex items-center">
                                <Tag className={statusColor[row.status]}>
                                    <span className="capitalize">{row.status}</span>
                                </Tag>
                            </div>
                        )
                    },
                },
                {
                    header: t('notes'),
                    accessorKey: 'notes',
                    cell: (props) => {
                        const notes = props.row.original.notes
                        return <span>{notes ? (notes.length > 50 ? notes.substring(0, 50) + '...' : notes) : '-'}</span>
                    }
                },
                {
                    header: t('createdDate'),
                    accessorKey: 'created_at',
                    cell: (props) => {
                        return <span>{dayjs(props.row.original.created_at).format('DD/MM/YYYY')}</span>
                    }
                },
            ]
            
            const actionColumn = {
                header: '',
                id: 'action',
                cell: (props) => (
                    <ActionColumn
                        onViewDetail={() =>
                            handleViewDetails(props.row.original)
                        }
                    />
                ),
            }

            return [...baseColumns.filter(col => visibleColumns.includes(col.accessorKey)), actionColumn]
        }, 
        [visibleColumns],
    )

    const handlePaginationChange = (page) => {
        onAppendQueryParams({
            page: String(page),
        })
    }

    const handleSelectChange = (value) => {
        onAppendQueryParams({
            per_page: String(value),
            page: '1',
        })
    }

    const handleSort = (sort) => {
        onAppendQueryParams({
            sort: (sort.order === 'desc' ? '-' : '') + sort.key,
        })
    }

    const handleRowSelect = (checked, row) => {
        setSelectedTiktokAccount(checked, row)
    }

    const handleAllRowSelect = (checked, rows) => {
        if (checked) {
            const originalRows = rows.map((row) => row.original)
            setSelectAllTiktokAccount(originalRows)
        } else {
            setSelectAllTiktokAccount([])
        }
    }

    return (
        <div>
            <TiktokAccountListTableTools columns={columns} selectableColumns={allColumns} onColumnToggle={onColumnToggle} />
            <DataTable
                selectable
                columns={columns}
                data={tiktokAccountList}
                noData={tiktokAccountList.length === 0}
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ width: 28, height: 28 }}
                loading={isInitialLoading}
                pagingData={{
                    total: tiktokAccountListTotal,
                    pageIndex: page,
                    pageSize: per_page,
                }}
                checkboxChecked={(row) =>
                    selectedTiktokAccount.some((selected) => selected.id === row.id)
                }
                onPaginationChange={handlePaginationChange}
                onSelectChange={handleSelectChange}
                onSort={handleSort}
                onCheckBoxChange={handleRowSelect}
                onIndeterminateCheckBoxChange={handleAllRowSelect}
            />
            <Dialog
                isOpen={isDetailViewOpen}
                onClose={handleCloseDetailView}
                onRequestClose={handleCloseDetailView}
            >
                {selectedTiktokAccountForDetail && (
                    <div className="flex flex-col h-full">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-600">
                            <h5 className="font-bold">{tDetail('title')}</h5>
                        </div>
                        <div className="p-4 overflow-y-auto">
                           <TiktokAccountDetail tiktokAccount={selectedTiktokAccountForDetail} />
                        </div>
                        <div className="p-4 text-right border-t border-gray-200 dark:border-gray-600">
                            <Button
                                onClick={handleCloseDetailView}
                            >
                                {tDetail('close')}
                            </Button>
                        </div>
                    </div>
                )}
            </Dialog>
        </div>
    )
}

export default TiktokAccountListTable 