<?php

namespace App\Policies;

use App\Models\Property;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class PropertyPolicy
{
    public function view($user, $property): bool
    {
        return $user->company_id === $property->company_id;
    }

    public function create($user): bool
    {
        return true;
    }

    public function update($user, $property): bool
    {
        return $user->company_id === $property->company_id;
    }

    public function delete($user, $property): bool
    {
        return $user->company_id === $property->company_id;
    }
}
