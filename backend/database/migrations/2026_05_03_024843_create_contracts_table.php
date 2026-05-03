<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contracts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('client_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('property_id')->nullable()->constrained()->nullOnDelete();

            $table->string('title');
            $table->string('type')->default('Aluguel');
            $table->string('status')->default('Pendente');

            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();

            $table->decimal('value', 12, 2)->default(0);
            $table->decimal('ai_value', 12, 2)->default(0);
            $table->decimal('fee', 12, 2)->default(0);

            $table->string('code')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contracts');
    }
};
