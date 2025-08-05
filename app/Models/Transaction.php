<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    /**
     * The fields that are searchable.
     *
     * @var array
     */
    public $searchable = ['description'];

    /**
     * The fields that are filterable.
     *
     * @var array
     */
    public $filterable = ['type', 'user_id'];

    /**
     * The fields that are sortable.
     *
     * @var array
     */
    public $sortable = ['amount', 'created_at'];

    protected $fillable = [
        'user_id',
        'type',
        'amount',
        'description',
    ];

    /**
     * Get the user that owns the transaction.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
