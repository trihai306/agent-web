<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AccountTask;
use App\Services\AccountTaskService;
use Dedoc\Scramble\Attributes\Group;
use Illuminate\Http\Request;

/**
 * APIs for managing Account Tasks.
 * @authenticated
 */
#[Group('Account Task Management')]
class AccountTaskController extends Controller
{
    protected $accountTaskService;

    public function __construct(AccountTaskService $accountTaskService)
    {
        $this->accountTaskService = $accountTaskService;
    }

    /**
     * List all account tasks
     *
     * Retrieve a paginated list of all account tasks.
     * Supports searching, filtering, and sorting.
     *
     * @response \Illuminate\Pagination\LengthAwarePaginator<App\Models\AccountTask>
     */
    public function index(Request $request)
    {
        return response()->json($this->accountTaskService->getAll($request));
    }

    /**
     * Create a new account task
     *
     * Creates a new account task with the given details.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'tiktok_account_id' => 'required|exists:tiktok_accounts,id',
            'interaction_scenario_id' => 'nullable|exists:interaction_scenarios,id',
            'device_id' => 'nullable|exists:devices,id',
            'task_type' => 'required|string',
            'parameters' => 'nullable|json',
            'priority' => 'sometimes|in:low,medium,high',
            'status' => 'sometimes|in:pending,running,completed,failed',
            'scheduled_at' => 'nullable|date',
        ]);

        $task = $this->accountTaskService->create($validated);

        return response()->json($task, 201);
    }

    /**
     * Get a specific account task
     *
     * Retrieves the details of a specific account task by its ID.
     */
    public function show(AccountTask $accountTask)
    {
        return response()->json($accountTask);
    }

    /**
     * Update an account task
     *
     * Updates the details of a specific account task.
     */
    public function update(Request $request, AccountTask $accountTask)
    {
        $validated = $request->validate([
            'interaction_scenario_id' => 'nullable|exists:interaction_scenarios,id',
            'device_id' => 'nullable|exists:devices,id',
            'task_type' => 'sometimes|string',
            'parameters' => 'nullable|json',
            'priority' => 'sometimes|in:low,medium,high',
            'status' => 'sometimes|in:pending,running,completed,failed',
            'result' => 'nullable|json',
            'error_message' => 'nullable|string',
            'retry_count' => 'sometimes|integer',
            'max_retries' => 'sometimes|integer',
            'scheduled_at' => 'nullable|date',
            'started_at' => 'nullable|date',
            'completed_at' => 'nullable|date',
        ]);

        $updatedTask = $this->accountTaskService->update($accountTask, $validated);

        return response()->json($updatedTask);
    }

    /**
     * Delete an account task
     *
     * Deletes a specific account task.
     */
    public function destroy(AccountTask $accountTask)
    {
        $this->accountTaskService->delete($accountTask);

        return response()->json(null, 204);
    }
}
