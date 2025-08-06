<?php

namespace App\Services;

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
        return (new BaseQuery($this->repository, $request))->paginate();
    }
}
