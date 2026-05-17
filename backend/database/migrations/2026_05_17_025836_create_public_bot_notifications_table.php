<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('public_bot_notifications', function (Blueprint $table) {
            $table->id();

            $table->foreignId('company_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('client_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            $table->foreignId('conversation_id')
                ->nullable()
                ->constrained('bot_conversations')
                ->nullOnDelete();

            $table->string('category');

            $table->string('title');

            $table->text('message')->nullable();

            $table->json('data')->nullable();

            $table->boolean('read')->default(false);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('public_bot_notifications');
    }
};
