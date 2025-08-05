<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ScenarioScript extends Model
{
    use HasFactory;

    protected $table = 'scenario_scripts';

    protected $fillable = [
        'scenario_id',
        'order',
        'script',
    ];

    protected $casts = [
        'script' => 'json',
    ];

    public function scenario(): BelongsTo
    {
        return $this->belongsTo(InteractionScenario::class, 'scenario_id');
    }
}
