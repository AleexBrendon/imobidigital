<?php

namespace App\Models;

use Carbon\Carbon;
use App\Models\Client;
use App\Models\Company;
use App\Models\Scopes\CompanyScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Document extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'client_id',
        'name',
        'type',
        'status',
        'file_path',
        'mime_type',
        'size',
        'validation_date',
        'expiration_date',
    ];

    protected static function booted(): void
    {
        static::addGlobalScope(new CompanyScope);
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function refreshStatus(): void
    {
        if (! $this->expiration_date) {
            $this->status = 'pending';
            $this->save();

            return;
        }

        $expirationDate = Carbon::parse($this->expiration_date)->startOfDay();

        if ($expirationDate->isPast()) {
            $this->status = 'expired';
        } elseif (now()->diffInDays($expirationDate, false) <= 10) {
            $this->status = 'expiring';
        } else {
            $this->status = 'validated';
        }

        $this->save();
    }
}