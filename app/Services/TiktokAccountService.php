<?php

namespace App\Services;

use App\Models\TiktokAccount;
use App\Models\AccountTask;
use App\Queries\BaseQuery;
use App\Repositories\TiktokAccountRepositoryInterface;
use Illuminate\Http\Request;
use Carbon\Carbon;

class TiktokAccountService
{
    protected $repository;

    public function __construct(TiktokAccountRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function getAll(Request $request)
    {
        $query = $this->repository->getModel()->newQuery();
        
        // Chỉ đếm pending tasks
        $query->withCount([
            'pendingTasks as pending_tasks_count'
        ]);

        // Load scenario của account và pending tasks với device
        $query->with([
            'interactionScenario', // Scenario của account
            'pendingTasks' => function($query) {
                $query->with(['device'])
                      ->orderBy('priority', 'desc')
                      ->orderBy('created_at', 'asc');
            }
        ]);

        // Xử lý filter theo task status (chỉ pending)
        $this->applyTaskFilters($query, $request);

        $result = (new BaseQuery($query, $request))->paginate();
        
        // Thêm thông tin phân tích task cho mỗi account
        if ($result->items()) {
            $result->getCollection()->transform(function ($account) {
                return $this->addTaskAnalysis($account);
            });
        }
        
        return $result;
    }

    /**
     * Apply task-related filters to the query (chỉ cho pending tasks)
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param Request $request
     * @return void
     */
    private function applyTaskFilters($query, Request $request)
    {
        // Filter theo has_pending_tasks
        if ($request->has('filter.has_pending_tasks')) {
            $hasPendingTasks = filter_var($request->input('filter.has_pending_tasks'), FILTER_VALIDATE_BOOLEAN);
            if ($hasPendingTasks) {
                $query->whereHas('pendingTasks');
            } else {
                $query->whereDoesntHave('pendingTasks');
            }
        }

        // Filter theo task_type trong pending tasks
        if ($request->has('filter.pending_task_type')) {
            $taskType = $request->input('filter.pending_task_type');
            $query->whereHas('pendingTasks', function($q) use ($taskType) {
                $q->where('task_type', $taskType);
            });
        }

        // Filter theo priority trong pending tasks
        if ($request->has('filter.pending_task_priority')) {
            $priority = $request->input('filter.pending_task_priority');
            $query->whereHas('pendingTasks', function($q) use ($priority) {
                $q->where('priority', $priority);
            });
        }

        // Filter theo device_id trong pending tasks
        if ($request->has('filter.pending_task_device_id')) {
            $deviceId = $request->input('filter.pending_task_device_id');
            $query->whereHas('pendingTasks', function($q) use ($deviceId) {
                $q->where('device_id', $deviceId);
            });
        }

        // Filter theo scenario_id của account
        if ($request->has('filter.scenario_id')) {
            $scenarioId = $request->input('filter.scenario_id');
            $query->where('scenario_id', $scenarioId);
        }

        // Filter theo task_status (chỉ pending hoặc no_pending)
        if ($request->has('filter.task_status')) {
            $taskStatus = $request->input('filter.task_status');
            
            switch ($taskStatus) {
                case 'pending':
                    $query->whereHas('pendingTasks');
                    break;
                    
                case 'no_pending':
                    $query->whereDoesntHave('pendingTasks');
                    break;
            }
        }
    }

    /**
     * Create a new tiktok account
     *
     * @param array $data
     * @return TiktokAccount
     */
    public function createTiktokAccount(array $data)
    {
        return $this->repository->create($data);
    }

    /**
     * Update a tiktok account
     *
     * @param TiktokAccount $tiktokAccount
     * @param array $data
     * @return TiktokAccount
     */
    public function updateTiktokAccount(TiktokAccount $tiktokAccount, array $data)
    {
        return $this->repository->update($tiktokAccount, $data);
    }

    /**
     * Delete a tiktok account
     *
     * @param TiktokAccount $tiktokAccount
     * @return bool
     */
    public function deleteTiktokAccount(TiktokAccount $tiktokAccount)
    {
        return $this->repository->delete($tiktokAccount);
    }

    /**
     * Delete multiple tiktok accounts
     *
     * @param array $ids
     * @return int
     */
    public function deleteMultiple(array $ids)
    {
        return $this->repository->deleteMultiple($ids);
    }

    /**
     * Update status for multiple tiktok accounts
     *
     * @param array $ids
     * @param string $status
     * @return int
     */
    public function updateStatusMultiple(array $ids, string $status)
    {
        return $this->repository->updateStatusMultiple($ids, $status);
    }

    /**
     * Import multiple tiktok accounts from formatted string
     *
     * @param array $data
     * @return array
     */
    public function importAccounts(array $data)
    {
        $accountList = $data['accountList'];
        $lines = explode("\n", $accountList);
        $importedCount = 0;
        $errors = [];
        $processedAccounts = [];

        foreach ($lines as $index => $line) {
            $line = trim($line);
            if (empty($line)) {
                continue;
            }

            try {
                // Parse line theo format: uid|password|2fa (optional)|email (optional)
                $parts = explode('|', $line);
                
                if (count($parts) < 2) {
                    $errors[] = "Dòng " . ($index + 1) . ": Format không đúng (cần ít nhất uid|password)";
                    continue;
                }

                $uid = trim($parts[0]);
                $password = trim($parts[1]);
                $twoFa = isset($parts[2]) ? trim($parts[2]) : '';
                $email = isset($parts[3]) ? trim($parts[3]) : $uid . '@tiktok.com';

                // Kiểm tra tài khoản đã tồn tại chưa
                $existingAccount = TiktokAccount::where('username', $uid)
                    ->orWhere('email', $email)
                    ->first();

                if ($existingAccount) {
                    $errors[] = "Tài khoản {$uid} đã tồn tại";
                    continue;
                }

                // Tạo tài khoản mới
                $accountData = [
                    'user_id' => auth()->id(), // Thêm user_id của user đang call API
                    'username' => $uid,
                    'email' => $email,
                    'password' => $password,
                    'status' => $data['enableRunningStatus'] ?? true ? 'active' : 'inactive',
                    'notes' => "Imported from line " . ($index + 1),
                ];

                // Thêm 2FA vào notes nếu có
                if (!empty($twoFa)) {
                    $accountData['notes'] .= " | 2FA: {$twoFa}";
                }

                $this->repository->create($accountData);
                $importedCount++;
                $processedAccounts[] = $uid;

            } catch (\Exception $e) {
                $errors[] = "Dòng " . ($index + 1) . ": " . $e->getMessage();
            }
        }

        return [
            'success' => true,
            'imported_count' => $importedCount,
            'total_count' => count(array_filter($lines)),
            'errors' => $errors,
            'processed_accounts' => $processedAccounts,
            'message' => "Đã nhập thành công {$importedCount} tài khoản" . (count($errors) > 0 ? " với " . count($errors) . " lỗi" : "")
        ];
    }

    /**
     * Get TikTok account statistics
     *
     * @param \App\Models\User $user
     * @return array
     */
    public function getStatistics($user)
    {
        $query = TiktokAccount::query();
        
        // Nếu không phải admin, chỉ lấy tài khoản của user hiện tại
        if (!$user->hasRole('admin')) {
            $query->where('user_id', $user->id);
        }

        // Lấy thống kê hiện tại
        $totalAccounts = $query->count();
        $activeAccounts = (clone $query)->where('status', 'active')->count();
        $inactiveAccounts = (clone $query)->where('status', 'inactive')->count();
        $suspendedAccounts = (clone $query)->where('status', 'suspended')->count();

        // Tính toán running tasks (giả sử có bảng account_tasks hoặc tương tự)
        // Tạm thời sử dụng active accounts làm running tasks
        $runningTasks = $activeAccounts;

        // Lấy thống kê tháng trước để tính % thay đổi
        $lastMonth = now()->subMonth();
        $lastMonthQuery = TiktokAccount::query()
            ->where('created_at', '<=', $lastMonth->endOfMonth());
            
        if (!$user->hasRole('admin')) {
            $lastMonthQuery->where('user_id', $user->id);
        }

        $lastMonthTotal = $lastMonthQuery->count();
        $lastMonthActive = (clone $lastMonthQuery)->where('status', 'active')->count();
        $lastMonthInactive = (clone $lastMonthQuery)->where('status', 'inactive')->count();
        $lastMonthRunning = $lastMonthActive; // Tạm thời

        // Tính % thay đổi
        $totalChange = $this->calculatePercentageChange($lastMonthTotal, $totalAccounts);
        $activeChange = $this->calculatePercentageChange($lastMonthActive, $activeAccounts);
        $inactiveChange = $this->calculatePercentageChange($lastMonthInactive, $inactiveAccounts);
        $runningChange = $this->calculatePercentageChange($lastMonthRunning, $runningTasks);

        return [
            'totalAccounts' => $totalAccounts,
            'activeAccounts' => $activeAccounts,
            'inactiveAccounts' => $inactiveAccounts,
            'suspendedAccounts' => $suspendedAccounts,
            'runningTasks' => $runningTasks,
            
            // Change data
            'totalAccountsChange' => $totalChange['percentage'],
            'totalAccountsChangeType' => $totalChange['type'],
            'activeAccountsChange' => $activeChange['percentage'],
            'activeAccountsChangeType' => $activeChange['type'],
            'inactiveAccountsChange' => $inactiveChange['percentage'],
            'inactiveAccountsChangeType' => $inactiveChange['type'],
            'runningTasksChange' => $runningChange['percentage'],
            'runningTasksChangeType' => $runningChange['type'],
        ];
    }

    /**
     * Calculate percentage change between two values
     *
     * @param int $oldValue
     * @param int $newValue
     * @return array
     */
    private function calculatePercentageChange($oldValue, $newValue)
    {
        if ($oldValue == 0) {
            if ($newValue > 0) {
                return ['percentage' => '+100%', 'type' => 'increase'];
            }
            return ['percentage' => null, 'type' => 'neutral'];
        }

        $change = (($newValue - $oldValue) / $oldValue) * 100;
        $changeRounded = round($change);

        if ($changeRounded > 0) {
            return ['percentage' => "+{$changeRounded}%", 'type' => 'increase'];
        } elseif ($changeRounded < 0) {
            return ['percentage' => "{$changeRounded}%", 'type' => 'decrease'];
        } else {
            return ['percentage' => "0%", 'type' => 'neutral'];
        }
    }

    /**
     * Get recent activities for user's TikTok accounts
     *
     * @param \App\Models\User $user
     * @return array
     */
    public function getRecentActivities($user)
    {
        // Get user's TikTok account IDs
        $accountIds = TiktokAccount::where('user_id', $user->id)->pluck('id');

        // Get recent account tasks
        $recentTasks = AccountTask::with(['tiktokAccount', 'interactionScenario'])
            ->whereIn('tiktok_account_id', $accountIds)
            ->orderBy('updated_at', 'desc')
            ->limit(10)
            ->get();

        $activities = [];
        
        foreach ($recentTasks as $task) {
            $timeAgo = $this->getTimeAgo($task->updated_at);
            $action = $this->getActionDescription($task);
            $status = $this->getStatusType($task->status);

            $activities[] = [
                'id' => $task->id,
                'username' => '@' . ($task->tiktokAccount->username ?? 'unknown'),
                'action' => $action,
                'status' => $status,
                'time' => $timeAgo,
                'scenario_name' => $task->interactionScenario->name ?? null,
                'task_type' => $task->task_type,
                'task_status' => $task->status
            ];
        }

        return $activities;
    }

    /**
     * Add task analysis information to TikTok account
     *
     * @param TiktokAccount $account
     * @return TiktokAccount
     */
    private function addTaskAnalysis($account)
    {
        // Chỉ xử lý pending tasks
        $pendingTasks = $account->pendingTasks ?? collect();
        $pendingTasksCount = $account->pending_tasks_count ?? 0;

        // Thông tin tổng quan về pending tasks
        $taskSummary = [
            'pending_tasks_count' => $pendingTasksCount,
            'has_pending_tasks' => $pendingTasksCount > 0,
        ];

        // Trạng thái hiện tại của account
        $currentStatus = $pendingTasksCount > 0 ? 'has_pending_tasks' : 'no_pending_tasks';

        // Thông tin scenario của account (1 account = 1 scenario)
        $accountScenario = null;
        if ($account->interactionScenario) {
            $accountScenario = [
                'id' => $account->interactionScenario->id,
                'name' => $account->interactionScenario->name,
                'description' => $account->interactionScenario->description ?? null,
            ];
        }

        // Thông tin chi tiết về pending tasks
        $pendingTasksInfo = [];
        $linkedDevices = [];
        
        foreach ($pendingTasks as $task) {
            $pendingTasksInfo[] = [
                'id' => $task->id,
                'task_type' => $task->task_type,
                'priority' => $task->priority,
                'created_at' => $task->created_at,
                'scheduled_at' => $task->scheduled_at,
                'parameters' => $task->parameters,
                'retry_count' => $task->retry_count,
                'max_retries' => $task->max_retries,
                'device' => $task->device ? [
                    'id' => $task->device->id,
                    'name' => $task->device->name,
                    'device_id' => $task->device->device_id ?? null,
                    'status' => $task->device->status ?? null,
                ] : null,
            ];

            // Thu thập thông tin devices liên kết
            if ($task->device && !in_array($task->device->id, array_column($linkedDevices, 'id'))) {
                $linkedDevices[] = [
                    'id' => $task->device->id,
                    'name' => $task->device->name,
                    'device_id' => $task->device->device_id ?? null,
                    'status' => $task->device->status ?? null,
                ];
            }
        }

        // Thêm thông tin phân tích vào account
        $account->task_analysis = [
            'summary' => $taskSummary,
            'current_status' => $currentStatus,
            'account_scenario' => $accountScenario, // Scenario của account
            'pending_tasks' => $pendingTasksInfo,
            'linked_devices' => $linkedDevices,
            'next_task' => $pendingTasksInfo[0] ?? null, // Task có priority cao nhất
        ];

        return $account;
    }

    /**
     * Determine account task status based on current tasks
     *
     * @param TiktokAccount $account
     * @return string
     */
    private function determineAccountTaskStatus($account)
    {
        if ($account->running_tasks_count > 0) {
            return 'running';
        }
        
        if ($account->pending_tasks_count > 0) {
            return 'pending';
        }
        
        if ($account->total_tasks_count == 0) {
            return 'no_tasks';
        }
        
        // Kiểm tra task gần nhất
        $latestTask = $account->accountTasks->first();
        if ($latestTask) {
            switch ($latestTask->status) {
                case 'completed':
                    return 'idle_completed';
                case 'failed':
                    return 'idle_failed';
                case 'cancelled':
                    return 'idle_cancelled';
                default:
                    return 'idle';
            }
        }
        
        return 'idle';
    }

    /**
     * Get human readable action description
     *
     * @param AccountTask $task
     * @return string
     */
    private function getActionDescription($task)
    {
        $scenarioName = $task->interactionScenario->name ?? 'Kịch bản';
        
        switch ($task->status) {
            case 'pending':
                return "Chờ thực hiện {$scenarioName}";
            case 'running':
                return "Đang thực hiện {$scenarioName}";
            case 'completed':
                return "Hoàn thành {$scenarioName}";
            case 'failed':
                return "Lỗi khi thực hiện {$scenarioName}";
            case 'cancelled':
                return "Đã hủy {$scenarioName}";
            default:
                return "Thực hiện {$scenarioName}";
        }
    }

    /**
     * Get status type for UI
     *
     * @param string $status
     * @return string
     */
    private function getStatusType($status)
    {
        switch ($status) {
            case 'completed':
                return 'success';
            case 'failed':
                return 'error';
            case 'running':
                return 'running';
            case 'pending':
                return 'pending';
            case 'cancelled':
                return 'cancelled';
            default:
                return 'unknown';
        }
    }

    /**
     * Get time ago string
     *
     * @param Carbon $datetime
     * @return string
     */
    private function getTimeAgo($datetime)
    {
        $now = Carbon::now();
        $diff = $datetime->diffInMinutes($now);

        if ($diff < 1) {
            return 'Vừa xong';
        } elseif ($diff < 60) {
            return $diff . ' phút trước';
        } elseif ($diff < 1440) { // 24 hours
            $hours = floor($diff / 60);
            return $hours . ' giờ trước';
        } else {
            $days = floor($diff / 1440);
            return $days . ' ngày trước';
        }
    }

    /**
     * Get comprehensive task analysis for user's TikTok accounts
     *
     * @param \App\Models\User $user
     * @return array
     */
    public function getTaskAnalysis($user)
    {
        $accountQuery = TiktokAccount::query();
        
        // Nếu không phải admin, chỉ lấy tài khoản của user hiện tại
        if (!$user->hasRole('admin')) {
            $accountQuery->where('user_id', $user->id);
        }

        $accountIds = $accountQuery->pluck('id');
        
        // Task overview - thống kê accounts theo trạng thái task
        $totalAccounts = $accountQuery->count();
        
        $accountsWithPendingTasks = $accountQuery->whereHas('accountTasks', function($q) {
            $q->where('status', 'pending');
        })->count();
        
        $accountsWithRunningTasks = $accountQuery->whereHas('accountTasks', function($q) {
            $q->where('status', 'running');
        })->count();
        
        $accountsWithNoTasks = $accountQuery->whereDoesntHave('accountTasks')->count();
        
        $idleAccounts = $accountQuery->whereHas('accountTasks')
            ->whereDoesntHave('accountTasks', function($q) {
                $q->whereIn('status', ['running', 'pending']);
            })->count();

        // Task statistics - thống kê chi tiết về tasks
        $taskQuery = AccountTask::whereIn('tiktok_account_id', $accountIds);
        
        $totalPendingTasks = (clone $taskQuery)->where('status', 'pending')->count();
        $totalRunningTasks = (clone $taskQuery)->where('status', 'running')->count();
        $totalCompletedTasks = (clone $taskQuery)->where('status', 'completed')->count();
        $totalFailedTasks = (clone $taskQuery)->where('status', 'failed')->count();
        
        $totalFinishedTasks = $totalCompletedTasks + $totalFailedTasks;
        $averageSuccessRate = $totalFinishedTasks > 0 
            ? round(($totalCompletedTasks / $totalFinishedTasks) * 100, 1)
            : 0;

        // Task distribution - phân bố theo loại task
        $taskDistribution = (clone $taskQuery)
            ->selectRaw('task_type, COUNT(*) as count')
            ->groupBy('task_type')
            ->orderByDesc('count')
            ->get()
            ->map(function($item) use ($taskQuery) {
                $totalTasks = $taskQuery->count();
                $percentage = $totalTasks > 0 ? round(($item->count / $totalTasks) * 100, 1) : 0;
                
                return [
                    'task_type' => $item->task_type,
                    'count' => $item->count,
                    'percentage' => $percentage
                ];
            });

        // Priority distribution - phân bố theo độ ưu tiên
        $priorityDistribution = (clone $taskQuery)
            ->selectRaw('priority, COUNT(*) as count')
            ->groupBy('priority')
            ->get()
            ->map(function($item) use ($taskQuery) {
                $totalTasks = $taskQuery->count();
                $percentage = $totalTasks > 0 ? round(($item->count / $totalTasks) * 100, 1) : 0;
                
                return [
                    'priority' => $item->priority,
                    'count' => $item->count,
                    'percentage' => $percentage
                ];
            });

        // Recent task trends - xu hướng task trong 7 ngày qua
        $recentTrends = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $dayTasks = (clone $taskQuery)
                ->whereDate('created_at', $date->toDateString())
                ->count();
                
            $recentTrends[] = [
                'date' => $date->format('Y-m-d'),
                'day_name' => $date->format('l'),
                'task_count' => $dayTasks
            ];
        }

        return [
            'task_overview' => [
                'total_accounts' => $totalAccounts,
                'accounts_with_pending_tasks' => $accountsWithPendingTasks,
                'accounts_with_running_tasks' => $accountsWithRunningTasks,
                'accounts_with_no_tasks' => $accountsWithNoTasks,
                'idle_accounts' => $idleAccounts,
                'active_accounts' => $accountsWithPendingTasks + $accountsWithRunningTasks,
            ],
            'task_statistics' => [
                'total_pending_tasks' => $totalPendingTasks,
                'total_running_tasks' => $totalRunningTasks,
                'total_completed_tasks' => $totalCompletedTasks,
                'total_failed_tasks' => $totalFailedTasks,
                'total_tasks' => $taskQuery->count(),
                'average_success_rate' => $averageSuccessRate,
            ],
            'task_distribution' => $taskDistribution,
            'priority_distribution' => $priorityDistribution,
            'recent_trends' => $recentTrends,
        ];
    }
}
