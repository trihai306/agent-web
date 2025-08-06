import { getRequestConfig } from 'next-intl/server'
import { getLocale } from '@/server/actions/system/locale'

export default getRequestConfig(async () => {
    const locale = await getLocale()
    const mainMessages = (await import(`../../messages/${locale}.json`)).default
    const authMessages = (
        await import(`../../auth-messages/${locale}.json`)
    ).default
    const permissionManagementMessages = (
        await import(`../../permission-management-messages/${locale}.json`)
    ).default
    const roleManagementMessages = (
        await import(`../../role-management-messages/${locale}.json`)
    ).default
    const transactionManagementMessages = (
        await import(`../../transaction-management-messages/${locale}.json`)
    ).default
    const userManagementMessages = (
        await import(`../../user-management-messages/${locale}.json`)
    ).default
    const accountMessages = (
        await import(`../../account-messages/${locale}.json`)
    ).default
    const accountTaskManagementMessages = (
        await import(`../../account-task-management-messages/${locale}.json`)
    ).default

    const messages = {
        ...mainMessages,
        ...authMessages,
        ...permissionManagementMessages,
        ...roleManagementMessages,
        ...transactionManagementMessages,
        ...userManagementMessages,
        ...accountMessages,
        ...accountTaskManagementMessages,
    }

    return {
        locale,
        messages,
    }
})
