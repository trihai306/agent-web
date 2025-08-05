import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import UserListProvider from './_components/UserListProvider'
import UserListTable from './_components/UserListTable'
import UserListActionTools from './_components/UserListActionTools'
import getUsers from '@/server/actions/getUsers'


export default async function Page({ searchParams }) {
    const params = await searchParams
    const data = await getUsers(params)

    return (
        <UserListProvider userList={data.list}>
            <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>Users</h3>
                            <UserListActionTools />
                        </div>
                        <UserListTable
                            userListTotal={data.total}
                            page={parseInt(params.page) || 1}
                            per_page={parseInt(params.per_page) || 10}
                        />
                    </div>
                </AdaptiveCard>
            </Container>
        </UserListProvider>
    )
}
