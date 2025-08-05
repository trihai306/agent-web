'use client'
import DebouceInput from '@/components/shared/DebouceInput'
import { TbSearch } from 'react-icons/tb'

const PermissionListSearch = (props) => {
    const { onInputChange } = props

    return (
        <DebouceInput
            placeholder="Search by name..."
            suffix={<TbSearch className="text-lg" />}
            onChange={(e) => onInputChange(e.target.value)}
        />
    )
}

export default PermissionListSearch
