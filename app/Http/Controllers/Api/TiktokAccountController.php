<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\TiktokAccountService;
use Dedoc\Scramble\Attributes\Group;
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
    public function index(Request $request)
    {
        return response()->json($this->tiktokAccountService->getAll($request));
    }
}
