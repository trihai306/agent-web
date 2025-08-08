// resources/js/FE/src/utils/withAuthCheck.js
'use server'

import { UnauthorizedError } from '@/errors'
import { redirect } from 'next/navigation'

/**
 * A higher-order function that wraps a server action's logic to provide centralized authentication checking.
 * @param {Function} actionLogic The async function containing the core server action logic.
 * @returns The result of the actionLogic, or redirects on authentication failure.
 */
export async function withAuthCheck(actionLogic) {
    try {
        // Execute the actual logic
        return await actionLogic()
    } catch (error) {
        // Log the error for debugging
        console.log('withAuthCheck caught error:', {
            name: error.name,
            message: error.message,
            isUnauthorizedError: error instanceof UnauthorizedError,
            status: error?.response?.status,
            isAxiosError: error.name === 'AxiosError'
        })
        
        // If it's the specific error we're looking for, redirect.
        if (error instanceof UnauthorizedError) {
            console.log('Redirecting to /force-logout due to UnauthorizedError')
            redirect('/force-logout')
        }
        
        // For any other error, re-throw it so we can debug it.
        // This prevents swallowing other important errors.
        throw error
    }
}
