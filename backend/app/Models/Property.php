<?php

namespace App\Models;

use App\Models\Scopes\CompanyScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Property extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'title',
        'type',
        'status',
        'area',
        'bedrooms',
        'parking_spaces',
        'price',
        'address',
        'city',
        'state',
    ];

    protected static function booted(): void
    {
        static::addGlobalScope(new CompanyScope);
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function images()
    {
        return $this->hasMany(PropertyImage::class);
    }

    public function negotiations()
    {
        return $this->hasMany(PropertyNegotiation::class);
    }

    public function visits()
    {
        return $this->hasMany(PropertyVisit::class);
    }

    public function contracts()
    {
        return $this->hasMany(Contract::class);
    }
}
