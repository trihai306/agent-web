<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\BaseRepositoryInterface;
use App\Repositories\Eloquent\BaseRepository;
use App\Repositories\UserRepositoryInterface;
use App\Repositories\Eloquent\UserRepository;
use App\Repositories\AISpendingHistoryRepositoryInterface;
use App\Repositories\Eloquent\AISpendingHistoryRepository;
use App\Repositories\Notification\NotificationRepository;
use App\Repositories\Notification\NotificationRepositoryInterface;
use App\Repositories\RoleRepositoryInterface;
use App\Repositories\Eloquent\RoleRepository;
use App\Repositories\PermissionRepositoryInterface;
use App\Repositories\Eloquent\PermissionRepository;
use App\Repositories\TransactionRepositoryInterface;
use App\Repositories\Eloquent\TransactionRepository;
use App\Repositories\TransactionAnalyticRepositoryInterface;
use App\Repositories\Eloquent\TransactionAnalyticRepository;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind(BaseRepositoryInterface::class, BaseRepository::class);
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);
        $this->app->bind(AISpendingHistoryRepositoryInterface::class, AISpendingHistoryRepository::class);
        $this->app->bind(NotificationRepositoryInterface::class, NotificationRepository::class);
        $this->app->bind(RoleRepositoryInterface::class, RoleRepository::class);
        $this->app->bind(PermissionRepositoryInterface::class, PermissionRepository::class);
        $this->app->bind(TransactionRepositoryInterface::class, TransactionRepository::class);
        $this->app->bind(TransactionAnalyticRepositoryInterface::class, TransactionAnalyticRepository::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
