<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('news', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug', 150)->unique();
            $table->foreignId('news_category_id')->nullable()->constrained('news_categories')->nullOnDelete();
            $table->text('excerpt')->nullable();
            $table->longText('content');
            $table->string('cover_image_path')->nullable();
            $table->json('gallery')->nullable();
            $table->boolean('is_published')->default(false);
            $table->timestamp('published_at')->nullable();
            $table->boolean('comments_enabled')->default(true);
            $table->boolean('reactions_enabled')->default(true);
            $table->unsignedSmallInteger('reading_time_minutes')->default(0);
            $table->unsignedBigInteger('views_count')->default(0);
            $table->unsignedInteger('initial_views')->default(0);
            $table->unsignedInteger('likes_count')->default(0);
            $table->unsignedInteger('loves_count')->default(0);
            $table->unsignedInteger('interesting_count')->default(0);
            $table->string('author_name')->nullable();
            $table->string('author_role')->nullable();
            $table->string('author_avatar_path')->nullable();
            $table->foreignId('event_id')->nullable()->constrained('events')->nullOnDelete();
            $table->string('cta_label')->nullable();
            $table->string('cta_link')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('news');
    }
};

