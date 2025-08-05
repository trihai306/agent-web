'use server'

import { revalidatePath } from 'next/cache'
import TransactionService from '@/services/TransactionService'

export default async function updateTransactionStatus(transactionId, status) {
    try {
        let response;
        if (status === 'approve') {
            response = await TransactionService.approveTransaction(transactionId);
        } else if (status === 'reject') {
            response = await TransactionService.rejectTransaction(transactionId);
        } else {
            throw new Error('Invalid status provided.');
        }

        revalidatePath('/concepts/transaction-management')
        return {
            success: true,
            message: `Transaction successfully ${status === 'approve' ? 'approved' : 'rejected'}.`,
            data: response.data
        }

    } catch (error) {
        const message = error.response?.data?.message || error.message || 'An unexpected error occurred.';
        return {
            success: false,
            message: message,
        }
    }
}
