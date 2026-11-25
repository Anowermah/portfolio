<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactMessage extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'subject',
        'message',
        'read_status',
        'reply_sent',
    ];

    protected function casts(): array
    {
        return [
            'read_status' => 'boolean',
            'reply_sent' => 'boolean',
            'created_at' => 'datetime',
        ];
    }
}
