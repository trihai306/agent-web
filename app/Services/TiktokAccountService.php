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
        return (new BaseQuery($this->repository->getModel()->newQuery(), $request))->paginate();
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
}
