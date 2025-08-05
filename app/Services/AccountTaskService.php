<?php

namespace App\Services;

use App\Models\AccountTask;
use App\Queries\BaseQuery;
use App\Repositories\AccountTaskRepositoryInterface;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

class AccountTaskService
{
    protected $accountTaskRepository;

    public function __construct(AccountTaskRepositoryInterface $accountTaskRepository)
    {
        $this->accountTaskRepository = $accountTaskRepository;
    }

    public function getAll(Request $request): LengthAwarePaginator
    {
        $query = $this->accountTaskRepository->getModel()->query();
        return BaseQuery::for($query, $request)->paginate();
    }

    public function getById(int $id): ?AccountTask
    {
        return $this->accountTaskRepository->find($id);
    }

    public function create(array $data): AccountTask
    {
        return $this->accountTaskRepository->create($data);
    }

    public function update(AccountTask $accountTask, array $data): AccountTask
    {
        $this->accountTaskRepository->update($accountTask, $data);
        return $accountTask->fresh();
    }

    public function delete(AccountTask $accountTask): bool
    {
        return $this->accountTaskRepository->delete($accountTask);
    }
}
