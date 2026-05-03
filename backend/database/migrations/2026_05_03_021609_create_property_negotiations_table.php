<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('property_negotiations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('property_id')->constrained()->cascadeOnDelete();
            $table->foreignId('client_id')->nullable()->constrained()->nullOnDelete();

            $table->string('stage')->default('Prospecção');
            $table->unsignedInteger('progress')->default(0);
            $table->string('status')->default('Ativo');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('property_negotiations');
    }
};
