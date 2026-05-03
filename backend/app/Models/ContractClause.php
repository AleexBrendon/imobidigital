<?php

namespace App\Models;

use App\Models\Scopes\CompanyScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ContractClause extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'contract_id',
        'title',
        'description',
        'status',
    ];

    protected static function booted(): void
    {
        static::addGlobalScope(new CompanyScope);
    }

    public function contract()
    {
        return $this->belongsTo(Contract::class);
    }
}