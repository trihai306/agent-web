<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Device;
use App\Services\DeviceService;
use Dedoc\Scramble\Attributes\Group;
use Illuminate\Http\Request;

/**
 * APIs for managing Devices.
 * @authenticated
 */
#[Group('Device Management')]
class DeviceController extends Controller
{
    protected $deviceService;

    public function __construct(DeviceService $deviceService)
    {
        $this->deviceService = $deviceService;
    }

    /**
     * List all devices
     *
     * Retrieve a paginated list of all devices.
     * Supports searching, filtering, and sorting.
     * Admin can see all devices, regular users can only see their own devices.
     *
     * @response \Illuminate\Pagination\LengthAwarePaginator<App\Models\Device>
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Nếu user là admin, hiển thị tất cả devices
        if ($user->hasRole('admin')) {
            return response()->json($this->deviceService->getAll($request));
        }
        
        // Nếu không phải admin, chỉ hiển thị devices của user đó
        $request->merge(['user_id' => $user->id]);
        return response()->json($this->deviceService->getAll($request));
    }

    /**
     * Create a new device
     *
     * Creates a new device with the given details.
     */
    public function store(Request $request)
    {
        $user = $request->user();
        
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'device_name' => 'required|string|max:255',
            'device_id' => 'required|string|unique:devices,device_id',
            'serial' => 'nullable|string',
            'plan' => 'nullable|string',
            'is_online' => 'sometimes|boolean',
            'proxy_id' => 'nullable|integer', // Add exists rule when Proxy model is ready
            'note' => 'nullable|string',
            'os_version' => 'nullable|string',
            'device_type' => 'nullable|string',
            'platform' => 'nullable|string',
            'app_version' => 'nullable|string',
            'ip_address' => 'nullable|ip',
            'user_agent' => 'nullable|string',
            'status' => 'sometimes|in:active,inactive,blocked',
        ]);

        // Kiểm tra quyền: chỉ admin mới có thể tạo device cho user khác
        if (!$user->hasRole('admin') && $validated['user_id'] != $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $device = $this->deviceService->create($validated);

        return response()->json($device, 201);
    }

    /**
     * Get a specific device
     *
     * Retrieves the details of a specific device by its ID.
     * Admin can see any device, regular users can only see their own devices.
     */
    public function show(Request $request, Device $device)
    {
        $user = $request->user();
        
        // Kiểm tra quyền: chỉ admin hoặc chủ sở hữu mới có thể xem
        if (!$user->hasRole('admin') && $device->user_id != $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($device);
    }

    /**
     * Update a device
     *
     * Updates the details of a specific device.
     * Admin can update any device, regular users can only update their own devices.
     */
    public function update(Request $request, Device $device)
    {
        $user = $request->user();
        
        // Kiểm tra quyền: chỉ admin hoặc chủ sở hữu mới có thể cập nhật
        if (!$user->hasRole('admin') && $device->user_id != $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'device_name' => 'sometimes|string|max:255',
            'serial' => 'nullable|string',
            'plan' => 'nullable|string',
            'is_online' => 'sometimes|boolean',
            'proxy_id' => 'nullable|integer', // Add exists rule when Proxy model is ready
            'note' => 'nullable|string',
            'os_version' => 'nullable|string',
            'device_type' => 'nullable|string',
            'platform' => 'nullable|string',
            'app_version' => 'nullable|string',
            'ip_address' => 'nullable|ip',
            'user_agent' => 'nullable|string',
            'status' => 'sometimes|in:active,inactive,blocked',
        ]);

        $updatedDevice = $this->deviceService->update($device, $validated);

        return response()->json($updatedDevice);
    }

    /**
     * Delete a device
     *
     * Deletes a specific device.
     * Admin can delete any device, regular users can only delete their own devices.
     */
    public function destroy(Request $request, Device $device)
    {
        $user = $request->user();
        
        // Kiểm tra quyền: chỉ admin hoặc chủ sở hữu mới có thể xóa
        if (!$user->hasRole('admin') && $device->user_id != $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $this->deviceService->delete($device);

        return response()->json(null, 204);
    }
}
