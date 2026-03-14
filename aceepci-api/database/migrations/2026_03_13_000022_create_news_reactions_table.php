<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('news_reactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('news_id')->constrained('news')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('ip_address', 45)->nullable();
            $table->string('type', 20);
            $table->timestamps();

            $table->index(['news_id', 'type']);
            $table->unique(['news_id', 'user_id', 'type']);
            $table->unique(['news_id', 'ip_address', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('news_reactions');
    }
};

