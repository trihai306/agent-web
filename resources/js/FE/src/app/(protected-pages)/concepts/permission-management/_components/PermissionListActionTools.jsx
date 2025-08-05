'use client'

import Button from '@/components/ui/Button'
import { TbPlus } from 'react-icons/tb'
import { useRouter } from 'next/navigation'

const PermissionListActionTools = ({ onAddNew }) => {
    return (
        <div className="flex flex-col md:flex-row gap-3">
            <Button
                variant="solid"
                icon={<TbPlus />}
                onClick={onAddNew}
            >
                Add new permission
            </Button>
        </div>
    )
}

export default PermissionListActionTools
