<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration : remplace organization_stats (CRUD) par organization_sections (singleton avec cartes JSON).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('organization_stats');

        Schema::create('organization_sections', function (Blueprint $table) {
            $table->id();
            $table->string('section_label', 255)->nullable();
            $table->string('title', 255)->nullable();
            $table->string('subtitle', 500)->nullable();
            $table->json('cards')->nullable();
            $table->boolean('is_published')->default(false);
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('organization_sections');

        Schema::create('organization_stats', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('value');
            $table->text('description')->nullable();
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }
};
