<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Scopes\CompanyScope;

class Client extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'name',
        'email',
        'phone',
        'document',
        'type',
        'status',
        'image',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    protected static function booted(): void
    {
        static::addGlobalScope(new CompanyScope);
    }

    public function contracts()
    {
        return $this->hasMany(Contract::class);
    }

    public function documents()
    {
        return $this->hasMany(Document::class);
    }
}
