<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration : création de la table motto_sections (Notre devise).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('motto_sections', function (Blueprint $table) {
            $table->id();
            $table->string('section_label', 255)->nullable();
            $table->string('title', 255)->nullable();
            $table->string('subtitle', 500)->nullable();
            $table->string('quote', 500)->nullable();
            $table->json('pillars')->nullable();
            $table->boolean('is_published')->default(false);
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('motto_sections');
    }
};

