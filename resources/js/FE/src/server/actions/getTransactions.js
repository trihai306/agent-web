'use server'

import { auth } from '@/auth'
import { apiGetTransactions } from '@/services/TransactionsService'

const getTransactions = async (params) => {
    try {
        const session = await auth()
        const accessToken = session?.accessToken
        const resp = await apiGetTransactions(params, accessToken)
        if (resp) {
            return {
                success: true,
                list: resp.data,
                total: resp.total,
            }
        }
    } catch (errors) {
        return {
            success: false,
            message: errors?.response?.data?.message || errors.toString(),
        }
    }
}

export default getTransactions
