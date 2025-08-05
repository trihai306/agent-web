'use server'

import { apiDeleteTransactions } from '@/services/TransactionsService'
import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'

const deleteTransactions = async (transactionIds) => {
    try {
        const session = await auth()
        const accessToken = session?.accessToken
        const resp = await apiDeleteTransactions({ ids: transactionIds }, accessToken)
        if (resp) {
            revalidatePath('/concepts/transaction-management')
            return {
                success: true,
                message: 'Transactions deleted successfully!',
            }
        }
    } catch (errors) {
        return {
            success: false,
            message: errors?.response?.data?.message || errors.toString(),
        }
    }
}

export default deleteTransactions
