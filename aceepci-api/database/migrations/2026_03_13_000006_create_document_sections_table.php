<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration : création de la table document_sections (documents officiels).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('document_sections', function (Blueprint $table) {
            $table->id();
            $table->string('section_label', 255)->nullable();
            $table->string('title', 255)->nullable();
            $table->string('subtitle', 500)->nullable();
            $table->json('documents')->nullable();
            $table->boolean('is_published')->default(false);
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('document_sections');
    }
};
