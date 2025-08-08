<?php

namespace App\Http\Controllers;

use App\Events\NotificationSent;
use App\Events\TiktokAccountUpdated;
use App\Events\TransactionStatusChanged;
use App\Models\TiktokAccount;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RealtimeTestController extends Controller
{
    /**
     * Send a test notification
     */
    public function sendTestNotification(Request $request)
    {
        $notification = [
            'id' => uniqid(),
            'title' => $request->input('title', 'Test Notification'),
            'message' => $request->input('message', 'This is a test real-time notification'),
            'type' => $request->input('type', 'info'),
        ];

        $userId = $request->input('user_id', Auth::id());

        event(new NotificationSent($notification, $userId));

        return response()->json([
            'success' => true,
            'message' => 'Test notification sent successfully',
            'notification' => $notification,
        ]);
    }

    /**
     * Send a broadcast notification to all users
     */
    public function sendBroadcastNotification(Request $request)
    {
        $notification = [
            'id' => uniqid(),
            'title' => $request->input('title', 'Broadcast Notification'),
            'message' => $request->input('message', 'This is a broadcast notification to all users'),
            'type' => $request->input('type', 'announcement'),
        ];

        // Send to public channel (no specific user)
        event(new NotificationSent($notification));

        return response()->json([
            'success' => true,
            'message' => 'Broadcast notification sent successfully',
            'notification' => $notification,
        ]);
    }

    /**
     * Simulate TikTok account update
     */
    public function simulateTiktokAccountUpdate(Request $request)
    {
        $accountId = $request->input('account_id');
        
        if (!$accountId) {
            // Get first available account or create a mock one
            $account = TiktokAccount::first();
            if (!$account) {
                return response()->json([
                    'error' => 'No TikTok accounts found. Please provide account_id or create an account first.',
                ], 404);
            }
        } else {
            $account = TiktokAccount::find($accountId);
            if (!$account) {
                return response()->json([
                    'error' => 'TikTok account not found.',
                ], 404);
            }
        }

        // Simulate some changes
        $changes = [
            'followers_count' => $account->followers_count + rand(1, 100),
            'status' => $request->input('status', 'active'),
        ];

        // Update the account
        $account->update($changes);

        // Broadcast the update
        event(new TiktokAccountUpdated($account, $changes));

        return response()->json([
            'success' => true,
            'message' => 'TikTok account update broadcasted successfully',
            'account' => $account,
            'changes' => $changes,
        ]);
    }

    /**
     * Simulate transaction status change
     */
    public function simulateTransactionStatusChange(Request $request)
    {
        $transactionId = $request->input('transaction_id');
        
        if (!$transactionId) {
            // Get first available transaction
            $transaction = Transaction::first();
            if (!$transaction) {
                return response()->json([
                    'error' => 'No transactions found. Please provide transaction_id or create a transaction first.',
                ], 404);
            }
        } else {
            $transaction = Transaction::find($transactionId);
            if (!$transaction) {
                return response()->json([
                    'error' => 'Transaction not found.',
                ], 404);
            }
        }

        $oldStatus = $transaction->status;
        $newStatus = $request->input('status', 'completed');

        // Update transaction status
        $transaction->update(['status' => $newStatus]);

        // Broadcast the status change
        event(new TransactionStatusChanged($transaction, $oldStatus, $newStatus));

        return response()->json([
            'success' => true,
            'message' => 'Transaction status change broadcasted successfully',
            'transaction' => $transaction,
            'status_change' => [
                'from' => $oldStatus,
                'to' => $newStatus,
            ],
        ]);
    }

    /**
     * Get Reverb connection info for frontend
     */
    public function getConnectionInfo()
    {
        return response()->json([
            'reverb' => [
                'host' => config('reverb.servers.reverb.hostname', 'localhost'),
                'port' => config('reverb.servers.reverb.port', 8080),
                'scheme' => config('reverb.apps.apps.0.options.scheme', 'http'),
                'app_key' => config('reverb.apps.apps.0.key'),
                'cluster' => 'mt1', // Default cluster for Reverb
            ],
            'auth_endpoint' => url('/api/broadcasting/auth'),
        ]);
    }
}

