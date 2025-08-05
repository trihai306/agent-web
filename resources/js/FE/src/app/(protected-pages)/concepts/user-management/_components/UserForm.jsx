'use client'
import { Form, FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useRouter } from 'next/navigation'
import createUser from '@/server/actions/createUser'
import updateUser from '@/server/actions/updateUser'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { HiOutlineEyeOff, HiOutlineEye } from 'react-icons/hi'
import { TbTrash, TbLock, TbArrowBack } from 'react-icons/tb'
import { useState, useEffect } from 'react'
import AdaptableCard from '@/components/shared/AdaptiveCard'
import DoubleSidedImage from '@/components/shared/DoubleSidedImage'
import { Card, Checkbox, Select } from '@/components/ui'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import blockUsers from '@/server/actions/blockUsers'
import deleteUsers from '@/server/actions/deleteUsers'
import getRoles from '@/server/actions/getRoles'

const baseSchema = z.object({
    first_name: z.string().min(1, 'First Name is required'),
    last_name: z.string().min(1, 'Last Name is required'),
    email: z.string().email('Invalid email').min(1, 'Email is required'),
    phone_number: z.string().min(1, 'Phone Number is required'),
    roles: z.array(z.number()).optional(),
});

const editSchema = baseSchema;

const addSchema = baseSchema.extend({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    password_confirmation: z.string()
}).refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
});

const PasswordInput = ({ field, placeholder }) => {
    const [pwInputType, setPwInputType] = useState('password')
    const onPasswordVisibleClick = (e) => {
        e.preventDefault()
        setPwInputType(pwInputType === 'password' ? 'text' : 'password')
    }
    const inputIcon = (
        <span className="cursor-pointer" onClick={onPasswordVisibleClick}>
            {pwInputType === 'password' ? <HiOutlineEyeOff /> : <HiOutlineEye />}
        </span>
    )
    return <Input {...field} type={pwInputType} placeholder={placeholder} suffix={inputIcon} />
}

const FormAction = ({ mode, isSubmitting, onBlock, onDelete }) => {
    const router = useRouter()
    return (
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-600">
            <Button
                type="button"
                icon={<TbArrowBack />}
                onClick={() => router.push('/concepts/user-management')}
            >
                Back
            </Button>
            <div className="flex items-center gap-2">
                {mode === 'edit' && (
                    <>
                        <ConfirmDialog
                            onConfirm={onBlock}
                            title="Block User"
                            content="Are you sure you want to block this user?"
                            confirmText="Block"
                        >
                            <Button
                                type="button"
                                variant="outline"
                                color="red-500"
                                icon={<TbLock />}
                            >
                                Block
                            </Button>
                        </ConfirmDialog>
                        <ConfirmDialog
                            onConfirm={onDelete}
                            title="Delete User"
                            content="Are you sure you want to delete this user?"
                            confirmText="Delete"
                        >
                            <Button
                                type="button"
                                variant="solid"
                                color="red-500"
                                icon={<TbTrash />}
                            >
                                Delete
                            </Button>
                        </ConfirmDialog>
                    </>
                )}
                <Button
                    variant="solid"
                    type="submit"
                    loading={isSubmitting}
                >
                    {isSubmitting ? 'Saving...' : 'Save'}
                </Button>
            </div>
        </div>
    )
}

const UserForm = ({ mode = 'add', user }) => {
    const router = useRouter()
    const [roles, setRoles] = useState([])
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            first_name: '',
            last_name: '',
            email: '',
            phone_number: '',
            password: '',
            password_confirmation: '',
            roles: [],
        },
        resolver: zodResolver(mode === 'add' ? addSchema : editSchema),
    })

    useEffect(() => {
        const fetchRoles = async () => {
            const result = await getRoles({ per_page: 999 })
            if (result.success) {
                setRoles(result.list)
            }
        }
        fetchRoles()
    }, [])

    useEffect(() => {
        if (mode === 'edit' && user) {
            reset({
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                phone_number: user.phone_number,
                roles: user.roles?.map(role => role.id) || [],
            })
        }
    }, [mode, user, reset])

    const onSubmit = async (values) => {
        try {
            const data = {
                ...values,
                name: `${values.first_name} ${values.last_name}`
            }
            let result
            if (mode === 'add') {
                result = await createUser(data)
            } else {
                result = await updateUser(user.id, data)
            }
            if (result.success) {
                toast.push(
                    <Notification title="Success" type="success" closable>
                        {result.message}
                    </Notification>
                )
                router.push('/concepts/user-management')
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

    const onBlock = async () => {
        try {
            const result = await blockUsers([user.id])
            if (result.success) {
                toast.push(
                    <Notification title="Success" type="success" closable>
                        {result.message}
                    </Notification>
                )
                router.push('/concepts/user-management')
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

    const onDelete = async () => {
        try {
            const result = await deleteUsers([user.id])
            if (result.success) {
                toast.push(
                    <Notification title="Success" type="success" closable>
                        {result.message}
                    </Notification>
                )
                router.push('/concepts/user-management')
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
        <AdaptableCard>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <FormContainer>
                    <FormAction mode={mode} isSubmitting={isSubmitting} onBlock={onBlock} onDelete={onDelete} />
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="lg:col-span-1">
                            <Card>
                                <DoubleSidedImage
                                    src="/img/others/upload.png"
                                    darkModeSrc="/img/others/upload-dark.png"
                                    alt="upload"
                                />
                            </Card>
                        </div>
                        <div className="lg:col-span-2 space-y-4">
                            <Card>
                                <h5 className="mb-4">Basic Information</h5>
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     <FormItem label="First Name" invalid={Boolean(errors.first_name)} errorMessage={errors.first_name?.message}>
                                         <Controller name="first_name" control={control} render={({ field }) => <Input placeholder="First Name" {...field} />} />
                                     </FormItem>
                                     <FormItem label="Last Name" invalid={Boolean(errors.last_name)} errorMessage={errors.last_name?.message}>
                                         <Controller name="last_name" control={control} render={({ field }) => <Input placeholder="Last Name" {...field} />} />
                                     </FormItem>
                                 </div>
                            </Card>
                            <Card>
                                <h5 className="mb-4">Contact Information</h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormItem label="Email" invalid={Boolean(errors.email)} errorMessage={errors.email?.message}>
                                        <Controller name="email" control={control} render={({ field }) => <Input type="email" placeholder="Email" {...field} />} />
                                    </FormItem>
                                    <FormItem label="Phone Number" invalid={Boolean(errors.phone_number)} errorMessage={errors.phone_number?.message}>
                                        <Controller name="phone_number" control={control} render={({ field }) => <Input placeholder="Phone Number" {...field} />} />
                                    </FormItem>
                                </div>
                            </Card>
                             <Card>
                                <h5 className="mb-4">Roles</h5>
                                <FormItem>
                                    <Controller
                                        name="roles"
                                        control={control}
                                        render={({ field }) => (
                                            <Checkbox.Group
                                                value={field.value}
                                                onChange={(value) => field.onChange(value)}
                                            >
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                    {roles.map((role) => (
                                                        <Checkbox key={role.id} value={role.id}>
                                                            {role.name}
                                                        </Checkbox>
                                                    ))}
                                                </div>
                                            </Checkbox.Group>
                                        )}
                                    />
                                </FormItem>
                            </Card>
                            {mode === 'add' && (
                                <Card>
                                    <h5 className="mb-4">Password</h5>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormItem label="Password" invalid={Boolean(errors.password)} errorMessage={errors.password?.message}>
                                            <Controller name="password" control={control} render={({ field }) => <PasswordInput field={field} placeholder="Password" />} />
                                        </FormItem>
                                        <FormItem label="Confirm Password" invalid={Boolean(errors.password_confirmation)} errorMessage={errors.password_confirmation?.message}>
                                            <Controller name="password_confirmation" control={control} render={({ field }) => <PasswordInput field={field} placeholder="Confirm Password" />} />
                                        </FormItem>
                                    </div>
                                </Card>
                            )}
                            {mode === 'edit' && (
                                <Card>
                                    <h5 className="mb-4">Password</h5>
                                    <p>Password can only be changed by the user.</p>
                                </Card>
                            )}
                        </div>
                    </div>
                </FormContainer>
            </Form>
        </AdaptableCard>
    )
}

export default UserForm
