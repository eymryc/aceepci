<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('devotionals', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug', 150)->unique();
            $table->foreignId('devotional_category_id')->nullable()->constrained('devotional_categories')->nullOnDelete();
            $table->string('scripture_reference', 255)->nullable();
            $table->text('verse_text')->nullable();
            $table->text('excerpt')->nullable();
            $table->longText('content');
            $table->text('practical_application')->nullable();
            $table->text('reflection_questions')->nullable();
            $table->text('prayer')->nullable();
            $table->string('cover_image_path')->nullable();
            $table->string('reading_time', 50)->nullable();
            $table->boolean('is_published')->default(false);
            $table->timestamp('published_at')->nullable();
            $table->boolean('comments_enabled')->default(true);
            $table->boolean('reactions_enabled')->default(true);
            $table->unsignedBigInteger('views_count')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('devotionals');
    }
};
