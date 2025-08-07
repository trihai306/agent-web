'use client'
import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import TiktokAccountListProvider from './_components/TiktokAccountListProvider'
import TiktokAccountListTable from './_components/TiktokAccountListTable'
import TiktokAccountListActionTools from './_components/TiktokAccountListActionTools'
import { useTranslations } from 'next-intl'

const TiktokAccountManagementClient = ({ data, params }) => {
    const t = useTranslations('tiktokAccountManagement')

    return (
        <TiktokAccountListProvider tiktokAccountList={data?.list || []}>
            <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>{t('title')}</h3>
                            <TiktokAccountListActionTools />
                        </div>
                        <TiktokAccountListTable
                            tiktokAccountListTotal={data?.total || 0}
                            page={parseInt(params.page) || 1}
                            per_page={parseInt(params.per_page) || 10}
                        />
                    </div>
                </AdaptiveCard>
            </Container>
        </TiktokAccountListProvider>
    )
}

export default TiktokAccountManagementClient 