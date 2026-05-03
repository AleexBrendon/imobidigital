<?php

namespace App\Models;

use App\Models\Scopes\CompanyScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Contract extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'client_id',
        'property_id',
        'title',
        'type',
        'status',
        'start_date',
        'end_date',
        'value',
        'ai_value',
        'fee',
        'code',
    ];

    protected static function booted(): void
    {
        static::addGlobalScope(new CompanyScope);
    }

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    public function clauses()
    {
        return $this->hasMany(ContractClause::class);
    }

    public function signatureSteps()
    {
        return $this->hasMany(SignatureStep::class)->orderBy('order');
    }

    public function signatureEvents()
    {
        return $this->hasMany(SignatureEvent::class);
    }
}