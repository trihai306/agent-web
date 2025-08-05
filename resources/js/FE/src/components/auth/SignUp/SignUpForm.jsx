'use client'
import { useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { FormItem, Form } from '@/components/ui/Form'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const validationSchema = z
    .object({
        first_name: z.string({ required_error: 'Please enter your first name' }),
        last_name: z.string({ required_error: 'Please enter your last name' }),
        email: z.string({ required_error: 'Please enter your email' }).email('Invalid email format'),
        phone_number: z.string({ required_error: 'Please enter your phone number' }),
        password: z.string({ required_error: 'Password Required' }).min(8, 'Password must be at least 8 characters'),
        confirmPassword: z.string({
            required_error: 'Confirm Password Required',
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Password not match',
        path: ['confirmPassword'],
    })

const SignUpForm = (props) => {
    const { onSignUp, className, setMessage } = props

    const [isSubmitting, setSubmitting] = useState(false)

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm({
        resolver: zodResolver(validationSchema),
    })

    const handleSignUp = async (values) => {
        if (onSignUp) {
            onSignUp({ values, setSubmitting, setMessage })
        }
    }

    return (
        <div className={className}>
            <Form onSubmit={handleSubmit(handleSignUp)}>
                <div className="flex gap-4">
                    <FormItem
                        label="First Name"
                        invalid={Boolean(errors.first_name)}
                        errorMessage={errors.first_name?.message}
                        className="w-1/2"
                    >
                        <Controller
                            name="first_name"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    placeholder="First Name"
                                    autoComplete="off"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="Last Name"
                        invalid={Boolean(errors.last_name)}
                        errorMessage={errors.last_name?.message}
                        className="w-1/2"
                    >
                        <Controller
                            name="last_name"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    placeholder="Last Name"
                                    autoComplete="off"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                </div>
                <FormItem
                    label="Email"
                    invalid={Boolean(errors.email)}
                    errorMessage={errors.email?.message}
                >
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="email"
                                placeholder="Email"
                                autoComplete="off"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Phone Number"
                    invalid={Boolean(errors.phone_number)}
                    errorMessage={errors.phone_number?.message}
                >
                    <Controller
                        name="phone_number"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                placeholder="Phone Number"
                                autoComplete="off"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Password"
                    invalid={Boolean(errors.password)}
                    errorMessage={errors.password?.message}
                >
                    <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="password"
                                autoComplete="off"
                                placeholder="Password"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Confirm Password"
                    invalid={Boolean(errors.confirmPassword)}
                    errorMessage={errors.confirmPassword?.message}
                >
                    <Controller
                        name="confirmPassword"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="password"
                                autoComplete="off"
                                placeholder="Confirm Password"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <Button
                    block
                    loading={isSubmitting}
                    variant="solid"
                    type="submit"
                >
                    {isSubmitting ? 'Creating Account...' : 'Sign Up'}
                </Button>
            </Form>
        </div>
    )
}

export default SignUpForm
