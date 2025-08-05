import UserForm from '../_components/UserForm'
import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'

const NewUser = () => {
    return (
        <Container>
            <AdaptiveCard>
                <div className="flex flex-col gap-4">
                    <h3>Create New User</h3>
                    <UserForm mode="add" />
                </div>
            </AdaptiveCard>
        </Container>
    )
}

export default NewUser
