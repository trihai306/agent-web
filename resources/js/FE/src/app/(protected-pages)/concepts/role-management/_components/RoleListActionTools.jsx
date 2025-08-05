'use client'

import Button from '@/components/ui/Button'
import { TbPlus } from 'react-icons/tb'

const RoleListActionTools = ({ onAddNew }) => {
    return (
        <div className="flex flex-col md:flex-row gap-3">
            <Button
                variant="solid"
                icon={<TbPlus />}
                onClick={onAddNew}
            >
                Add new role
            </Button>
        </div>
    )
}

export default RoleListActionTools
