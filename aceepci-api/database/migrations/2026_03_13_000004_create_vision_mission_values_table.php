<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration : création de la table vision_mission_values.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vision_mission_values', function (Blueprint $table) {
            $table->id();
            $table->string('section_label', 255)->nullable();
            $table->string('title', 255)->nullable();
            $table->string('subtitle', 500)->nullable();
            $table->text('vision_text')->nullable();
            $table->text('mission_text')->nullable();
            $table->text('values_text')->nullable();
            $table->boolean('is_published')->default(false);
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vision_mission_values');
    }
};
