'use client'

import { useEffect } from 'react'
import { signOut } from 'next-auth/react'
import appConfig from '@/configs/app.config'

const ForceSignOut = () => {
    useEffect(() => {
        signOut({ callbackUrl: appConfig.unAuthenticatedEntryPath })
    }, [])

    return null // Component này không render gì cả
}

export default ForceSignOut
