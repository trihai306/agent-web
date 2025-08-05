import ApiService from './ApiService'

const TransactionService = {
    getUserTransactions: async (params) => {
        return ApiService.fetchData({
            url: '/my-transactions',
            method: 'get',
            params,
        })
    },

    approveTransaction: async (transactionId) => {
        return ApiService.fetchData({
            url: `/transactions/${transactionId}/approve`,
            method: 'post',
        })
    },

    rejectTransaction: async (transactionId) => {
        return ApiService.fetchData({
            url: `/transactions/${transactionId}/reject`,
            method: 'post',
        })
    },
}

export default TransactionService
