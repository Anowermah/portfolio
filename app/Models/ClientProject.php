<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClientProject extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'service_category',
        'description',
        'budget',
        'paid_status',
        'progress',
        'status',
        'deadline',
        'delivery_link',
        'delivery_notes',
        'client_notes',
    ];

    protected function casts(): array
    {
        return [
            'budget' => 'float',
            'progress' => 'integer',
            'deadline' => 'datetime',
        ];
    }

    /**
     * The client who owns this project.
     */
    public function client()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
