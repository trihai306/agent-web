// resources/js/FE/src/server/actions/interaction-scenario/getInteractionScenarios.js
'use server'

import InteractionScenarioService from '@/services/interaction-scenario/InteractionScenarioService'
import { withAuthCheck } from '@/utils/withAuthCheck'

/**
 * Server Action to fetch interaction scenarios.
 * The core logic is wrapped with `withAuthCheck` to handle authentication errors centrally.
 */
export default async function getInteractionScenarios(params) {
    return withAuthCheck(async () => {
        try {
            const resp = await InteractionScenarioService.getInteractionScenarios(params)
            return {
                success: true,
                data: resp.data || [], // Ensure data is always an array
                total: resp.total || 0, // Ensure total is always a number
                current_page: resp.current_page || 1,
                per_page: resp.per_page || 10,
            }
        } catch (error) {
            console.error("Error fetching interaction scenarios:", error)
            return {
                success: false,
                message: "An unexpected error occurred while fetching interaction scenarios.",
                data: [],
                total: 0,
            }
        }
    })
}