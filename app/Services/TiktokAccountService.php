<?php

namespace App\Services;

use App\Models\TiktokAccount;
use App\Queries\BaseQuery;
use App\Repositories\TiktokAccountRepositoryInterface;
use Illuminate\Http\Request;

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
}
