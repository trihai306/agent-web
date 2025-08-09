<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TiktokAccount;
use App\Services\TiktokAccountService;
use Dedoc\Scramble\Attributes\Group;
use Dedoc\Scramble\Attributes\QueryParameter;
use Illuminate\Http\Request;

/**
 * APIs for managing Tiktok Accounts.
 * @authenticated
 */
#[Group('Tiktok Account Management')]
class TiktokAccountController extends Controller
{
    protected $tiktokAccountService;

    public function __construct(TiktokAccountService $tiktokAccountService)
    {
        $this->tiktokAccountService = $tiktokAccountService;
    }

    /**
     * List all tiktok accounts
     *
     * Retrieve a paginated list of all tiktok accounts.
     * Supports searching, filtering, and sorting.
     *
     * @response \Illuminate\Pagination\LengthAwarePaginator<\App\Models\TiktokAccount>
     */
    #[QueryParameter('search', description: 'A search term to filter tiktok accounts by username or email.', example: 'user123')]
    #[QueryParameter('filter[user_id]', description: 'Filter tiktok accounts by user ID.', example: 1)]
    #[QueryParameter('filter[username]', description: 'Filter tiktok accounts by username.', example: 'user123')]
    #[QueryParameter('filter[email]', description: 'Filter tiktok accounts by email.', example: 'user@example.com')]
    #[QueryParameter('filter[status]', description: 'Filter tiktok accounts by status.', example: 'active')]
    #[QueryParameter('filter[task_status]', description: 'Filter tiktok accounts by task status: pending, no_pending.', example: 'pending')]
    #[QueryParameter('filter[has_pending_tasks]', description: 'Filter accounts that have pending tasks (true/false).', example: 'true')]
    #[QueryParameter('filter[pending_task_type]', description: 'Filter accounts by pending task type.', example: 'follow_user')]
    #[QueryParameter('filter[pending_task_priority]', description: 'Filter accounts by pending task priority: low, medium, high.', example: 'high')]
    #[QueryParameter('filter[pending_task_device_id]', description: 'Filter accounts by device ID in pending tasks.', example: '123')]
    #[QueryParameter('filter[scenario_id]', description: 'Filter accounts by their assigned scenario ID.', example: '456')]
    #[QueryParameter('sort', description: 'Sort tiktok accounts by `username`, `email`, `created_at`, `pending_tasks_count`. Prefix with `-` for descending.', example: '-pending_tasks_count')]
    #[QueryParameter('page', description: 'The page number for pagination.', example: 2)]
    #[QueryParameter('per_page', description: 'The number of items per page.', example: 25)]
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Nếu không phải admin, tự động filter theo user hiện tại
        if (!$user->hasRole('admin')) {
            $request->merge(['user_id' => $user->id]);
        }
        
        $result = $this->tiktokAccountService->getAll($request);
        return response()->json($result);
    }

    /**
     * Create a new tiktok account
     *
     * Creates a new tiktok account with the given details.
     * The new tiktok account object is returned upon successful creation.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            /**
             * The username of the tiktok account.
             * @example user123
             */
            'username' => ['required', 'string', 'max:255', 'unique:tiktok_accounts'],
            /**
             * The email associated with the tiktok account.
             * @example user@example.com
             */
            'email' => ['required', 'string', 'email', 'max:255', 'unique:tiktok_accounts'],
            /**
             * The password for the tiktok account.
             * @example password123
             */
            'password' => ['required', 'string', 'min:6'],
            /**
             * The phone number associated with the tiktok account.
             * @example 0987654321
             */
            'phone_number' => ['sometimes', 'string', 'max:255'],
            /**
             * The status of the tiktok account.
             * @example active
             */
            'status' => ['sometimes', 'string', 'in:active,inactive,suspended'],
            /**
             * Additional notes about the tiktok account.
             * @example Personal account for content creation
             */
            'notes' => ['sometimes', 'string', 'max:1000'],
        ]);

        $tiktokAccount = $this->tiktokAccountService->createTiktokAccount($validated);

        return response()->json($tiktokAccount, 201);
    }

    /**
     * Get a specific tiktok account
     *
     * Retrieves the details of a specific tiktok account by their ID.
     * Includes related data like pending tasks, running tasks, and statistics.
     * @param  TiktokAccount  $tiktokAccount The tiktok account model instance.
     */
    public function show(TiktokAccount $tiktokAccount)
    {
        $user = request()->user();
        if (!$user->hasRole('admin') && $tiktokAccount->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Load relationships and additional data
        $tiktokAccount->load([
            'pendingTasks' => function($query) {
                $query->select('id', 'tiktok_account_id', 'task_type', 'status', 'priority', 'scheduled_at', 'created_at')
                      ->orderBy('created_at', 'desc')
                      ->limit(10);
            },
            'runningTasks' => function($query) {
                $query->select('id', 'tiktok_account_id', 'task_type', 'status', 'priority', 'started_at', 'created_at')
                      ->orderBy('created_at', 'desc')
                      ->limit(10);
            },
            'interactionScenario:id,name'
        ]);

        // Add computed fields
        $accountData = $tiktokAccount->toArray();
        
        // Add task statistics
        $accountData['task_statistics'] = [
            'pending_tasks_count' => $tiktokAccount->pendingTasks->count(),
            'running_tasks_count' => $tiktokAccount->runningTasks->count(),
            'total_tasks_count' => $tiktokAccount->accountTasks()->count(),
            'completed_tasks_count' => $tiktokAccount->accountTasks()->where('status', 'completed')->count(),
            'failed_tasks_count' => $tiktokAccount->accountTasks()->where('status', 'failed')->count(),
        ];

        // Add formatted dates
        $accountData['join_date'] = $tiktokAccount->created_at->format('d/m/Y');
        $accountData['last_activity'] = $tiktokAccount->last_activity_at ? 
            $tiktokAccount->last_activity_at->diffForHumans() : 'Chưa có hoạt động';

        // Add display name (use nickname or username)
        $accountData['display_name'] = $tiktokAccount->nickname ?: $tiktokAccount->username;

        // Add view count estimation (since it's not in DB, we can estimate or set default)
        $accountData['estimated_views'] = $tiktokAccount->video_count * 1000; // Simple estimation

        return response()->json($accountData);
    }

    /**
     * Update a tiktok account
     *
     * Updates the details of a specific tiktok account.
     * @param  TiktokAccount  $tiktokAccount The tiktok account to update.
     */
    public function update(Request $request, TiktokAccount $tiktokAccount)
    {
        $user = $request->user();
        if (!$user->hasRole('admin') && $tiktokAccount->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            /**
             * The new username of the tiktok account.
             * @example newuser123
             */
            'username' => 'sometimes|string|max:255|unique:tiktok_accounts,username,'.$tiktokAccount->id,
            /**
             * The new email associated with the tiktok account.
             * @example newuser@example.com
             */
            'email' => 'sometimes|string|email|max:255|unique:tiktok_accounts,email,'.$tiktokAccount->id,
            /**
             * The new password for the tiktok account.
             * @example newpassword123
             */
            'password' => 'sometimes|string|min:6',
            /**
             * The new phone number associated with the tiktok account.
             * @example 0123456789
             */
            'phone_number' => 'sometimes|string|max:255',
            /**
             * The new status of the tiktok account.
             * @example inactive
             */
            'status' => 'sometimes|string|in:active,inactive,suspended',
            /**
             * Additional notes about the tiktok account.
             * @example Updated notes about the account
             */
            'notes' => 'sometimes|string|max:1000',
        ]);

        $updatedTiktokAccount = $this->tiktokAccountService->updateTiktokAccount($tiktokAccount, $validated);

        return response()->json($updatedTiktokAccount);
    }

    /**
     * Delete a tiktok account
     *
     * Deletes a specific tiktok account.
     * @param  TiktokAccount  $tiktokAccount The tiktok account to delete.
     */
    public function destroy(TiktokAccount $tiktokAccount)
    {
        $user = request()->user();
        if (!$user->hasRole('admin') && $tiktokAccount->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $this->tiktokAccountService->deleteTiktokAccount($tiktokAccount);

        return response()->json(null, 204);
    }

    /**
     * Delete multiple tiktok accounts
     *
     * Deletes a list of tiktok accounts by their IDs.
     */
    public function bulkDelete(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:tiktok_accounts,id',
        ]);

        $count = $this->tiktokAccountService->deleteMultiple($validated['ids']);

        return response()->json(['message' => "Successfully deleted {$count} tiktok accounts."]);
    }

    /**
     * Update status for multiple tiktok accounts
     *
     * Updates the status for a list of tiktok accounts.
     */
    public function bulkUpdateStatus(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:tiktok_accounts,id',
            'status' => 'required|string|in:active,inactive,suspended',
        ]);

        $count = $this->tiktokAccountService->updateStatusMultiple($validated['ids'], $validated['status']);

        return response()->json(['message' => "Successfully updated {$count} tiktok accounts to status '{$validated['status']}'."]);
    }

    /**
     * Import multiple tiktok accounts
     *
     * Creates new tiktok accounts from a formatted string.
     */
    public function import(Request $request)
    {
        $validated = $request->validate([
            'accountList' => 'required|string',
            'enableRunningStatus' => 'sometimes|boolean',
            'autoAssign' => 'sometimes|boolean',
            'deviceId' => 'sometimes|string|exists:devices,id',
            'scenarioId' => 'sometimes|string|exists:interaction_scenarios,id',
        ]);

        $result = $this->tiktokAccountService->importAccounts($validated);

        return response()->json($result);
    }

    /**
     * Get TikTok account statistics
     *
     * Retrieves statistical data about TikTok accounts including totals, 
     * active/inactive counts, running tasks, and percentage changes.
     * 
     * @response {
     *   "data": {
     *     "totalAccounts": 156,
     *     "activeAccounts": 142,
     *     "inactiveAccounts": 14,
     *     "runningTasks": 23,
     *     "totalAccountsChange": "+12%",
     *     "totalAccountsChangeType": "increase",
     *     "activeAccountsChange": "+5%",
     *     "activeAccountsChangeType": "increase",
     *     "inactiveAccountsChange": "-8%",
     *     "inactiveAccountsChangeType": "decrease",
     *     "runningTasksChange": "+15%",
     *     "runningTasksChangeType": "increase"
     *   }
     * }
     */
    public function stats(Request $request)
    {
        $user = $request->user();
        
        $stats = $this->tiktokAccountService->getStatistics($user);
        
        return response()->json([
            'data' => $stats
        ]);
    }

    /**
     * Get TikTok account task analysis
     *
     * Retrieves detailed task analysis for TikTok accounts including 
     * pending tasks, running tasks, and task distribution statistics.
     * 
     * @response {
     *   "data": {
     *     "task_overview": {
     *       "total_accounts": 156,
     *       "accounts_with_pending_tasks": 23,
     *       "accounts_with_running_tasks": 12,
     *       "accounts_with_no_tasks": 45,
     *       "idle_accounts": 76
     *     },
     *     "task_statistics": {
     *       "total_pending_tasks": 89,
     *       "total_running_tasks": 34,
     *       "total_completed_tasks": 1245,
     *       "total_failed_tasks": 67,
     *       "average_success_rate": 94.9
     *     },
     *     "task_distribution": [
     *       {"task_type": "follow_user", "count": 45, "percentage": 35.2},
     *       {"task_type": "like_video", "count": 32, "percentage": 25.0}
     *     ]
     *   }
     * }
     */
    public function taskAnalysis(Request $request)
    {
        $user = $request->user();
        
        $analysis = $this->tiktokAccountService->getTaskAnalysis($user);
        
        return response()->json([
            'data' => $analysis
        ]);
    }
}
