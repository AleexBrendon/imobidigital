<?php

namespace App\Policies;

use App\Models\Contract;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ContractPolicy
{
   public function view($user, $contract): bool
{
    return $user->company_id === $contract->company_id;
}

public function create($user): bool
{
    return true;
}

public function update($user, $contract): bool
{
    return $user->company_id === $contract->company_id;
}

public function delete($user, $contract): bool
{
    return $user->company_id === $contract->company_id;
}
}
