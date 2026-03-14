<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration : création de la table president_messages (mot du président).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('president_messages', function (Blueprint $table) {
            $table->id();
            $table->string('section_label', 255)->nullable();
            $table->string('badge', 100)->nullable();
            $table->string('title', 255)->nullable();
            $table->text('salutation')->nullable();
            $table->text('message')->nullable();
            $table->string('quote', 500)->nullable();
            $table->string('image_url', 2048)->nullable();
            $table->boolean('is_published')->default(false);
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            $table->auditColumns();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('president_messages');
    }
};
