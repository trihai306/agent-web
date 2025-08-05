<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InteractionScenario;
use App\Services\InteractionScenarioService;
use Dedoc\Scramble\Attributes\Group;
use Illuminate\Http\Request;

/**
 * APIs for managing Interaction Scenarios.
 * @authenticated
 */
#[Group('Interaction Scenario Management')]
class InteractionScenarioController extends Controller
{
    protected $interactionScenarioService;

    public function __construct(InteractionScenarioService $interactionScenarioService)
    {
        $this->interactionScenarioService = $interactionScenarioService;
    }

    /**
     * List all interaction scenarios
     *
     * Retrieve a paginated list of all interaction scenarios.
     * Supports searching, filtering, and sorting.
     *
     * @response \Illuminate\Pagination\LengthAwarePaginator<App\Models\InteractionScenario>
     */
    public function index(Request $request)
    {
        return response()->json($this->interactionScenarioService->getAll($request));
    }

    /**
     * Create a new interaction scenario
     *
     * Creates a new interaction scenario with the given details.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'shuffle_actions' => 'sometimes|boolean',
            'run_count' => 'sometimes|boolean',
            'from_count' => 'sometimes|integer|min:1',
            'to_count' => 'sometimes|integer|min:1',
            'status' => 'sometimes|in:active,inactive,draft',
            'settings' => 'nullable|json',
        ]);

        $scenario = $this->interactionScenarioService->create($validated);

        return response()->json($scenario, 201);
    }

    /**
     * Get a specific interaction scenario
     *
     * Retrieves the details of a specific interaction scenario by its ID.
     */
    public function show(InteractionScenario $interactionScenario)
    {
        return response()->json($interactionScenario->load('scripts'));
    }

    /**
     * Update an interaction scenario
     *
     * Updates the details of a specific interaction scenario.
     */
    public function update(Request $request, InteractionScenario $interactionScenario)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'shuffle_actions' => 'sometimes|boolean',
            'run_count' => 'sometimes|boolean',
            'from_count' => 'sometimes|integer|min:1',
            'to_count' => 'sometimes|integer|min:1',
            'status' => 'sometimes|in:active,inactive,draft',
            'settings' => 'nullable|json',
        ]);

        $updatedScenario = $this->interactionScenarioService->update($interactionScenario, $validated);

        return response()->json($updatedScenario);
    }

    /**
     * Delete an interaction scenario
     *
     * Deletes a specific interaction scenario.
     */
    public function destroy(InteractionScenario $interactionScenario)
    {
        $this->interactionScenarioService->delete($interactionScenario);

        return response()->json(null, 204);
    }
}
