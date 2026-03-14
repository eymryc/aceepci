<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration : création de la table daily_verses (verset du jour).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('daily_verses', function (Blueprint $table) {
            $table->id();
            $table->text('primary_text');
            $table->string('primary_reference', 100);
            $table->text('secondary_text')->nullable();
            $table->string('secondary_reference', 100)->nullable();
            $table->string('image_url', 2048)->nullable();
            $table->string('image_label', 255)->nullable();
            $table->string('image_quote', 500)->nullable();
            $table->boolean('is_published')->default(false);
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            $table->auditColumns();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('daily_verses');
    }
};
