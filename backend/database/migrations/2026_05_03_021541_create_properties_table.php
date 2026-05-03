<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();

            $table->string('title');
            $table->string('type')->default('Apartamento');
            $table->string('status')->default('Disponível');

            $table->decimal('area', 10, 2)->nullable();
            $table->unsignedInteger('bedrooms')->default(0);
            $table->unsignedInteger('parking_spaces')->default(0);
            $table->decimal('price', 12, 2)->default(0);

            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
