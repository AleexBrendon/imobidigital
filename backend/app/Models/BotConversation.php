<?php

namespace App\Models;

use App\Models\Client;
use App\Models\Company;
use App\Models\BotMessage;
use Illuminate\Database\Eloquent\Model;

class BotConversation extends Model
{
    protected $fillable = [
        'company_id',
        'client_id',
        'document',
        'status',
        'current_step',
        'payload',
    ];

    protected $casts = [
        'payload' => 'array',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function messages()
    {
        return $this->hasMany(BotMessage::class);
    }
}