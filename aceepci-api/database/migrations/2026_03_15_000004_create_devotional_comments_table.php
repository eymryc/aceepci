<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('devotional_comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('devotional_id')->constrained('devotionals')->cascadeOnDelete();
            $table->string('author_name');
            $table->string('author_avatar_url')->nullable();
            $table->text('content');
            $table->boolean('is_approved')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('devotional_comments');
    }
};
