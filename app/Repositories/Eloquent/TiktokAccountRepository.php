<?php

namespace App\Repositories;

use App\Models\TiktokAccount;
use App\Repositories\Eloquent\BaseRepository;

class TiktokAccountRepository extends BaseRepository implements TiktokAccountRepositoryInterface
{
    public function __construct(TiktokAccount $model)
    {
        parent::__construct($model);
    }
}
