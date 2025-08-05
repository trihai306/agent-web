'use client'
import { Form, FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useRouter } from 'next/navigation'
import createRole from '@/server/actions/createRole'
import updateRole from '@/server/actions/updateRole'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEffect, useState } from 'react'
import getPermissions from '@/server/actions/getPermissions'
import Checkbox from '@/components/ui/Checkbox'
import { useTranslations } from 'next-intl'

const validationSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    permissions: z.array(z.number()).optional(),
});

const RoleForm = ({ mode = 'add', role, onClose }) => {
    const router = useRouter()
    const [permissions, setPermissions] = useState([])
    const t = useTranslations('roleManagement.form')
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: { name: '', permissions: [] },
        resolver: zodResolver(validationSchema),
    })

    useEffect(() => {
        const fetchPermissions = async () => {
            const data = await getPermissions()
            if (data.success) {
                setPermissions(data.list)
            }
        }
        fetchPermissions()
    }, [])

    useEffect(() => {
        if (role) {
            reset({ 
                name: role.name, 
                permissions: role.permissions?.map(p => p.id) || [] 
            })
        } else {
            reset({ name: '', permissions: [] })
        }
    }, [role, reset])

    const onSubmit = async (values) => {
        try {
            const data = {
                name: values.name,
                permissions: values.permissions.map(id => permissions.find(p => p.id === id)?.name).filter(Boolean)
            };

            let result
            if (mode === 'add') {
                result = await createRole(data)
            } else {
                result = await updateRole(role.id, data)
            }
            if (result.success) {
                toast.push(
                    <Notification title="Success" type="success" closable>
                        {result.message}
                    </Notification>
                )
                onClose()
                router.refresh()
            } else {
                toast.push(
                    <Notification title="Error" type="danger" closable>
                        {result.message}
                    </Notification>
                )
            }
        } catch (error) {
            toast.push(
                <Notification title="Error" type="danger" closable>
                    An unexpected error occurred.
                </Notification>
            )
        }
    }

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <FormContainer>
                <h5 className="mb-4">{mode === 'add' ? t('createTitle') : t('editTitle')}</h5>
                <FormItem label={t('nameLabel')} invalid={Boolean(errors.name)} errorMessage={errors.name?.message}>
                    <Controller name="name" control={control} render={({ field }) => <Input placeholder={t('namePlaceholder')} {...field} />} />
                </FormItem>
                <FormItem label={t('permissionsLabel')}>
                    <Controller
                        name="permissions"
                        control={control}
                        render={({ field }) => (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {permissions.map((permission) => (
                                    <Checkbox
                                        key={permission.id}
                                        value={permission.id}
                                        checked={field.value.includes(permission.id)}
                                        onChange={(checked) => {
                                            const newValue = checked
                                                ? [...field.value, permission.id]
                                                : field.value.filter((id) => id !== permission.id);
                                            field.onChange(newValue);
                                        }}
                                    >
                                        {permission.name}
                                    </Checkbox>
                                ))}
                            </div>
                        )}
                    />
                </FormItem>
                <div className="text-right mt-4">
                    <Button type="button" className="mr-2" onClick={onClose}>
                        {t('cancel')}
                    </Button>
                    <Button variant="solid" type="submit" loading={isSubmitting}>
                        {isSubmitting ? t('saving') : t('save')}
                    </Button>
                </div>
            </FormContainer>
        </Form>
    )
}

export default RoleForm
