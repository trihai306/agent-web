import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import TransactionListProvider from './_components/TransactionListProvider'
import TransactionListTable from './_components/TransactionListTable'
import getTransactions from '@/server/actions/getTransactions'

export default async function Page({ searchParams }) {
    const params = await searchParams
    const data = await getTransactions(params)

    return (
        <TransactionListProvider transactionList={data.list || []}>
            <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>Transactions</h3>
                        </div>
                        <TransactionListTable
                            transactionListTotal={data.total || 0}
                            page={parseInt(params.page) || 1}
                            per_page={parseInt(params.per_page) || 10}
                        />
                    </div>
                </AdaptiveCard>
            </Container>
        </TransactionListProvider>
    )
}
