<?php

namespace App\Providers;

use App\Models\Client;
use App\Models\Document;
use App\Models\Property;
use App\Models\Contract;
use App\Policies\ClientPolicy;
use App\Policies\DocumentPolicy;
use App\Policies\PropertyPolicy;
use App\Policies\ContractPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
{
    Gate::policy(Client::class, ClientPolicy::class);
    Gate::policy(Document::class, DocumentPolicy::class);
    Gate::policy(Property::class, PropertyPolicy::class);
    Gate::policy(Contract::class, ContractPolicy::class);
}
}