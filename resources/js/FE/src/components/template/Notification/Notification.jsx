'use client'
import { useState, useRef, useEffect } from 'react'
import classNames from 'classnames'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import Dropdown from '@/components/ui/Dropdown'
import ScrollBar from '@/components/ui/ScrollBar'
import Spinner from '@/components/ui/Spinner'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import NotificationAvatar from './NotificationAvatar'
import NotificationToggle from './NotificationToggle'
import useSWR from 'swr'
import { useSession } from 'next-auth/react' // Use the official hook
import {
    apiGetNotifications,
    apiMarkNotificationAsRead,
    apiMarkAllNotificationsAsRead,
} from '@/services/notification/NotificationService'
import isLastChild from '@/utils/isLastChild'
import useResponsive from '@/utils/hooks/useResponsive'
import { useRouter } from 'next/navigation'
import { HiOutlineMailOpen } from 'react-icons/hi'
import dayjs from 'dayjs'

const notificationHeight = 'h-[280px]'

// This component will only render on the client side after mounting
const ClientTime = ({ time }) => {
    const [hasMounted, setHasMounted] = useState(false)

    useEffect(() => {
        setHasMounted(true)
    }, [])

    if (!hasMounted) {
        return null // Or a placeholder
    }

    return <span className="text-xs">{dayjs(time).fromNow()}</span>
}

const _Notification = ({ className }) => {
    const { data: session, status } = useSession() // Get session and status
    const [loading, setLoading] = useState(false)
    const { larger } = useResponsive()
    const router = useRouter()

    // Fetch only when authenticated
    const canFetch = status === 'authenticated'

    const {
        data: notifications,
        mutate: mutateNotifications,
    } = useSWR(
        canFetch ? '/api/notifications' : null,
        () => apiGetNotifications({}, session.accessToken),
        { revalidateOnFocus: false },
    )

    const { data: unreadCountData } = useSWR(
        canFetch ? '/api/notifications/unread-count' : null,
        () =>
            apiGetNotifications({ 'filter[read_at]': 'null' }, session.accessToken),
        { revalidateOnFocus: false }, // Add this line
    )

    const unreadCount = unreadCountData?.data?.length || 0

    const onMarkAllAsRead = async () => {
        if (!session) return
        try {
            await apiMarkAllNotificationsAsRead(session.accessToken)
            mutateNotifications()
        } catch (error) {
            console.error('Failed to mark all as read:', error)
        }
    }

    const onMarkAsRead = async (id) => {
        if (!session) return
        try {
            await apiMarkNotificationAsRead(id, session.accessToken)
            mutateNotifications()
        } catch (error) {
            console.error('Failed to mark as read:', error)
        }
    }

    const notificationDropdownRef = useRef(null)

    const handleViewAllActivity = () => {
        router.push('/concepts/account/activity-log')
        if (notificationDropdownRef.current) {
            notificationDropdownRef.current.handleDropdownClose()
        }
    }

    return (
        <Dropdown
            ref={notificationDropdownRef}
            renderTitle={
                <NotificationToggle
                    dot={unreadCount > 0}
                    className={className}
                    count={unreadCount}
                />
            }
            menuClass="min-w-[280px] md:min-w-[340px]"
            placement={larger.md ? 'bottom-end' : 'bottom'}
        >
            <Dropdown.Item variant="header">
                <div className="dark:border-gray-700 px-2 flex items-center justify-between mb-1">
                    <h6>Notifications</h6>
                    <Button
                        variant="plain"
                        shape="circle"
                        size="sm"
                        icon={<HiOutlineMailOpen className="text-xl" />}
                        title="Mark all as read"
                        onClick={onMarkAllAsRead}
                    />
                </div>
            </Dropdown.Item>
            <ScrollBar className={classNames('overflow-y-auto', notificationHeight)}>
                {(status === 'loading' || loading) && (
                     <div className={classNames('flex items-center justify-center', notificationHeight)}>
                        <Spinner size={40} />
                    </div>
                )}

                {status === 'authenticated' && notifications?.data && notifications.data.length > 0 ? (
                    notifications.data.map((item, index) => (
                        <div key={item.id}>
                            <div
                                className={`relative rounded-xl flex px-4 py-3 cursor-pointer hover:bg-gray-100 active:bg-gray-100 dark:hover:bg-gray-700`}
                                onClick={() => onMarkAsRead(item.id)}
                            >
                                <NotificationAvatar type={item.type} />
                                <div className="mx-3">
                                    <div dangerouslySetInnerHTML={{ __html: item.data.message }}></div>
                                    <ClientTime time={item.created_at} />
                                </div>
                                <Badge
                                    className="absolute top-4 ltr:right-4 rtl:left-4 mt-1.5"
                                    innerClass={!item.read_at ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}
                                />
                            </div>
                            {!isLastChild(notifications.data, index) && (
                                <div className="border-b border-gray-200 dark:border-gray-700 my-2" />
                            )}
                        </div>
                    ))
                ) : (
                    status === 'authenticated' && (
                        <div className={classNames('flex items-center justify-center', notificationHeight)}>
                            <div className="text-center">
                                <img
                                    className="mx-auto mb-2 max-w-[150px]"
                                    src="/img/others/no-notification.png"
                                    alt="no-notification"
                                />
                                <h6 className="font-semibold">No notifications!</h6>
                                <p className="mt-1">Please Try again later</p>
                            </div>
                        </div>
                    )
                )}
            </ScrollBar>
            <Dropdown.Item variant="header">
                <div className="pt-4">
                    <Button
                        block
                        variant="solid"
                        onClick={handleViewAllActivity}
                    >
                        View All Activity
                    </Button>
                </div>
            </Dropdown.Item>
        </Dropdown>
    )
}

const Notification = withHeaderItem(_Notification)

export default Notification
