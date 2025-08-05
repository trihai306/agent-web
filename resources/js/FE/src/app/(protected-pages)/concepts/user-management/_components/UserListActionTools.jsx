'use client'

import Button from '@/components/ui/Button'
import { TbUserPlus } from 'react-icons/tb'
import { useRouter } from 'next/navigation'

const UserListActionTools = () => {
    const router = useRouter()

    return (
        <div className="flex flex-col md:flex-row gap-3">
            <Button
                variant="solid"
                icon={<TbUserPlus className="text-xl" />}
                onClick={() =>
                    router.push('/concepts/user-management/user-new')
                }
            >
                Add new user
            </Button>
        </div>
    )
}

export default UserListActionTools
