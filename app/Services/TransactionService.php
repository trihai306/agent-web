<?php

namespace App\Services;

use App\Exceptions\InsufficientFundsException;
use App\Models\User;
use App\Queries\BaseQuery;
use App\Repositories\TransactionRepositoryInterface;
use App\Repositories\UserRepositoryInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TransactionService
{
    protected $transactionRepository;
    protected $userRepository;

    public function __construct(TransactionRepositoryInterface $transactionRepository, UserRepositoryInterface $userRepository)
    {
        $this->transactionRepository = $transactionRepository;
        $this->userRepository = $userRepository;
    }

    public function deposit(User $user, float $amount, string $description): \App\Models\Transaction
    {
        return DB::transaction(function () use ($user, $amount, $description) {
            $user->increment('balance', $amount);

            return $this->transactionRepository->create([
                'user_id' => $user->id,
                'type' => 'deposit',
                'amount' => $amount,
                'description' => $description,
            ]);
        });
    }

    public function withdrawal(User $user, float $amount, string $description): \App\Models\Transaction
    {
        return DB::transaction(function () use ($user, $amount, $description) {
            if ($user->balance < $amount) {
                throw new InsufficientFundsException('Insufficient funds for this withdrawal.');
            }

            $user->decrement('balance', $amount);

            return $this->transactionRepository->create([
                'user_id' => $user->id,
                'type' => 'withdrawal',
                'amount' => $amount,
                'description' => $description,
            ]);
        });
    }

    public function getHistory(User $user, Request $request)
    {
        $query = $this->transactionRepository->getModel()->query()->where('user_id', $user->id);

        if (!$request->has('sort')) {
            $query->latest();
        }

        return BaseQuery::for($query, $request)->paginate();
    }

    public function getAllTransactions(Request $request)
    {
        $query = $this->transactionRepository->getModel()->query()->with('user');

        if (!$request->has('sort')) {
            $query->latest();
        }

        return BaseQuery::for($query, $request)->paginate();
    }

    public function getTransactionById(int $id): ?\App\Models\Transaction
    {
        return $this->transactionRepository->find($id, ['user']);
    }

    public function deleteTransaction(int $id): bool
    {
        return $this->transactionRepository->delete($id);
    }

    public function deleteMultipleTransactions(array $ids): int
    {
        return $this->transactionRepository->deleteByIds($ids);
    }
}
