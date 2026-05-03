<?php

namespace App\Policies;

use App\Models\Document;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class DocumentPolicy
{
    public function view($user, $document): bool
    {
        return $user->company_id === $document->company_id;
    }

    public function create($user): bool
    {
        return true;
    }

    public function update($user, $document): bool
    {
        return $user->company_id === $document->company_id;
    }

    public function delete($user, $document): bool
    {
        return $user->company_id === $document->company_id;
    }
}
