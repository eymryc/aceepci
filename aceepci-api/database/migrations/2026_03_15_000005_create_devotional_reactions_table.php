<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('devotional_reactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('devotional_id')->constrained('devotionals')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('ip_address', 45)->nullable();
            $table->string('type', 20);
            $table->timestamps();

            $table->index(['devotional_id', 'type']);
            $table->unique(['devotional_id', 'user_id', 'type']);
            $table->unique(['devotional_id', 'ip_address', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('devotional_reactions');
    }
};
