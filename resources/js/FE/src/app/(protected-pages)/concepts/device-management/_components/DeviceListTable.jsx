'use client'
import { useState, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import DataTable from '@/components/shared/DataTable'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { useDeviceListStore } from '../_store/deviceListStore'
import DeviceDetailModal from './DeviceDetailModal'
import ColumnSelector from './ColumnSelector'
import DeviceListTableTools from './DeviceListTableTools'
import {
    HiOutlineEye as Eye,
    HiOutlinePencilAlt as Edit,
    HiOutlineTrash as Trash,
    HiOutlineDesktopComputer as Desktop,
    HiOutlineDeviceMobile as Mobile,
    HiOutlineStatusOnline as Online,
    HiOutlineStatusOffline as Offline,
    HiOutlineUser as User
} from 'react-icons/hi'

// Device Name Column Component
const DeviceNameColumn = ({ row, onViewDetail }) => {
    const getDeviceIcon = (deviceType) => {
        switch (deviceType?.toLowerCase()) {
            case 'mobile':
            case 'phone':
            case 'smartphone':
                return <Mobile className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            case 'desktop':
            case 'computer':
            case 'pc':
                return <Desktop className="w-4 h-4 text-green-600 dark:text-green-400" />
            default:
                return <Desktop className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        }
    }

    return (
        <div className="flex items-center gap-3">
            {getDeviceIcon(row.device_type)}
            <div>
                <button
                    onClick={() => onViewDetail(row)}
                    className="font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                    {row.device_name}
                </button>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    ID: {row.device_id}
                </div>
            </div>
        </div>
    )
}

// Action Column Component
const ActionColumn = ({ row, onViewDetail, onEdit, onDelete }) => {
    return (
        <div className="flex items-center gap-1">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewDetail(row)}
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
                <Eye className="w-4 h-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(row)}
                className="text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400"
            >
                <Edit className="w-4 h-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(row)}
                className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
            >
                <Trash className="w-4 h-4" />
            </Button>
        </div>
    )
}

const DeviceListTable = ({
    deviceListTotal,
    page = 1,
    per_page = 10,
}) => {
    const router = useRouter()
    const searchParams = useSearchParams()
    
    // Store state
    const {
        deviceList,
        selectedDevice,
        toggleDeviceSelection,
        selectAllDevices,
        clearSelectedDevice
    } = useDeviceListStore()
    
    // Local state
    const [selectedDetailDevice, setSelectedDetailDevice] = useState(null)
    const [showDetailModal, setShowDetailModal] = useState(false)
    const [visibleColumns, setVisibleColumns] = useState([
        'device_name',
        'user',
        'status',
        'is_online',
        'device_type',
        'platform',
        'last_active_at',
        'created_at',
        'actions'
    ])

    const handleViewDetails = (device) => {
        setSelectedDetailDevice(device)
        setShowDetailModal(true)
    }

    const handleCloseDetailView = () => {
        setShowDetailModal(false)
        setSelectedDetailDevice(null)
    }

    const handleEdit = (device) => {
        console.log('Edit device:', device)
        // TODO: Implement edit functionality
    }

    const handleDelete = (device) => {
        console.log('Delete device:', device)
        // TODO: Implement delete functionality
    }

    const onColumnToggle = (accessorKey) => {
        setVisibleColumns(prev => 
            prev.includes(accessorKey)
                ? prev.filter(col => col !== accessorKey)
                : [...prev, accessorKey]
        )
    }

    // Define table columns
    const columns = useMemo(() => [
        {
            accessorKey: 'device_name',
            header: 'Thiết bị',
            cell: ({ row }) => (
                <DeviceNameColumn 
                    row={row.original} 
                    onViewDetail={handleViewDetails}
                />
            ),
            enableSorting: true,
        },
        {
            accessorKey: 'user',
            header: 'Người dùng',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-900 dark:text-gray-100">
                        {row.original.user?.name || 'Chưa gán'}
                    </span>
                </div>
            ),
            enableSorting: false,
        },
        {
            accessorKey: 'status',
            header: 'Trạng thái',
            cell: ({ row }) => {
                const status = row.original.status
                const getStatusColor = (status) => {
                    switch (status) {
                        case 'active':
                            return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        case 'inactive':
                            return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                        case 'blocked':
                            return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        default:
                            return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                    }
                }
                
                const getStatusText = (status) => {
                    switch (status) {
                        case 'active':
                            return 'Hoạt động'
                        case 'inactive':
                            return 'Không hoạt động'
                        case 'blocked':
                            return 'Bị chặn'
                        default:
                            return 'Không xác định'
                    }
                }

                return (
                    <Badge className={getStatusColor(status)}>
                        {getStatusText(status)}
                    </Badge>
                )
            },
            enableSorting: true,
        },
        {
            accessorKey: 'is_online',
            header: 'Trực tuyến',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    {row.original.is_online ? (
                        <>
                            <Online className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-green-600 dark:text-green-400">Online</span>
                        </>
                    ) : (
                        <>
                            <Offline className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-500 dark:text-gray-400">Offline</span>
                        </>
                    )}
                </div>
            ),
            enableSorting: true,
        },
        {
            accessorKey: 'device_type',
            header: 'Loại thiết bị',
            cell: ({ row }) => (
                <span className="text-sm text-gray-900 dark:text-gray-100 capitalize">
                    {row.original.device_type || 'Không xác định'}
                </span>
            ),
            enableSorting: true,
        },
        {
            accessorKey: 'platform',
            header: 'Nền tảng',
            cell: ({ row }) => (
                <span className="text-sm text-gray-900 dark:text-gray-100">
                    {row.original.platform || 'Không xác định'}
                </span>
            ),
            enableSorting: true,
        },
        {
            accessorKey: 'last_active_at',
            header: 'Hoạt động cuối',
            cell: ({ row }) => (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {row.original.last_active_at 
                        ? new Date(row.original.last_active_at).toLocaleString('vi-VN')
                        : 'Chưa có'
                    }
                </span>
            ),
            enableSorting: true,
        },
        {
            accessorKey: 'created_at',
            header: 'Ngày tạo',
            cell: ({ row }) => (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(row.original.created_at).toLocaleDateString('vi-VN')}
                </span>
            ),
            enableSorting: true,
        },
        {
            accessorKey: 'actions',
            header: 'Thao tác',
            cell: ({ row }) => (
                <ActionColumn
                    row={row.original}
                    onViewDetail={handleViewDetails}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            ),
            enableSorting: false,
        },
    ], [])

    // Filter visible columns
    const visibleColumnsData = columns.filter(column => 
        visibleColumns.includes(column.accessorKey)
    )

    const selectableColumns = columns.filter(column => 
        column.accessorKey !== 'actions'
    )

    const handlePaginationChange = (page) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('page', page.toString())
        router.push(`?${params.toString()}`)
    }

    const handleSelectChange = (value) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('per_page', value.toString())
        params.set('page', '1') // Reset to first page
        router.push(`?${params.toString()}`)
    }

    const handleSort = (sort) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('sort', sort.column)
        params.set('order', sort.direction)
        router.push(`?${params.toString()}`)
    }

    const handleRowSelect = (checked, row) => {
        toggleDeviceSelection(row.original)
    }

    const handleAllRowSelect = (checked, rows) => {
        if (checked) {
            selectAllDevices()
        } else {
            clearSelectedDevice()
        }
    }

    return (
        <>
            <div className="space-y-4">
                {/* Table Tools */}
                <DeviceListTableTools
                    columns={columns}
                    selectableColumns={selectableColumns}
                    onColumnToggle={onColumnToggle}
                />

                {/* Data Table */}
                <DataTable
                    data={deviceList}
                    columns={visibleColumnsData}
                    pagination={{
                        pageIndex: page - 1,
                        pageSize: per_page,
                        pageCount: Math.ceil(deviceListTotal / per_page),
                        total: deviceListTotal,
                        onPageChange: handlePaginationChange,
                        onPageSizeChange: handleSelectChange,
                    }}
                    sorting={{
                        onSortingChange: handleSort,
                    }}
                    rowSelection={{
                        selectedRows: selectedDevice,
                        onRowSelect: handleRowSelect,
                        onAllRowsSelect: handleAllRowSelect,
                        getRowId: (row) => row.id,
                    }}
                    loading={false}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm"
                />
            </div>

            {/* Device Detail Modal */}
            <DeviceDetailModal
                isOpen={showDetailModal}
                onClose={handleCloseDetailView}
                device={selectedDetailDevice}
            />
        </>
    )
}

export default DeviceListTable
