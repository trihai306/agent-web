'use client'
import { useState } from 'react'
import Button from '@/components/ui/Button'
import Tag from '@/components/ui/Tag'
import Avatar from '@/components/ui/Avatar'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import CreditCardDialog from '@/components/view/CreditCardDialog'
import BillingHistory from './BillingHistory'
import { apiGetSettingsBilling } from '@/services/AccontsService'
import { apiGetUserTransactions } from '@/services/TransactionService'
import classNames from '@/utils/classNames'
import isLastChild from '@/utils/isLastChild'
import sleep from '@/utils/sleep'
import { TbPlus } from 'react-icons/tb'
import useSWR from 'swr'
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
import { PiLightningFill } from 'react-icons/pi'
import { NumericFormat } from 'react-number-format'
import useCurrentSession from '@/utils/hooks/useCurrentSession'
import { Spinner } from '@/components/ui'
import { useTranslations } from 'next-intl'

const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]

const SettingsBilling = () => {
    const t = useTranslations('account.settings.billing')

    const router = useRouter()
    const { session } = useCurrentSession()

    const [selectedCard, setSelectedCard] = useState({
        type: '',
        dialogOpen: false,
        cardInfo: {},
    })

    const {
        data: settingsData,
        isLoading: isSettingsLoading
    } = useSWR(session?.accessToken ? '/settings' : null, () => apiGetSettingsBilling(session.accessToken), {
        revalidateOnFocus: false,
        revalidateIfStale: false,
        revalidateOnReconnect: false,
    })
    
    const { data: transactionData, isLoading: isTransactionLoading } = useSWR(
        session?.accessToken ? '/my-transactions' : null,
        () => apiGetUserTransactions({}, session.accessToken),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        }
    )

    const handleEditCreditCard = (card) => {
        setSelectedCard({
            type: 'EDIT',
            dialogOpen: true,
            cardInfo: card,
        })
    }

    const handleCreditCardDialogClose = () => {
        setSelectedCard({
            type: '',
            dialogOpen: false,
            cardInfo: {},
        })
    }

    const handleEditCreditCardSubmit = async () => {
        await sleep(500)
        handleCreditCardDialogClose()
        toast.push(
            <Notification type="success">{t('creditCardUpdated')}</Notification>,
            { placement: 'top-center' },
        )
    }



    const handleChangePlan = () => {
        router.push('/concepts/account/pricing?subcription=basic&cycle=monthly')
    }
    
    const currentPlan = settingsData?.billing?.current_plan || {}
    const paymentMethods = settingsData?.billing?.payment_methods || []

    if (isSettingsLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <Spinner size="lg" />
            </div>
        )
    }

    return (
        <div>
            <h4 className="mb-4">{t('title')}</h4>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div>
                            <Avatar
                                className="bg-emerald-500"
                                shape="circle"
                                icon={<PiLightningFill />}
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h6 className="font-bold">
                                    {currentPlan.plan}
                                </h6>
                                <Tag className="bg-success-subtle text-success rounded-md border-0">
                                    <span className="capitalize">
                                        {currentPlan.status}
                                    </span>
                                </Tag>
                            </div>
                            <div className="font-semibold">
                                <span>
                                    {t('billing')} {currentPlan.billing_cycle}
                                </span>
                                <span> | </span>
                                <span>
                                    {t('nextPaymentOn')}{' '}
                                    {dayjs
                                        .unix(
                                            currentPlan.next_payment_date ||
                                                0,
                                        )
                                        .format('MM/DD/YYYY')}
                                </span>
                                <span>
                                    <span className="mx-1">{t('for')}</span>
                                    <NumericFormat
                                        className="font-bold heading-text"
                                        displayType="text"
                                        value={(
                                            Math.round(
                                                (currentPlan.amount || 0) *
                                                    100,
                                            ) / 100
                                        ).toFixed(2)}
                                        prefix={'$'}
                                        thousandSeparator={true}
                                    />
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex">
                        <Button
                            size="sm"
                            variant="solid"
                            onClick={handleChangePlan}
                        >
                            {t('changePlan')}
                        </Button>
                    </div>
                </div>
            </div>
            <div className="mt-8">
                <h5>{t('paymentMethod')}</h5>
                <div>
                    {paymentMethods?.map((card, index) => (
                        <div
                            key={card.cardId}
                            className={classNames(
                                'flex items-center justify-between p-4',
                                !isLastChild(paymentMethods, index) &&
                                    'border-b border-gray-200 dark:border-gray-600',
                            )}
                        >
                            <div className="flex items-center">
                                {card.cardType === 'VISA' && (
                                    <img
                                        src="/img/others/img-8.png"
                                        alt="visa"
                                    />
                                )}
                                {card.cardType === 'MASTER' && (
                                    <img
                                        src="/img/others/img-9.png"
                                        alt="master"
                                    />
                                )}
                                <div className="ml-3 rtl:mr-3">
                                    <div className="flex items-center">
                                        <div className="text-gray-900 dark:text-gray-100 font-semibold">
                                            {card.cardHolderName} ••••{' '}
                                            {card.last4Number}
                                        </div>
                                        {card.primary && (
                                            <Tag className="bg-primary-subtle text-primary rounded-md border-0 mx-2">
                                                <span className="capitalize">
                                                    {' '}
                                                    {t('primary')}{' '}
                                                </span>
                                            </Tag>
                                        )}
                                    </div>
                                    <span>
                                        {t('expired')}{' '}
                                        {months[parseInt(card.expMonth) - 1]} 20
                                        {card.expYear}
                                    </span>
                                </div>
                            </div>
                            <div className="flex">
                                <Button
                                    size="sm"
                                    type="button"
                                    onClick={() => handleEditCreditCard(card)}
                                >
                                    {t('edit')}
                                </Button>
                            </div>
                        </div>
                    ))}
                    
                </div>
            </div>
            <div className="mt-8">
                <h5>{t('transactionHistory')}</h5>
                <BillingHistory
                    className="mt-4"
                    data={transactionData?.data || []}
                    loading={isTransactionLoading}
                />
            </div>
            <CreditCardDialog
                title={t('editCreditCard')}
                defaultValues={selectedCard.cardInfo}
                dialogOpen={selectedCard.dialogOpen}
                onDialogClose={handleCreditCardDialogClose}
                onSubmit={handleEditCreditCardSubmit}
            />
        </div>
    )
}

export default SettingsBilling
