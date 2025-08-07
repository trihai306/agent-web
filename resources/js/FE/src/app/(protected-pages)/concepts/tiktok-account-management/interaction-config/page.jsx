'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import InteractionConfigModal from '../_components/InteractionConfigModal'

const InteractionConfig = () => {
    const router = useRouter()
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Mở modal ngay khi component được mount
    useEffect(() => {
        setIsModalOpen(true)
    }, [])

    const handleCloseModal = () => {
        setIsModalOpen(false)
        // Quay về trang quản lý tài khoản TikTok sau khi đóng modal
        router.push('/concepts/tiktok-account-management')
    }

    return (
        <InteractionConfigModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
        />
    )
}

export default InteractionConfig 