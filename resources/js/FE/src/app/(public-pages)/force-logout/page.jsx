// resources/js/FE/src/app/(public-pages)/force-logout/page.jsx
'use client'

import { useEffect } from 'react'
import { signOut } from 'next-auth/react'
import appConfig from '@/configs/app.config'
import { useRouter } from 'next/navigation'

const ForceLogoutPage = () => {
    const router = useRouter()
    
    useEffect(() => {
        // Thực hiện signOut, sau khi xong sẽ redirect về trang đăng nhập
        signOut({ redirect: false }).then(() => {
            router.push(appConfig.unAuthenticatedEntryPath)
        })
    }, [router])

    // Hiển thị một thông báo loading trong khi chờ
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <p>Your session has expired. Redirecting to sign-in page...</p>
        </div>
    )
}

export default ForceLogoutPage
