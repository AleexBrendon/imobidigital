<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PublicBotNotification extends Model
{
    protected $fillable = [
        'company_id',
        'client_id',
        'conversation_id',
        'category',
        'title',
        'message',
        'data',
        'read',
    ];

    protected $casts = [
        'data' => 'array',
        'read' => 'boolean',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function conversation()
    {
        return $this->belongsTo(BotConversation::class, 'conversation_id');
    }
}