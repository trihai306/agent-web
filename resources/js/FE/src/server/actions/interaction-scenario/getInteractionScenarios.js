'use server'

import { apiGetInteractionScenarios } from '@/services/interaction-scenario/InteractionScenarioService'
import { withAuthCheck } from '@/utils/withAuthCheck'

export default async function getInteractionScenarios(params = {}) {
    return withAuthCheck(async () => {
        try {
            const response = await apiGetInteractionScenarios(params)
            return {
                success: true,
                data: response,
                message: 'Interaction scenarios retrieved successfully'
            }
        } catch (error) {
            console.error('Error fetching interaction scenarios:', error)
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch interaction scenarios'
            }
        }
    })
} 