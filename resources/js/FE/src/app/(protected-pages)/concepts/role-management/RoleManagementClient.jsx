'use client'
import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import RoleListProvider from './_components/RoleListProvider'
import RoleListTable from './_components/RoleListTable'
import RoleListActionTools from './_components/RoleListActionTools'
import { useRoleListStore } from './_store/roleListStore'
import Dialog from '@/components/ui/Dialog'
import RoleForm from './_components/RoleForm'
import { useTranslations } from 'next-intl'

const RoleManagementClient = ({ data, params }) => {
    const isFormOpen = useRoleListStore((state) => state.isFormOpen)
    const formMode = useRoleListStore((state) => state.formMode)
    const selectedRoleForForm = useRoleListStore((state) => state.selectedRoleForForm)
    const openForm = useRoleListStore((state) => state.openForm)
    const closeForm = useRoleListStore((state) => state.closeForm)
    const t = useTranslations('roleManagement')

    return (
        <RoleListProvider roleList={data.list}>
            <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>{t('title')}</h3>
                            <RoleListActionTools onAddNew={() => openForm('add')} />
                        </div>
                        <RoleListTable
                            roleListTotal={data.total}
                            page={parseInt(params.page) || 1}
                            per_page={parseInt(params.per_page) || 10}
                        />
                    </div>
                </AdaptiveCard>
            </Container>
            <Dialog
                isOpen={isFormOpen}
                onClose={closeForm}
                onRequestClose={closeForm}
            >
                <RoleForm 
                    mode={formMode} 
                    role={selectedRoleForForm} 
                    onClose={closeForm} 
                />
            </Dialog>
        </RoleListProvider>
    )
}

export default RoleManagementClient
